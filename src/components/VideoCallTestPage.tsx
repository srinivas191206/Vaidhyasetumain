import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VideoCallInterface } from './VideoCallInterface';
import { checkWebRTCSupport } from '@/lib/webrtc-video-call';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, AlertTriangle, TestTube } from 'lucide-react';

interface TestConfiguration {
  appointmentId: string;
  userId: string;
  userRole: 'doctor' | 'patient';
  patientName: string;
  doctorName: string;
}

export const VideoCallTestPage: React.FC = () => {
  const [isTestingCall, setIsTestingCall] = useState(false);
  const [testConfig, setTestConfig] = useState<TestConfiguration>({
    appointmentId: `test_appointment_${Date.now()}`,
    userId: `test_user_${Date.now()}`,
    userRole: 'doctor',
    patientName: 'John Doe',
    doctorName: 'Dr. Smith'
  });

  const [webRTCSupported, setWebRTCSupported] = useState(checkWebRTCSupport());

  const startTest = () => {
    if (!testConfig.appointmentId || !testConfig.userId) {
      alert('Please fill in all required fields');
      return;
    }
    setIsTestingCall(true);
  };

  const endTest = () => {
    setIsTestingCall(false);
  };

  const generateNewTestData = () => {
    const timestamp = Date.now();
    setTestConfig({
      ...testConfig,
      appointmentId: `test_appointment_${timestamp}`,
      userId: `test_user_${timestamp}`
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
              WebRTC Video Call Test Interface
            </CardTitle>
            <p className="text-sm text-gray-600">
              Test the video consultation feature with different user roles and configurations.
            </p>
          </CardHeader>
        </Card>

        {/* WebRTC Support Check */}
        {!webRTCSupported && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your browser does not support WebRTC video calling. Please use a modern browser like Chrome, Firefox, or Safari.
            </AlertDescription>
          </Alert>
        )}

        {!isTestingCall ? (
          /* Test Configuration */
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <p className="text-sm text-gray-600">
                Configure the test parameters to simulate different user roles and scenarios.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentId">Appointment ID</Label>
                  <Input
                    id="appointmentId"
                    value={testConfig.appointmentId}
                    onChange={(e) => setTestConfig({...testConfig, appointmentId: e.target.value})}
                    placeholder="Enter appointment ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={testConfig.userId}
                    onChange={(e) => setTestConfig({...testConfig, userId: e.target.value})}
                    placeholder="Enter user ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userRole">User Role</Label>
                  <Select 
                    value={testConfig.userRole} 
                    onValueChange={(value: 'doctor' | 'patient') => setTestConfig({...testConfig, userRole: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={testConfig.patientName}
                    onChange={(e) => setTestConfig({...testConfig, patientName: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input
                    id="doctorName"
                    value={testConfig.doctorName}
                    onChange={(e) => setTestConfig({...testConfig, doctorName: e.target.value})}
                    placeholder="Enter doctor name"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={startTest} 
                  disabled={!webRTCSupported}
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Start Video Call Test
                </Button>
                <Button 
                  variant="outline" 
                  onClick={generateNewTestData}
                >
                  Generate New Test Data
                </Button>
              </div>

              {/* Test Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Test Instructions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Configure the test parameters above</li>
                  <li>2. Choose your role (Doctor or Patient)</li>
                  <li>3. Click "Start Video Call Test" to begin</li>
                  <li>4. Allow camera and microphone permissions when prompted</li>
                  <li>5. Doctor can start the call, Patient can join</li>
                  <li>6. Test video/audio controls and call ending</li>
                </ul>
              </div>

              {/* Firestore Collections Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Firestore Collections Used:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <code>videoCalls/&#123;callId&#125;</code> - Main call document</li>
                  <li>• <code>videoCalls/&#123;callId&#125;/iceCandidates/&#123;userId&#125;</code> - ICE candidates</li>
                  <li>• <code>appointments/&#123;appointmentId&#125;</code> - Appointment validation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Video Call Interface */
          <VideoCallInterface
            appointmentId={testConfig.appointmentId}
            userId={testConfig.userId}
            userRole={testConfig.userRole}
            patientName={testConfig.patientName}
            doctorName={testConfig.doctorName}
            onCallEnd={endTest}
          />
        )}

        {/* Back to Configuration Button */}
        {isTestingCall && (
          <div className="text-center">
            <Button variant="outline" onClick={endTest}>
              Back to Test Configuration
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallTestPage;