import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  Heart,
  FileText,
  Camera,
  Monitor,
  Volume2,
  VolumeX,
  MessageCircle,
  Clock,
  User,
  Activity,
  Stethoscope,
  Maximize,
  Minimize,
  Star
} from "lucide-react";

interface VideoConsultationProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    name: string;
    age?: number;
    condition: string;
    time: string;
    urgent?: boolean;
    bloodPressure?: string;
    heartRate?: string;
    symptoms?: string;
  };
}

const VideoConsultation = ({ isOpen, onClose, patient }: VideoConsultationProps) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: ""
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Simulate call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Simulate video stream
  useEffect(() => {
    if (isOpen && isVideoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.log("Camera access denied or not available:", err);
          // Fallback to demo mode
        });
    }
  }, [isOpen, isVideoOn]);

  // Handle full-screen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      // If we're no longer in full-screen mode but state says we are, update state
      if (!isCurrentlyFullScreen && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, [isFullScreen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F key for full screen toggle
      if (e.key === 'f' || e.key === 'F') {
        toggleFullScreen();
      }
      // Escape key to exit full screen
      if (e.key === 'Escape' && isFullScreen) {
        exitFullScreen();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isFullScreen]);

  const startCall = async () => {
    // Prevent multiple clicks during connection
    if (isConnecting) return;
    
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsCallActive(true);
      setCallDuration(0);
    }, 3000);
  };

  const endCall = () => {
    // Exit full screen if in full screen mode
    if (isFullScreen) {
      exitFullScreen();
    }
    setIsCallActive(false);
    setCallDuration(0);
    onClose();
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
  };

  const completeConsultation = () => {
    // Exit full screen if in full screen mode
    if (isFullScreen) {
      exitFullScreen();
    }
    
    // Show feedback form instead of immediately closing
    setShowFeedback(true);
  };

  const submitFeedback = () => {
    // Save feedback data
    const feedbackData = {
      patient: patient.name,
      date: new Date().toISOString(),
      duration: callDuration,
      rating: feedback.rating,
      comment: feedback.comment
    };
    console.log("Feedback submitted:", feedbackData);
    
    // Show success message and close
    alert(`Thank you for your feedback! Consultation with ${patient.name} completed successfully. Duration: ${formatTime(callDuration)}`);
    setShowFeedback(false);
    endCall();
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  };

  const enterFullScreen = () => {
    if (dialogContentRef.current) {
      const element = dialogContentRef.current;
      
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
      
      setIsFullScreen(true);
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
    
    setIsFullScreen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render feedback form when showFeedback is true
  if (showFeedback) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Consultation Feedback</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-lg font-semibold">Consultation with {patient.name} completed!</p>
              <p className="text-muted-foreground">Duration: {formatTime(callDuration)}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Rate your experience</Label>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 ${feedback.rating >= star ? 'text-yellow-500' : 'text-muted-foreground'}`}
                    onClick={() => setFeedback({...feedback, rating: star})}
                  >
                    <Star className={`h-8 w-8 ${feedback.rating >= star ? 'fill-yellow-500' : ''}`} />
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="feedback-comment" className="text-sm font-medium mb-2 block">
                Additional Comments
              </Label>
              <Textarea
                id="feedback-comment"
                placeholder="Share your experience with the consultation..."
                value={feedback.comment}
                onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                className="min-h-24"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setShowFeedback(false);
                endCall();
              }}>
                Skip
              </Button>
              <Button 
                onClick={submitFeedback}
                disabled={feedback.rating === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && isFullScreen) {
        exitFullScreen();
      }
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent 
        ref={dialogContentRef}
        className={`max-w-6xl h-[90vh] flex flex-col ${isFullScreen ? 'fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none' : ''}`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg">Video Consultation - {patient.name}</span>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{patient.condition}</span>
                  {patient.age && <span>Age: {patient.age}</span>}
                  {patient.urgent && (
                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isCallActive && (
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-mono text-primary">{formatTime(callDuration)}</span>
                </div>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullScreen}
                      className="h-8 w-8"
                    >
                      {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFullScreen ? 'Exit Full Screen (Esc)' : 'Full Screen (F)'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className={`flex-1 grid ${isFullScreen ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-4`}>
          {/* Video Area */}
          <div className={`${isFullScreen ? '' : 'lg:col-span-2'} space-y-4`}>
            {/* Main Video Container */}
            <div 
              ref={videoContainerRef}
              className={`relative bg-black rounded-lg overflow-hidden ${isFullScreen ? 'h-[calc(100vh-200px)]' : 'h-96'}`}
            >
              {isConnecting ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Connecting to {patient.name}...</p>
                    <p className="text-sm text-gray-300">Rural Health Center</p>
                    {!isVideoOn && (
                      <p className="text-xs text-gray-400 mt-2 flex items-center justify-center">
                        <VideoOff className="w-3 h-3 mr-1" />
                        Camera is OFF - Enable when ready
                      </p>
                    )}
                  </div>
                </div>
              ) : isCallActive ? (
                <>
                  {/* Remote Video (Patient) */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-12 h-12" />
                      </div>
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-sm opacity-80">Rural Health Center</p>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs">Connected</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Doctor's Video (Picture-in-Picture) */}
                  <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
                    {isVideoOn ? (
                      <video 
                        ref={videoRef}
                        autoPlay 
                        muted 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center">
                        <VideoOff className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-400 text-center px-2">Camera Off</span>
                        <span className="text-xs text-gray-500 mt-1">Click Video button to enable</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                  <div className="text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-xl font-semibold mb-2">Ready to start consultation</p>
                    <p className="text-gray-300">Click "Start Call" to begin video consultation with {patient.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="lg"
                onClick={toggleVideo}
                className="rounded-full w-12 h-12 p-0"
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
  
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="lg"
                onClick={toggleAudio}
                className="rounded-full w-12 h-12 p-0"
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              {!isCallActive && !isConnecting ? (
                <Button
                  onClick={startCall}
                  className="bg-green-600 hover:bg-green-700 rounded-full px-8"
                  size="lg"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5 mr-2" />
                      Start Call
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={endCall}
                  variant="destructive"
                  className="rounded-full px-8"
                  size="lg"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  End Call
                </Button>
              )}
              
              {isFullScreen && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={exitFullScreen}
                  className="rounded-full"
                >
                  <Minimize className="w-4 h-4 mr-2" />
                  Exit Full Screen
                </Button>
              )}
              
              {isCallActive && (
                <Button 
                  onClick={completeConsultation}
                  className="bg-blue-600 hover:bg-blue-700 rounded-full px-8"
                  size="lg"
                >
                  Complete Consultation
                </Button>
              )}
            </div>
          </div>

          {/* Patient Info Panel - Hidden in full screen mode */}
          {!isFullScreen && (
            <div className="space-y-4">
              {/* Patient Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Patient Vitals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {patient.bloodPressure && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Blood Pressure:</span>
                      <span className="font-medium">{patient.bloodPressure}</span>
                    </div>
                  )}
                  {patient.heartRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Heart Rate:</span>
                      <span className="font-medium">{patient.heartRate}</span>
                    </div>
                  )}
                  {patient.symptoms && (
                    <div>
                      <span className="text-sm text-muted-foreground">Symptoms:</span>
                      <p className="text-sm mt-1">{patient.symptoms}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Complete Consultation Button */}
              {isCallActive && (
                <Button 
                  onClick={completeConsultation}
                  className="w-full medical-gradient"
                  size="lg"
                >
                  Complete Consultation
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoConsultation;