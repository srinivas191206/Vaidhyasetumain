import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  Users, 
  Phone, 
  Video, 
  AlertTriangle, 
  Heart, 
  Activity,
  Clock,
  MapPin,
  User,
  Plus,
  Send,
  Stethoscope,
  FileText,
  MessageCircle,
  Eye,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Minus
} from "lucide-react";
import VideoConsultation from "./VideoConsultation";
import { 
  addPatientAndAppointment 
} from "@/lib/patient-appointment-service";
import { 
  sendAppointmentRequest,
  listenToUserNotifications,
  type Notification 
} from "@/lib/notification-service";
import { Timestamp } from '@/lib/firebase';

interface RuralCenterDashboardProps {
  centerName: string;
  onLogout: () => void;
}

const RuralCenterDashboard = ({ centerName, onLogout }: RuralCenterDashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [consultationDialog, setConsultationDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientRecordsDialog, setPatientRecordsDialog] = useState(false);
  const [emergencyDialog, setEmergencyDialog] = useState(false);
  const [videoConsultation, setVideoConsultation] = useState<{
    isOpen: boolean;
    patient: any;
  }>({ isOpen: false, patient: null });
  const [chatDialog, setChatDialog] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  
  // Health Center configuration
  const healthCenterId = "health_center_rajasthan_001";
  const healthCenterName = centerName;
  
  // Medicine Inventory State
  const [inventoryDialog, setInventoryDialog] = useState(false);
  const [inventoryRequestDialog, setInventoryRequestDialog] = useState(false);
  const [medicineRequests, setMedicineRequests] = useState<any[]>([]);
  const [requestForm, setRequestForm] = useState({
    medicineName: "",
    quantity: "",
    urgency: "normal",
    reason: "",
    currentStock: ""
  });
  
  // Patient Registration State
  const [patientRegistrationDialog, setPatientRegistrationDialog] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    condition: "",
    symptoms: "",
    medicalHistory: "",
    allergies: "",
    emergencyContact: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: ""
  });
  const [registeredPatients, setRegisteredPatients] = useState([
    {
      name: "Sita Sharma",
      age: 52,
      appointment: "11:00 AM",
      type: "Follow-up",
      condition: "Hypertension",
      patientId: "RHC001",
      phone: "+91 98765 43210",
      address: "Village Kumarganj, Rajasthan",
      medicalHistory: "Diagnosed with hypertension 2 years ago. Currently on Amlodipine 5mg.",
      allergies: "None known",
      lastVisit: "2024-08-15",
      vitals: {
        bloodPressure: "145/90",
        heartRate: "78 bpm",
        temperature: "98.4°F",
        weight: "65 kg"
      }
    },
    {
      name: "Gopal Singh",
      age: 41,
      appointment: "2:00 PM",
      type: "Initial Consultation",
      condition: "Chest discomfort",
      patientId: "RHC002",
      phone: "+91 97654 32109",
      address: "Village Bharatpur, Rajasthan",
      medicalHistory: "No significant past medical history. Family history of heart disease.",
      allergies: "Penicillin",
      lastVisit: "First visit",
      vitals: {
        bloodPressure: "130/85",
        heartRate: "85 bpm",
        temperature: "98.6°F",
        weight: "72 kg"
      }
    }
  ]);
  const [consultationRequest, setConsultationRequest] = useState({
    patientName: "",
    age: "",
    condition: "",
    symptoms: "",
    vitals: "",
    urgency: "normal"
  });

  // Listen to notifications for appointment responses
  useEffect(() => {
    const unsubscribe = listenToUserNotifications(healthCenterId, (newNotifications) => {
      setNotifications(newNotifications);
      
      // Check for appointment accepted/rejected notifications
      const latestNotification = newNotifications[0];
      if (latestNotification && 
          (latestNotification.type === 'appointment_accepted' || 
           latestNotification.type === 'appointment_rejected') &&
          latestNotification.status === 'pending') {
        
        // Show toast or alert for the response
        if (latestNotification.type === 'appointment_accepted') {
          alert(`Good news! ${latestNotification.fromUserName} has accepted the consultation request for ${latestNotification.data?.patientName}`);
        } else {
          alert(`${latestNotification.fromUserName} declined the consultation request for ${latestNotification.data?.patientName}. Reason: ${latestNotification.data?.rejectionReason}`);
        }
      }
    });

    return unsubscribe;
  }, [healthCenterId]);

  const emergencyPatients = [
    {
      name: "Meera Devi",
      age: 45,
      condition: "Severe chest pain",
      vitals: "BP: 160/95, HR: 95 bpm",
      time: "10 minutes ago",
      priority: "Critical"
    },
    {
      name: "Ram Prasad",
      age: 58,
      condition: "Shortness of breath",
      vitals: "BP: 145/90, HR: 88 bpm",
      time: "25 minutes ago",
      priority: "High"
    }
  ];

  const availableSpecialists = [
    {
      name: "Dr. Varun Sharma",
      specialty: "Cardiology",
      status: "Available",
      hospital: "AIIMS Delhi",
      responseTime: "< 5 minutes",
      id: "specialist1",
      avatar: "VS",
      online: true
    },
    {
      name: "Dr. Priya Mehta",
      specialty: "Cardiology",
      status: "In Consultation",
      hospital: "Fortis Mumbai",
      responseTime: "15 minutes",
      id: "specialist2",
      avatar: "PM",
      online: true
    },
    {
      name: "Dr. Rajesh Kumar",
      specialty: "Internal Medicine",
      status: "Available",
      hospital: "SGPGI Lucknow",
      responseTime: "< 3 minutes",
      id: "specialist3",
      avatar: "RK",
      online: true
    }
  ];

  // Medicine Inventory Data
  const currentInventory = [
    { 
      name: "Paracetamol 500mg", 
      currentStock: 120, 
      minRequired: 200, 
      status: "low",
      expiry: "Dec 2024",
      category: "Analgesic"
    },
    { 
      name: "Aspirin 75mg", 
      currentStock: 50, 
      minRequired: 100, 
      status: "critical",
      expiry: "Jan 2025",
      category: "Cardiology"
    },
    { 
      name: "Amoxicillin 250mg", 
      currentStock: 80, 
      minRequired: 150, 
      status: "low",
      expiry: "Nov 2024",
      category: "Antibiotic"
    },
    { 
      name: "ORS Sachets", 
      currentStock: 200, 
      minRequired: 100, 
      status: "good",
      expiry: "Mar 2025",
      category: "Rehydration"
    },
    { 
      name: "Insulin (Vial)", 
      currentStock: 5, 
      minRequired: 20, 
      status: "critical",
      expiry: "Oct 2024",
      category: "Diabetes"
    },
    { 
      name: "Blood Pressure Strips", 
      currentStock: 30, 
      minRequired: 50, 
      status: "low",
      expiry: "Feb 2025",
      category: "Diagnostic"
    }
  ];

  const requestConsultation = (patient: any) => {
    if (patient.priority === "Critical") {
      // Direct emergency video consultation
      setVideoConsultation({
        isOpen: true,
        patient: {
          name: patient.name,
          age: patient.age,
          condition: patient.condition,
          time: "Emergency",
          urgent: true,
          bloodPressure: patient.vitals?.split(", ")[0]?.split(": ")[1] || "160/95",
          heartRate: patient.vitals?.split(", ")[1]?.split(": ")[1] || "95 bpm",
          symptoms: patient.condition
        }
      });
    } else {
      alert(`Consultation requested for ${patient.name}. Specialist will be notified.`);
    }
  };

  const handleConsultationSubmit = async () => {
    if (!consultationRequest.patientName || !consultationRequest.condition) {
      alert("Please fill in patient name and condition");
      return;
    }
    
    // Validate doctor selection
    const doctorId = "doctor_specialist_001";
    if (!doctorId) {
      alert("Please select a specialist doctor");
      return;
    }
    
    setIsSubmittingRequest(true);
    
    try {
      console.log('Starting consultation request submission');
      
      // Create patient and appointment first
      const patientData = {
        name: consultationRequest.patientName,
        age: parseInt(consultationRequest.age) || 0,
        contact: "Unknown", // Could be enhanced to collect phone
        address: "Village address", // Could be enhanced
        medicalHistory: "To be updated",
        allergies: "Unknown"
      };
      
      console.log('Patient data:', patientData);
      
      const appointmentData = {
        doctorId,
        time: Timestamp.fromDate(new Date()), // Current time for immediate consultation
        symptoms: consultationRequest.symptoms || consultationRequest.condition,
        urgency: consultationRequest.urgency as 'normal' | 'urgent' | 'emergency',
        notes: `Vitals: ${consultationRequest.vitals}`
      };
      
      console.log('Appointment data:', appointmentData);
      console.log('Health center ID:', healthCenterId);
      
      // Create patient and appointment
      const result = await addPatientAndAppointment(
        patientData,
        appointmentData,
        healthCenterId
      );
      
      console.log('Patient and appointment creation result:', result);
      
      // Check if result has all required fields
      if (!result || !result.appointmentId || !result.patientId) {
        throw new Error('Failed to create patient and appointment');
      }
      
      // Send notification to doctor
      console.log('Sending appointment request notification');
      await sendAppointmentRequest(
        result.appointmentId,
        doctorId,
        result.patientId,
        consultationRequest.patientName,
        healthCenterId,
        healthCenterName,
        consultationRequest.urgency as 'normal' | 'urgent' | 'emergency',
        consultationRequest.symptoms || consultationRequest.condition,
        new Date()
      );
      
      alert(`Consultation request sent successfully! \nAppointment ID: ${result.appointmentId}\nVideo Room: ${result.videoRoomId}\n\nThe doctor will be notified and can accept or decline the request.`);
      
      setConsultationDialog(false);
      // Reset form
      setConsultationRequest({
        patientName: "",
        age: "",
        condition: "",
        symptoms: "",
        vitals: "",
        urgency: "normal"
      });
      
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      // Provide more detailed error message
      if (error instanceof Error) {
        alert(`Failed to submit consultation request: ${error.message}. Please try again.`);
      } else {
        alert('Failed to submit consultation request. Please try again.');
      }
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const openPatientRecords = (patient: any) => {
    setSelectedPatient(patient);
    setPatientRecordsDialog(true);
  };

  const handleEmergency = () => {
    // Open emergency consultation request
    setConsultationRequest({
      ...consultationRequest,
      urgency: "emergency"
    });
    setEmergencyDialog(false);
    setConsultationDialog(true);
  };

  const startChat = (specialist: any) => {
    setSelectedSpecialist(specialist);
    // Initialize chat with welcome message from specialist
    setMessages([
      {
        id: 1,
        sender: specialist.name,
        message: `Hello! This is ${specialist.name} from ${specialist.hospital}. How can I assist you today?`,
        timestamp: new Date().toLocaleTimeString(),
        isSpecialist: true
      }
    ]);
    setChatDialog(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      sender: "Rural Health Center",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      isSpecialist: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate specialist response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Thank you for sharing that information. Can you provide more details about the patient's symptoms?",
        "I understand. Based on what you've described, I recommend we schedule a video consultation.",
        "That sounds concerning. Let me review the patient's vitals. Can you share the latest readings?",
        "I'll need to see the patient directly. Can we start a video consultation now?",
        "Based on your description, this requires immediate attention. Let's begin an emergency consultation."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const specialistResponse = {
        id: messages.length + 2,
        sender: selectedSpecialist.name,
        message: randomResponse,
        timestamp: new Date().toLocaleTimeString(),
        isSpecialist: true
      };
      
      setMessages(prev => [...prev, specialistResponse]);
    }, 2000);
  };

  const startVideoFromChat = () => {
    setChatDialog(false);
    setVideoConsultation({
      isOpen: true,
      patient: {
        name: "Patient via Chat",
        age: 0,
        condition: "Consultation requested via chat",
        time: "Now",
        urgent: false,
        symptoms: "Discussed in chat"
      }
    });
  };

  // Medicine Inventory Functions
  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "low": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "good": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return AlertCircle;
      case "low": return AlertTriangle;
      case "good": return CheckCircle;
      default: return Package;
    }
  };

  const submitMedicineRequest = () => {
    if (!requestForm.medicineName || !requestForm.quantity || !requestForm.reason) {
      alert("Please fill in all required fields");
      return;
    }

    const newRequest = {
      id: Date.now(),
      medicineName: requestForm.medicineName,
      quantity: parseInt(requestForm.quantity),
      urgency: requestForm.urgency,
      reason: requestForm.reason,
      currentStock: parseInt(requestForm.currentStock) || 0,
      requestDate: new Date().toLocaleDateString(),
      status: "pending",
      centerName: centerName
    };

    setMedicineRequests(prev => [newRequest, ...prev]);
    
    // Reset form
    setRequestForm({
      medicineName: "",
      quantity: "",
      urgency: "normal",
      reason: "",
      currentStock: ""
    });
    
    setInventoryRequestDialog(false);
    alert("Medicine request sent to admin successfully!");
  };

  // Patient Registration Functions
  const generatePatientId = () => {
    const existingIds = registeredPatients.map(p => p.patientId);
    let newId;
    let counter = registeredPatients.length + 1;
    do {
      newId = `RHC${counter.toString().padStart(3, '0')}`;
      counter++;
    } while (existingIds.includes(newId));
    return newId;
  };

  const getCurrentAppointmentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const submitPatientRegistration = () => {
    if (!registrationForm.name || !registrationForm.age || !registrationForm.condition) {
      alert("Please fill in all required fields (Name, Age, and Primary Condition)");
      return;
    }

    const newPatient = {
      name: registrationForm.name,
      age: parseInt(registrationForm.age),
      appointment: getCurrentAppointmentTime(),
      type: "New Registration",
      condition: registrationForm.condition,
      patientId: generatePatientId(),
      phone: registrationForm.phone || "Not provided",
      address: registrationForm.address || "Not provided",
      medicalHistory: registrationForm.medicalHistory || "No previous medical history available",
      allergies: registrationForm.allergies || "None known",
      lastVisit: "Today",
      vitals: {
        bloodPressure: registrationForm.bloodPressure || "Not measured",
        heartRate: registrationForm.heartRate || "Not measured",
        temperature: registrationForm.temperature || "Not measured",
        weight: registrationForm.weight || "Not measured"
      },
      gender: registrationForm.gender,
      symptoms: registrationForm.symptoms,
      emergencyContact: registrationForm.emergencyContact
    };

    setRegisteredPatients(prev => [newPatient, ...prev]);
    
    // Reset form
    setRegistrationForm({
      name: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
      condition: "",
      symptoms: "",
      medicalHistory: "",
      allergies: "",
      emergencyContact: "",
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: ""
    });
    
    setPatientRegistrationDialog(false);
    alert(`Patient ${newPatient.name} registered successfully! Patient ID: ${newPatient.patientId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-green-500/10 text-green-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{centerName}</h1>
              <p className="text-xs text-muted-foreground">Rural Health Center Portal</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Connected to Vaidhya Setu</span>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Emergency Section */}
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Emergency Patients</span>
              <Badge variant="destructive">{emergencyPatients.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emergencyPatients.map((patient, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{patient.name}, {patient.age}</h4>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{patient.condition}</p>
                    <p className="text-xs text-muted-foreground">{patient.vitals}</p>
                    <p className="text-xs text-muted-foreground">{patient.time}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge variant="destructive" className="text-xs">
                    {patient.priority}
                  </Badge>
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => requestConsultation(patient)}
                  >
                    <Video className="w-3 h-3 mr-1" />
                    {patient.priority === "Critical" ? "Start Emergency Call" : "Request Consultation"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Medicine Inventory */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span>Medicine Inventory</span>
                </div>
                <Dialog open={inventoryDialog} onOpenChange={setInventoryDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      View All
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Complete Medicine Inventory</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[500px] pr-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {currentInventory.map((medicine, index) => {
                          const StatusIcon = getStockStatusIcon(medicine.status);
                          return (
                            <Card key={index} className={`border-2 ${getStockStatusColor(medicine.status)}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <StatusIcon className="w-4 h-4" />
                                    <h3 className="font-semibold text-sm">{medicine.name}</h3>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    {medicine.category}
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span>Current Stock:</span>
                                    <span className="font-medium">{medicine.currentStock}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Min Required:</span>
                                    <span className="font-medium">{medicine.minRequired}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Expiry:</span>
                                    <span className="font-medium">{medicine.expiry}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className={`font-medium capitalize`}>
                                      {medicine.status}
                                    </span>
                                  </div>
                                </div>
                                {medicine.status !== "good" && (
                                  <Button 
                                    size="sm" 
                                    className="w-full mt-3"
                                    onClick={() => {
                                      setRequestForm({
                                        ...requestForm,
                                        medicineName: medicine.name,
                                        currentStock: medicine.currentStock.toString(),
                                        quantity: (medicine.minRequired - medicine.currentStock).toString()
                                      });
                                      setInventoryDialog(false);
                                      setInventoryRequestDialog(true);
                                    }}
                                  >
                                    <ShoppingCart className="w-3 h-3 mr-1" />
                                    Request Supply
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentInventory.filter(med => med.status !== "good").slice(0, 4).map((medicine, index) => {
                const StatusIcon = getStockStatusIcon(medicine.status);
                return (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground text-sm">{medicine.name}</h4>
                      <Badge 
                        variant="secondary"
                        className={`text-xs ${getStockStatusColor(medicine.status)}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {medicine.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Stock: {medicine.currentStock}</span>
                      <span>Req: {medicine.minRequired}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => {
                        setRequestForm({
                          ...requestForm,
                          medicineName: medicine.name,
                          currentStock: medicine.currentStock.toString(),
                          quantity: (medicine.minRequired - medicine.currentStock).toString()
                        });
                        setInventoryRequestDialog(true);
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Request
                    </Button>
                  </div>
                );
              })}
              
              <Dialog open={inventoryRequestDialog} onOpenChange={setInventoryRequestDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Request Medicine
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Request Medicine from Admin</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="medicineName">Medicine Name *</Label>
                      <Input
                        id="medicineName"
                        value={requestForm.medicineName}
                        onChange={(e) => setRequestForm({...requestForm, medicineName: e.target.value})}
                        placeholder="Enter medicine name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentStock">Current Stock</Label>
                        <Input
                          id="currentStock"
                          type="number"
                          value={requestForm.currentStock}
                          onChange={(e) => setRequestForm({...requestForm, currentStock: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity Needed *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={requestForm.quantity}
                          onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                          placeholder="Enter quantity"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <select 
                        id="urgency"
                        value={requestForm.urgency}
                        onChange={(e) => setRequestForm({...requestForm, urgency: e.target.value})}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason for Request *</Label>
                      <Textarea
                        id="reason"
                        value={requestForm.reason}
                        onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                        placeholder="Explain why this medicine is needed"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setInventoryRequestDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={submitMedicineRequest}>
                      <Send className="w-4 h-4 mr-1" />
                      Send Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          {/* Today's Patients */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Today's Patients</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {registeredPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground">{patient.name}, {patient.age}</h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{patient.appointment}</span>
                        <span>•</span>
                        <span>{patient.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{patient.condition}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openPatientRecords(patient)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Records
                  </Button>
                </div>
              ))}
              
              <Dialog open={patientRegistrationDialog} onOpenChange={setPatientRegistrationDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Register New Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">Basic Information</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="patientName">Full Name *</Label>
                          <Input
                            id="patientName"
                            value={registrationForm.name}
                            onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                            placeholder="Enter patient full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="patientAge">Age *</Label>
                          <Input
                            id="patientAge"
                            type="number"
                            value={registrationForm.age}
                            onChange={(e) => setRegistrationForm({...registrationForm, age: e.target.value})}
                            placeholder="Patient age"
                            min="0"
                            max="120"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <select 
                            id="gender"
                            value={registrationForm.gender}
                            onChange={(e) => setRegistrationForm({...registrationForm, gender: e.target.value})}
                            className="w-full p-2 border rounded-md bg-background"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={registrationForm.phone}
                            onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyContact">Emergency Contact</Label>
                          <Input
                            id="emergencyContact"
                            value={registrationForm.emergencyContact}
                            onChange={(e) => setRegistrationForm({...registrationForm, emergencyContact: e.target.value})}
                            placeholder="Emergency contact number"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={registrationForm.address}
                          onChange={(e) => setRegistrationForm({...registrationForm, address: e.target.value})}
                          placeholder="Complete address with village/town details"
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">Medical Information</h3>
                      <div>
                        <Label htmlFor="primaryCondition">Primary Condition/Complaint *</Label>
                        <Input
                          id="primaryCondition"
                          value={registrationForm.condition}
                          onChange={(e) => setRegistrationForm({...registrationForm, condition: e.target.value})}
                          placeholder="e.g., Chest pain, Fever, Hypertension"
                        />
                      </div>
                      <div>
                        <Label htmlFor="symptoms">Current Symptoms</Label>
                        <Textarea
                          id="symptoms"
                          value={registrationForm.symptoms}
                          onChange={(e) => setRegistrationForm({...registrationForm, symptoms: e.target.value})}
                          placeholder="Describe current symptoms and duration"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="medicalHistory">Medical History</Label>
                        <Textarea
                          id="medicalHistory"
                          value={registrationForm.medicalHistory}
                          onChange={(e) => setRegistrationForm({...registrationForm, medicalHistory: e.target.value})}
                          placeholder="Previous illnesses, surgeries, family history"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="allergies">Known Allergies</Label>
                        <Input
                          id="allergies"
                          value={registrationForm.allergies}
                          onChange={(e) => setRegistrationForm({...registrationForm, allergies: e.target.value})}
                          placeholder="e.g., Penicillin, Nuts, None known"
                        />
                      </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">Vital Signs (if available)</h3>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="bloodPressure">Blood Pressure</Label>
                          <Input
                            id="bloodPressure"
                            value={registrationForm.bloodPressure}
                            onChange={(e) => setRegistrationForm({...registrationForm, bloodPressure: e.target.value})}
                            placeholder="120/80"
                          />
                        </div>
                        <div>
                          <Label htmlFor="heartRate">Heart Rate</Label>
                          <Input
                            id="heartRate"
                            value={registrationForm.heartRate}
                            onChange={(e) => setRegistrationForm({...registrationForm, heartRate: e.target.value})}
                            placeholder="72 bpm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="temperature">Temperature</Label>
                          <Input
                            id="temperature"
                            value={registrationForm.temperature}
                            onChange={(e) => setRegistrationForm({...registrationForm, temperature: e.target.value})}
                            placeholder="98.6°F"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Weight</Label>
                          <Input
                            id="weight"
                            value={registrationForm.weight}
                            onChange={(e) => setRegistrationForm({...registrationForm, weight: e.target.value})}
                            placeholder="65 kg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setPatientRegistrationDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={submitPatientRegistration} className="bg-green-600 hover:bg-green-700">
                      <User className="w-4 h-4 mr-1" />
                      Register Patient
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Available Specialists */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span>Available Specialists</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableSpecialists.map((specialist, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground text-sm">{specialist.name}</h4>
                    <Badge 
                      variant={specialist.status === "Available" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {specialist.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{specialist.specialty}</p>
                  <p className="text-xs text-muted-foreground">{specialist.hospital}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary">{specialist.responseTime}</span>
                  </div>
                  {specialist.status === "Available" ? (
                    <div className="flex flex-col space-y-1 mt-2">
                      <Button 
                        size="sm" 
                        className="w-full" 
                        variant="outline"
                        onClick={() => startChat(specialist)}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Chat Now
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-full medical-gradient text-white"
                        onClick={() => {
                          setVideoConsultation({
                            isOpen: true,
                            patient: {
                              name: "Direct Consultation",
                              age: 0,
                              condition: "Direct specialist consultation",
                              time: "Now",
                              urgent: false,
                              symptoms: "Direct consultation request"
                            }
                          });
                        }}
                      >
                        <Video className="w-3 h-3 mr-1" />
                        Video Call
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" className="w-full mt-2" variant="outline" disabled>
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Busy
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Dialog open={consultationDialog} onOpenChange={setConsultationDialog}>
            <DialogTrigger asChild>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mx-auto mb-3 w-fit">
                    <Video className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Request Consultation</h3>
                  <p className="text-xs text-muted-foreground">Connect with specialists</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Specialist Consultation</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={consultationRequest.patientName}
                      onChange={(e) => setConsultationRequest({...consultationRequest, patientName: e.target.value})}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={consultationRequest.age}
                      onChange={(e) => setConsultationRequest({...consultationRequest, age: e.target.value})}
                      placeholder="Patient age"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="condition">Primary Condition/Complaint *</Label>
                  <Input
                    id="condition"
                    value={consultationRequest.condition}
                    onChange={(e) => setConsultationRequest({...consultationRequest, condition: e.target.value})}
                    placeholder="e.g., Chest pain, Shortness of breath"
                  />
                </div>
                <div>
                  <Label htmlFor="symptoms">Symptoms & Duration</Label>
                  <Textarea
                    id="symptoms"
                    value={consultationRequest.symptoms}
                    onChange={(e) => setConsultationRequest({...consultationRequest, symptoms: e.target.value})}
                    placeholder="Describe symptoms, when they started, severity, etc."
                    className="min-h-20"
                  />
                </div>
                <div>
                  <Label htmlFor="vitals">Current Vitals</Label>
                  <Input
                    id="vitals"
                    value={consultationRequest.vitals}
                    onChange={(e) => setConsultationRequest({...consultationRequest, vitals: e.target.value})}
                    placeholder="BP: 120/80, HR: 72 bpm, Temp: 98.6°F"
                  />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={consultationRequest.urgency}
                    onChange={(e) => setConsultationRequest({...consultationRequest, urgency: e.target.value})}
                  >
                    <option value="normal">Normal - Can wait for scheduled consultation</option>
                    <option value="urgent">Urgent - Needs consultation within 1 hour</option>
                    <option value="emergency">Emergency - Immediate consultation required</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setConsultationDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConsultationSubmit} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmittingRequest}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {isSubmittingRequest ? "Sending Request..." : "Send Consultation Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setPatientRecordsDialog(true)}>
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mx-auto mb-3 w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Patient Records</h3>
              <p className="text-xs text-muted-foreground">View medical history</p>
            </CardContent>
          </Card>
          
          <Dialog open={emergencyDialog} onOpenChange={setEmergencyDialog}>
            <DialogTrigger asChild>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200 bg-red-50/50 dark:bg-red-950/20">
                <CardContent className="p-6 text-center">
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 mx-auto mb-3 w-fit">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Emergency</h3>
                  <p className="text-xs text-muted-foreground">Immediate specialist help</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Emergency Consultation</span>
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground mb-4">
                  This will initiate an immediate emergency consultation request with available specialists.
                </p>
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Emergency Protocol:</h4>
                  <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                    <li>• Patient will be connected to next available specialist</li>
                    <li>• All vital signs should be ready</li>
                    <li>• Have patient's medical history available</li>
                    <li>• Ensure stable internet connection for video call</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEmergencyDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEmergency} className="bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Start Emergency Consultation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Center Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Health Center Information</span>
              </div>
              {medicineRequests.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <FileText className="w-3 h-3 mr-1" />
                      Medicine Requests ({medicineRequests.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Medicine Request History</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[400px] pr-4">
                      <div className="space-y-3">
                        {medicineRequests.map((request, index) => (
                          <Card key={index} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-foreground">{request.medicineName}</h3>
                                  <p className="text-sm text-muted-foreground">Quantity: {request.quantity} units</p>
                                </div>
                                <div className="text-right">
                                  <Badge 
                                    variant={request.urgency === "emergency" ? "destructive" : 
                                            request.urgency === "urgent" ? "secondary" : "outline"}
                                    className="mb-1"
                                  >
                                    {request.urgency}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">{request.requestDate}</p>
                                </div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground mb-1">Current Stock:</p>
                                  <p className="font-medium">{request.currentStock} units</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground mb-1">Status:</p>
                                  <Badge variant="secondary" className="text-xs">
                                    {request.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="mt-3">
                                <p className="text-muted-foreground text-sm mb-1">Reason:</p>
                                <p className="text-sm bg-muted/50 p-2 rounded">{request.reason}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Center Details</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Name: {centerName}</p>
                  <p>District: Jaipur, Rajasthan</p>
                  <p>PIN Code: 302001</p>
                  <p>Phone: +91 141 2234567</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Staff on Duty</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Dr. Rajesh Kumar (MBBS)</p>
                  <p>Nurse Priya Sharma</p>
                  <p>ANM Sunita Devi</p>
                  <p>Pharmacist Ram Lal</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Today's Statistics</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Patients Registered: {registeredPatients.length}</p>
                  <p>Consultations: 8</p>
                  <p>Emergency Cases: {emergencyPatients.length}</p>
                  <p>Specialists Connected: 3</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Dialog */}
        <Dialog open={chatDialog} onOpenChange={setChatDialog}>
          <DialogContent className="max-w-2xl h-[600px] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {selectedSpecialist?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span>Chat with {selectedSpecialist?.name}</span>
                  <div className="text-sm text-muted-foreground font-normal">
                    {selectedSpecialist?.specialty} • {selectedSpecialist?.hospital}
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Online</span>
                    </div>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4 border rounded-lg bg-muted/20">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSpecialist ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isSpecialist
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        message.isSpecialist ? 'text-muted-foreground' : 'text-primary-foreground/70'
                      }`}>
                        <span>{message.sender}</span>
                        <span>{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Chat Input */}
            <div className="flex items-center space-x-2 mt-4">
              <Input
                placeholder="Type your message to the specialist..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                💡 Tip: Use chat for quick questions, video call for detailed consultations
              </div>
              <Button 
                onClick={startVideoFromChat} 
                size="sm" 
                className="medical-gradient"
              >
                <Video className="w-3 h-3 mr-1" />
                Start Video Call
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Patient Records Dialog */}
        <Dialog open={patientRecordsDialog} onOpenChange={setPatientRecordsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Patient Records - Today's Patients</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[600px]">
              <div className="grid gap-4">
                {registeredPatients.map((patient, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{patient.name}, {patient.age}</h3>
                          <Badge variant="outline">{patient.patientId}</Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Basic Information</h4>
                            <div className="space-y-1 text-muted-foreground">
                              <p><strong>Condition:</strong> {patient.condition}</p>
                              <p><strong>Phone:</strong> {patient.phone}</p>
                              <p><strong>Address:</strong> {patient.address}</p>
                              <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
                              <p><strong>Allergies:</strong> {patient.allergies}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Current Vitals</h4>
                            <div className="space-y-1 text-muted-foreground">
                              <p><strong>Blood Pressure:</strong> {patient.vitals.bloodPressure}</p>
                              <p><strong>Heart Rate:</strong> {patient.vitals.heartRate}</p>
                              <p><strong>Temperature:</strong> {patient.vitals.temperature}</p>
                              <p><strong>Weight:</strong> {patient.vitals.weight}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <h4 className="font-medium text-foreground mb-2">Medical History</h4>
                          <p className="text-sm text-muted-foreground">{patient.medicalHistory}</p>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setConsultationRequest({
                                patientName: patient.name,
                                age: patient.age.toString(),
                                condition: patient.condition,
                                symptoms: "",
                                vitals: `${patient.vitals.bloodPressure}, ${patient.vitals.heartRate}`,
                                urgency: "normal"
                              });
                              setPatientRecordsDialog(false);
                              setConsultationDialog(true);
                            }}
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Request Consultation
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-3 h-3 mr-1" />
                            Full History
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Video Consultation Modal */}
        <VideoConsultation
          isOpen={videoConsultation.isOpen}
          onClose={() => setVideoConsultation({ isOpen: false, patient: null })}
          patient={videoConsultation.patient || {}}
        />
      </main>
    </div>
  );
};

export default RuralCenterDashboard;