// Feedback and Doctor Rating System
import { 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  increment,
  getDoc,
  query,
  where,
  getDocs,
  runTransaction
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  feedbackCollection,
  doctorsCollection,
  appointmentsCollection,
  type Feedback,
  type Doctor,
  type Appointment 
} from './firestore-collections';

/**
 * Submit patient feedback and update doctor rating in real-time
 * @param feedbackData - Feedback details
 * @returns Promise with feedback ID
 */
export const submitPatientFeedback = async (
  feedbackData: Omit<Feedback, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    // Validate rating range
    if (feedbackData.rating < 1 || feedbackData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if appointment exists and belongs to the patient
    const appointmentDoc = await getDoc(doc(appointmentsCollection, feedbackData.appointmentId));
    if (!appointmentDoc.exists()) {
      throw new Error('Appointment not found');
    }

    const appointment = appointmentDoc.data() as Appointment;
    if (appointment.patientId !== feedbackData.patientId) {
      throw new Error('Patient can only provide feedback for their own appointments');
    }

    if (appointment.doctorId !== feedbackData.doctorId) {
      throw new Error('Doctor ID mismatch with appointment');
    }

    // Check if feedback already exists for this appointment
    const existingFeedbackQuery = query(
      feedbackCollection,
      where('appointmentId', '==', feedbackData.appointmentId)
    );
    const existingFeedback = await getDocs(existingFeedbackQuery);
    
    if (!existingFeedback.empty) {
      throw new Error('Feedback already submitted for this appointment');
    }

    // Use transaction to ensure data consistency
    const result = await runTransaction(db, async (transaction) => {
      // Get doctor document
      const doctorRef = doc(doctorsCollection, feedbackData.doctorId);
      const doctorDoc = await transaction.get(doctorRef);
      
      if (!doctorDoc.exists()) {
        throw new Error('Doctor not found');
      }

      const doctor = doctorDoc.data() as Doctor;
      
      // Calculate new average rating
      const currentTotal = doctor.averageRating * doctor.totalRatings;
      const newTotalRatings = doctor.totalRatings + 1;
      const newAverageRating = (currentTotal + feedbackData.rating) / newTotalRatings;

      // Create feedback document
      const newFeedback: Omit<Feedback, 'id'> = {
        ...feedbackData,
        healthCenterId: appointment.healthCenterId,
        createdAt: serverTimestamp(),
      };

      const feedbackRef = doc(feedbackCollection);
      transaction.set(feedbackRef, newFeedback);

      // Update doctor rating
      transaction.update(doctorRef, {
        averageRating: Number(newAverageRating.toFixed(2)),
        totalRatings: newTotalRatings,
        updatedAt: serverTimestamp(),
      });

      return feedbackRef.id;
    });

    console.log('Feedback submitted and doctor rating updated successfully');
    return result;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Get feedback for a doctor
 * @param doctorId - Doctor ID
 * @returns Promise with feedback array
 */
export const getDoctorFeedback = async (doctorId: string): Promise<Feedback[]> => {
  try {
    const q = query(
      feedbackCollection,
      where('doctorId', '==', doctorId)
    );
    
    const querySnapshot = await getDocs(q);
    const feedback: Feedback[] = [];
    
    querySnapshot.forEach((doc) => {
      feedback.push({
        id: doc.id,
        ...doc.data(),
      } as Feedback);
    });
    
    // Sort by creation date (newest first)
    feedback.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    
    return feedback;
  } catch (error) {
    console.error('Error getting doctor feedback:', error);
    throw new Error('Failed to get doctor feedback');
  }
};

/**
 * Get feedback for a patient
 * @param patientId - Patient ID
 * @returns Promise with feedback array
 */
export const getPatientFeedback = async (patientId: string): Promise<Feedback[]> => {
  try {
    const q = query(
      feedbackCollection,
      where('patientId', '==', patientId)
    );
    
    const querySnapshot = await getDocs(q);
    const feedback: Feedback[] = [];
    
    querySnapshot.forEach((doc) => {
      feedback.push({
        id: doc.id,
        ...doc.data(),
      } as Feedback);
    });
    
    // Sort by creation date (newest first)
    feedback.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    
    return feedback;
  } catch (error) {
    console.error('Error getting patient feedback:', error);
    throw new Error('Failed to get patient feedback');
  }
};

/**
 * Get doctor statistics including rating and feedback count
 * @param doctorId - Doctor ID
 * @returns Promise with doctor statistics
 */
export const getDoctorStatistics = async (doctorId: string): Promise<{
  averageRating: number;
  totalRatings: number;
  feedbackCount: number;
  ratingDistribution: { [key: number]: number };
}> => {
  try {
    // Get doctor document for rating info
    const doctorDoc = await getDoc(doc(doctorsCollection, doctorId));
    if (!doctorDoc.exists()) {
      throw new Error('Doctor not found');
    }

    const doctor = doctorDoc.data() as Doctor;
    
    // Get all feedback for rating distribution
    const feedback = await getDoctorFeedback(doctorId);
    
    // Calculate rating distribution
    const ratingDistribution: { [key: number]: number } = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    feedback.forEach(fb => {
      ratingDistribution[fb.rating]++;
    });

    return {
      averageRating: doctor.averageRating,
      totalRatings: doctor.totalRatings,
      feedbackCount: feedback.length,
      ratingDistribution,
    };
  } catch (error) {
    console.error('Error getting doctor statistics:', error);
    throw new Error('Failed to get doctor statistics');
  }
};

/**
 * Get top-rated doctors
 * @param limit - Number of doctors to return
 * @returns Promise with top-rated doctors array
 */
export const getTopRatedDoctors = async (limit: number = 10): Promise<Doctor[]> => {
  try {
    const querySnapshot = await getDocs(doctorsCollection);
    const doctors: Doctor[] = [];
    
    querySnapshot.forEach((doc) => {
      doctors.push({
        id: doc.id,
        ...doc.data(),
      } as Doctor);
    });
    
    // Sort by average rating (highest first) and total ratings
    doctors.sort((a, b) => {
      if (b.averageRating === a.averageRating) {
        return b.totalRatings - a.totalRatings; // More ratings is better for tie-breaking
      }
      return b.averageRating - a.averageRating;
    });
    
    return doctors.slice(0, limit);
  } catch (error) {
    console.error('Error getting top-rated doctors:', error);
    throw new Error('Failed to get top-rated doctors');
  }
};