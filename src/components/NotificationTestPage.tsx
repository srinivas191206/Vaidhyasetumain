import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import RealTimeNotificationDropdown from './RealTimeNotificationDropdown';
import { 
  sendAppointmentRequest,
  sendNotification 
} from '@/lib/notification-service';
import { 
  addPatientAndAppointment 
} from '@/lib/patient-appointment-service';
import { Timestamp } from 'firebase/firestore';
import { Bell, Video, Users, TestTube } from 'lucide-react';

export const NotificationTestPage: React.FC = () => {
  const [testConfig, setTestConfig] = useState({
    patientName: 'John Doe',
    symptoms: 'Chest pain and shortness of breath',
    urgency: 'urgent' as 'normal' | 'urgent' | 'emergency',
    doctorId: 'doctor_specialist_001',
    healthCenterId: 'health_center_rajasthan_001',
    healthCenterName: 'Rural Health Center - Rajasthan'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestId, setLastRequestId] = useState('');

  const sendTestRequest = async () => {
    setIsLoading(true);
    try {
      // Create patient and appointment
      const patientData = {
        name: testConfig.patientName,
        age: 35,
        contact: '+91 98765 43210',
        address: 'Village Test, Rajasthan',
        medicalHistory: 'Test patient for notification system',
        allergies: 'None'
      };

      const appointmentData = {
        doctorId: testConfig.doctorId,
        time: Timestamp.fromDate(new Date()),
        symptoms: testConfig.symptoms,
        urgency: testConfig.urgency,
        notes: 'Test consultation request via notification system'
      };

      const result = await addPatientAndAppointment(
        patientData,
        appointmentData,
        testConfig.healthCenterId
      );

      // Send notification
      const notificationId = await sendAppointmentRequest(
        result.appointmentId,
        testConfig.doctorId,
        result.patientId,
        testConfig.patientName,
        testConfig.healthCenterId,
        testConfig.healthCenterName,
        testConfig.urgency,
        testConfig.symptoms,
        new Date()
      );

      setLastRequestId(result.appointmentId);
      alert(`✅ Test notification sent successfully!
      
Appointment ID: ${result.appointmentId}
Notification ID: ${notificationId}
Video Room: ${result.videoRoomId}

The doctor should receive a real-time notification now.`);

    } catch (error) {
      console.error('Error sending test request:', error);
      alert('❌ Failed to send test request: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTestData = () => {
    const timestamp = Date.now();
    setTestConfig({
      ...testConfig,
      patientName: `Test Patient ${timestamp}`,
      symptoms: `Test symptoms ${timestamp} - chest pain and breathing difficulty`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Notification System Test Page
            </CardTitle>
            <p className="text-sm text-gray-600">
              Test the real-time notification system between health centers and doctors.
            </p>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Health Center Simulator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Health Center Portal
                <Badge variant="outline">Sender</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={testConfig.patientName}
                    onChange={(e) => setTestConfig({...testConfig, patientName: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    value={testConfig.symptoms}
                    onChange={(e) => setTestConfig({...testConfig, symptoms: e.target.value})}
                    placeholder="Describe patient symptoms"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select 
                    value={testConfig.urgency} 
                    onValueChange={(value: 'normal' | 'urgent' | 'emergency') => 
                      setTestConfig({...testConfig, urgency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal - Routine consultation</SelectItem>
                      <SelectItem value="urgent">Urgent - Within 1 hour</SelectItem>
                      <SelectItem value="emergency">Emergency - Immediate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="doctorId">Target Doctor ID</Label>
                  <Input
                    id="doctorId"
                    value={testConfig.doctorId}
                    onChange={(e) => setTestConfig({...testConfig, doctorId: e.target.value})}
                    placeholder="Doctor ID to send notification to"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={sendTestRequest} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  {isLoading ? 'Sending...' : 'Send Consultation Request'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={generateTestData}
                >
                  Generate Test Data
                </Button>
              </div>

              {lastRequestId && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Last Request:</strong> {lastRequestId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Doctor Portal Simulator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Doctor Portal
                <Badge variant="outline">Receiver</Badge>
                <div className="ml-auto">
                  <RealTimeNotificationDropdown
                    userId={testConfig.doctorId}
                    userRole="doctor"
                    userName="Dr. Test Specialist"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">How to Test:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Fill out the consultation request form on the left</li>
                    <li>Click "Send Consultation Request"</li>
                    <li>Check the notification bell icon above for new notifications</li>
                    <li>Click on appointment request notifications to accept/decline</li>
                    <li>Test different urgency levels for different expiration times</li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Current Configuration:</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Doctor ID:</strong> {testConfig.doctorId}</p>
                    <p><strong>Health Center:</strong> {testConfig.healthCenterName}</p>
                    <p><strong>Health Center ID:</strong> {testConfig.healthCenterId}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">Notification Types:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>🔵 <strong>Normal:</strong> 24 hour expiration</li>
                    <li>🟠 <strong>Urgent:</strong> 2 hour expiration</li>
                    <li>🔴 <strong>Emergency:</strong> 15 minute expiration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">1. Send Request</h4>
                <p className="text-blue-800">
                  Health center sends consultation request with patient details and urgency level.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">2. Real-time Notification</h4>
                <p className="text-green-800">
                  Doctor receives instant notification with patient details and can accept/decline.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">3. Sync Response</h4>
                <p className="text-purple-800">
                  Health center gets real-time response notification about doctor's decision.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationTestPage;