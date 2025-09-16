import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Stethoscope
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
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

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

  const startCall = async () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsCallActive(true);
      setCallDuration(0);
    }, 3000);
  };

  const endCall = () => {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completeConsultation = () => {
    // Save consultation data
    const consultationData = {
      patient: patient.name,
      date: new Date().toISOString(),
      duration: callDuration,
      notes: consultationNotes,
      prescription,
      followUpDate,
      completed: true
    };
    console.log("Consultation completed:", consultationData);
    
    // Show success message and close
    alert(`Consultation with ${patient.name} completed successfully! Duration: ${formatTime(callDuration)}`);
    endCall();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
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
            {isCallActive && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-mono text-primary">{formatTime(callDuration)}</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid lg:grid-cols-3 gap-4">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Video Container */}
            <div className="relative bg-black rounded-lg overflow-hidden h-96">
              {isConnecting ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Connecting to {patient.name}...</p>
                    <p className="text-sm text-gray-300">Rural Health Center</p>
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
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <VideoOff className="w-8 h-8 text-gray-400" />
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
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Start Call
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
            </div>
          </div>

          {/* Patient Info & Notes Panel */}
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

            {/* Consultation Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Consultation Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter consultation notes, observations, and recommendations..."
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  className="min-h-24 text-sm"
                />
              </CardContent>
            </Card>

            {/* Prescription */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-green-600" />
                  <span>Prescription</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter medications, dosage, and instructions..."
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="min-h-20 text-sm"
                />
              </CardContent>
            </Card>

            {/* Follow-up */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Follow-up Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="text-sm"
                />
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoConsultation;