import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VideoCallInterface } from './VideoCallInterface';
import { Video, Users } from 'lucide-react';

interface AppointmentVideoCallProps {
  appointment: {
    id: string;
    patientName: string;
    doctorName: string;
    status: string;
  };
  currentUser: {
    id: string;
    role: 'doctor' | 'patient';
    name: string;
  };
  onCallComplete?: () => void;
}

export const AppointmentVideoCall: React.FC<AppointmentVideoCallProps> = ({
  appointment,
  currentUser,
  onCallComplete
}) => {
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);

  const handleCallEnd = () => {
    setIsCallDialogOpen(false);
    if (onCallComplete) {
      onCallComplete();
    }
  };

  const canStartVideoCall = () => {
    // Only allow video calls for scheduled or in-progress appointments
    return ['scheduled', 'in-progress'].includes(appointment.status);
  };

  const getButtonText = () => {
    if (currentUser.role === 'doctor') {
      return 'Start Video Consultation';
    }
    return 'Join Video Consultation';
  };

  const getButtonIcon = () => {
    if (currentUser.role === 'doctor') {
      return <Video className="h-4 w-4 mr-2" />;
    }
    return <Users className="h-4 w-4 mr-2" />;
  };

  return (
    <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          disabled={!canStartVideoCall()}
          className="w-full"
          variant={currentUser.role === 'doctor' ? 'default' : 'outline'}
        >
          {getButtonIcon()}
          {getButtonText()}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Consultation - {appointment.patientName}
          </DialogTitle>
        </DialogHeader>
        
        <VideoCallInterface
          appointmentId={appointment.id}
          userId={currentUser.id}
          userRole={currentUser.role}
          patientName={appointment.patientName}
          doctorName={appointment.doctorName}
          onCallEnd={handleCallEnd}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentVideoCall;