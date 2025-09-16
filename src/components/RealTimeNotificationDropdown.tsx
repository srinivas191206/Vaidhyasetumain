import React, { useState, useEffect } from "react";
import { Bell, Calendar, Star, Users, Pill, MessageCircle, Clock, Check, X, AlertTriangle, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VideoCallInterface } from "./VideoCallInterface";
import {
  listenToUserNotifications,
  listenToDoctorAppointmentRequests,
  acceptAppointmentRequest,
  rejectAppointmentRequest,
  markNotificationAsRead,
  type Notification
} from "@/lib/notification-service";

interface RealTimeNotificationDropdownProps {
  userId: string;
  userRole: 'doctor' | 'patient' | 'health_center';
  userName: string;
}

const RealTimeNotificationDropdown: React.FC<RealTimeNotificationDropdownProps> = ({ 
  userId, 
  userRole, 
  userName 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointmentRequests, setAppointmentRequests] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<Notification | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [acceptedAppointment, setAcceptedAppointment] = useState<{
    appointmentId: string;
    patientName: string;
  } | null>(null);

  // Listen to notifications
  useEffect(() => {
    const unsubscribe = listenToUserNotifications(userId, (newNotifications) => {
      setNotifications(newNotifications);
      const unread = newNotifications.filter(n => n.status === 'pending').length;
      setUnreadCount(unread);
    });

    return unsubscribe;
  }, [userId]);

  // Listen to appointment requests for doctors
  useEffect(() => {
    if (userRole === 'doctor') {
      const unsubscribe = listenToDoctorAppointmentRequests(userId, (requests) => {
        setAppointmentRequests(requests);
      });
      return unsubscribe;
    }
  }, [userId, userRole]);

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === 'pending') {
      if (notification.type === 'appointment_request' && userRole === 'doctor') {
        setSelectedRequest(notification);
        setIsRequestDialogOpen(true);
      } else {
        await markNotificationAsRead(notification.id!);
      }
    }
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest?.appointmentId) return;
    
    setIsProcessing(true);
    try {
      await acceptAppointmentRequest(
        selectedRequest.id!,
        selectedRequest.appointmentId,
        userId,
        userName,
        "I'll be available for the consultation. Please prepare the patient."
      );
      
      // Store appointment details for video call
      setAcceptedAppointment({
        appointmentId: selectedRequest.appointmentId,
        patientName: selectedRequest.data?.patientName || 'Patient'
      });
      
      setIsRequestDialogOpen(false);
      setSelectedRequest(null);
      
      // Auto-open video call after accepting
      setTimeout(() => {
        setIsVideoCallOpen(true);
      }, 500); // Small delay for smooth UX
      
    } catch (error) {
      console.error('Error accepting request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest?.appointmentId || !rejectionReason.trim()) return;
    
    setIsProcessing(true);
    try {
      await rejectAppointmentRequest(
        selectedRequest.id!,
        selectedRequest.appointmentId,
        userId,
        userName,
        rejectionReason.trim()
      );
      setIsRequestDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "appointment_request": return Calendar;
      case "appointment_accepted": return Check;
      case "appointment_rejected": return X;
      case "consultation_started": return Users;
      case "prescription_ready": return Pill;
      case "emergency_alert": return AlertTriangle;
      default: return MessageCircle;
    }
  };

  const getIconColor = (type: string, priority: string) => {
    if (priority === 'emergency') return "text-red-500";
    if (priority === 'urgent') return "text-orange-500";
    
    switch (type) {
      case "appointment_request": return "text-blue-500";
      case "appointment_accepted": return "text-green-500";
      case "appointment_rejected": return "text-red-500";
      case "consultation_started": return "text-purple-500";
      case "prescription_ready": return "text-indigo-500";
      default: return "text-gray-500";
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    const now = new Date();
    const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return <Badge variant="destructive" className="text-xs">Emergency</Badge>;
      case 'urgent':
        return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Urgent</Badge>;
      default:
        return null;
    }
  };

  const totalUnread = unreadCount + appointmentRequests.length;
  const allNotifications = [...appointmentRequests, ...notifications];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground font-medium">
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96 glass-card" align="end">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <span className="text-xs text-muted-foreground">
              {totalUnread} unread
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <ScrollArea className="h-80">
            {allNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              allNotifications.map((notification, index) => {
                const Icon = getIconForType(notification.type);
                const isRequest = notification.type === 'appointment_request' && userRole === 'doctor';
                
                return (
                  <DropdownMenuItem 
                    key={notification.id || index}
                    className={`p-3 cursor-pointer hover:bg-muted/50 ${
                      notification.status === 'pending' ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className={`p-2 rounded-full bg-muted/50 ${getIconColor(notification.type, notification.priority)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">
                              {notification.title}
                            </p>
                            {getPriorityBadge(notification.priority)}
                          </div>
                          {notification.status === 'pending' && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                          {isRequest && notification.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="default"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRequest(notification);
                                  setIsRequestDialogOpen(true);
                                }}
                              >
                                Review
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Quick accept with auto video call
                                  setSelectedRequest(notification);
                                  handleAcceptRequest();
                                }}
                              >
                                <Video className="w-3 h-3 mr-1" />
                                Accept & Join
                              </Button>
                            </div>
                          )}
                        </div>
                        {notification.expiresAt && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-orange-500" />
                            <p className="text-xs text-orange-500">
                              Expires {formatTimeAgo(notification.expiresAt)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })
            )}
          </ScrollArea>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-center text-primary hover:text-primary/80">
            View All Notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Appointment Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Consultation Request
            </DialogTitle>
            <DialogDescription>
              Review the consultation request details
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Priority:</strong> {selectedRequest.priority.toUpperCase()}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <div>
                  <strong>Patient:</strong> {selectedRequest.data?.patientName}
                </div>
                <div>
                  <strong>Health Center:</strong> {selectedRequest.fromUserName}
                </div>
                <div>
                  <strong>Symptoms:</strong> {selectedRequest.data?.symptoms}
                </div>
                <div>
                  <strong>Requested Time:</strong> {
                    selectedRequest.data?.requestedTime 
                      ? new Date(selectedRequest.data.requestedTime).toLocaleString()
                      : 'ASAP'
                  }
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Rejection Reason (if declining):
                </label>
                <Textarea
                  placeholder="Please provide a reason if you need to decline this request..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsRequestDialogOpen(false);
                setRejectionReason("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectRequest}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? "Declining..." : "Decline"}
            </Button>
            <Button
              onClick={handleAcceptRequest}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Accepting..." : "Accept"}
            </Button>
            <Button
              onClick={async () => {
                if (!selectedRequest?.appointmentId) return;
                
                // Accept and immediately open video call
                await handleAcceptRequest();
              }}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Video className="w-4 h-4 mr-2" />
              {isProcessing ? "Accepting..." : "Accept & Start Video"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto Video Call Dialog */}
      <Dialog open={isVideoCallOpen} onOpenChange={setIsVideoCallOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Consultation - {acceptedAppointment?.patientName}
            </DialogTitle>
            <DialogDescription>
              You have accepted the consultation request. The video call is ready to start.
            </DialogDescription>
          </DialogHeader>
          
          {acceptedAppointment && (
            <VideoCallInterface
              appointmentId={acceptedAppointment.appointmentId}
              userId={userId}
              userRole={userRole as 'doctor' | 'patient'}
              patientName={acceptedAppointment.patientName}
              doctorName={userName}
              onCallEnd={() => {
                setIsVideoCallOpen(false);
                setAcceptedAppointment(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RealTimeNotificationDropdown;