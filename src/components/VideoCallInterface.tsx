import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebRTCVideoCall, generateCallId, checkWebRTCSupport } from '@/lib/webrtc-video-call';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VideoCallInterfaceProps {
  appointmentId: string;
  userId: string;
  userRole: 'doctor' | 'patient';
  patientName?: string;
  doctorName?: string;
  onCallEnd?: () => void;
}

export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  appointmentId,
  userId,
  userRole,
  patientName,
  doctorName,
  onCallEnd
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [videoCall, setVideoCall] = useState<WebRTCVideoCall | null>(null);
  const [callState, setCallState] = useState<string>('idle');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [callId, setCallId] = useState<string>('');

  // Check WebRTC support on component mount
  useEffect(() => {
    const support = checkWebRTCSupport();
    if (!support.supported) {
      setError(`Your browser does not support video calling. Missing: ${support.missing.join(', ')}. Please use a modern browser like Chrome, Firefox, or Safari.`);
      return;
    }

    // Check if running in secure context
    const isSecure = window.isSecureContext || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
    
    if (!isSecure) {
      setError('Video calling requires HTTPS or localhost. Please ensure you are accessing the site securely.');
      return;
    }
  }, []);

  // Initialize video call
  const initializeCall = async () => {
    try {
      setIsInitializing(true);
      setError('');
      
      const newCallId = generateCallId(appointmentId);
      setCallId(newCallId);
      
      const call = new WebRTCVideoCall(newCallId, userId, userRole, appointmentId);
      
      // Set up callbacks
      call.onLocalStreamReady = (stream: MediaStream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          // Ensure the video plays properly
          const playPromise = localVideoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Local video playing');
              })
              .catch(error => {
                console.warn('Auto-play prevented for local video:', error);
                // Try to unmute and play again
                if (localVideoRef.current) {
                  localVideoRef.current.muted = true;
                  localVideoRef.current.play().catch(err => console.warn('Second play attempt failed:', err));
                }
              });
          }
        }
      };
      
      call.onRemoteStreamReady = (stream: MediaStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          // Ensure the video plays properly
          const playPromise = remoteVideoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Remote video playing');
              })
              .catch(error => {
                console.warn('Auto-play prevented for remote video:', error);
                // Try to unmute and play again
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.muted = true;
                  remoteVideoRef.current.play().catch(err => console.warn('Second play attempt failed:', err));
                }
              });
          }
        }
      };
      
      call.onCallStateChange = (state: string) => {
        setCallState(state);
        console.log('Call state changed:', state);
      };
      
      call.onError = (errorMsg: string) => {
        setError(errorMsg);
      };
      
      await call.initialize();
      setVideoCall(call);
      setIsInitializing(false);
    } catch (err) {
      console.error('Failed to initialize call:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize video call';
      setError(errorMessage);
      setIsInitializing(false);
    }
  };

  // Start call (Doctor)
  const startCall = async () => {
    if (!videoCall) return;
    
    try {
      setError('');
      await videoCall.startCall();
    } catch (err) {
      console.error('Failed to start call:', err);
      setError('Failed to start the call. Please try again.');
    }
  };

  // Join call (Patient)
  const joinCall = async () => {
    if (!videoCall) return;
    
    try {
      setError('');
      await videoCall.joinCall();
    } catch (err) {
      console.error('Failed to join call:', err);
      setError('Failed to join the call. Please try again.');
    }
  };

  // End call
  const endCall = async () => {
    if (!videoCall) return;
    
    try {
      await videoCall.endCall();
      setVideoCall(null);
      setCallState('ended');
      if (onCallEnd) {
        onCallEnd();
      }
    } catch (err) {
      console.error('Failed to end call:', err);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (!videoCall) return;
    
    const enabled = videoCall.toggleVideo();
    setIsVideoEnabled(enabled);
  };

  // Toggle audio
  const toggleAudio = () => {
    if (!videoCall) return;
    
    const enabled = videoCall.toggleAudio();
    setIsAudioEnabled(enabled);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoCall) {
        videoCall.endCall();
      }
    };
  }, [videoCall]);

  const getCallStateDisplay = () => {
    switch (callState) {
      case 'idle': return 'Ready to call';
      case 'initialized': return 'Camera ready';
      case 'calling': return 'Calling...';
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      case 'failed': return 'Connection failed';
      case 'ended': return 'Call ended';
      default: return callState;
    }
  };

  const getCallStateColor = () => {
    switch (callState) {
      case 'connected': return 'bg-green-500';
      case 'calling': 
      case 'connecting': return 'bg-yellow-500';
      case 'failed': 
      case 'disconnected': return 'bg-red-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Video Consultation
          </CardTitle>
          <Badge className={`text-white ${getCallStateColor()}`}>
            {getCallStateDisplay()}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          <p><strong>{userRole === 'doctor' ? 'Doctor' : 'Patient'}:</strong> You</p>
          <p><strong>{userRole === 'doctor' ? 'Patient' : 'Doctor'}:</strong> {userRole === 'doctor' ? patientName : doctorName}</p>
          {callId && <p><strong>Call ID:</strong> {callId}</p>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Video Streams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 bg-gray-900 rounded-lg object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You {!isVideoEnabled && '(Video Off)'}
            </div>
          </div>

          {/* Remote Video */}
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-64 bg-gray-900 rounded-lg object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {userRole === 'doctor' ? patientName || 'Patient' : doctorName || 'Doctor'}
            </div>
            {callState !== 'connected' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
                <p className="text-white text-center">
                  {callState === 'calling' ? 'Waiting for participant...' : 'No video stream'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          {!videoCall ? (
            <Button 
              onClick={initializeCall} 
              disabled={isInitializing || !!error}
              className="px-6"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Camera'}
            </Button>
          ) : (
            <>
              {/* Call Start/Join/End Buttons */}
              {callState === 'initialized' && userRole === 'doctor' && (
                <Button onClick={startCall} className="bg-green-600 hover:bg-green-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Start Call
                </Button>
              )}
              
              {callState === 'initialized' && userRole === 'patient' && (
                <Button onClick={joinCall} className="bg-green-600 hover:bg-green-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Join Call
                </Button>
              )}

              {(callState === 'calling' || callState === 'connected') && (
                <>
                  {/* Video Toggle */}
                  <Button
                    variant={isVideoEnabled ? "outline" : "destructive"}
                    size="sm"
                    onClick={toggleVideo}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>

                  {/* Audio Toggle */}
                  <Button
                    variant={isAudioEnabled ? "outline" : "destructive"}
                    size="sm"
                    onClick={toggleAudio}
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>

                  {/* End Call */}
                  <Button
                    variant="destructive"
                    onClick={endCall}
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Call Instructions */}
        {!videoCall && !error && (
          <div className="text-center text-sm text-gray-600 mt-4 space-y-2">
            <p>Click "Initialize Camera" to prepare for video consultation.</p>
            <p>Make sure to allow camera and microphone permissions when prompted.</p>
            <div className="text-xs text-gray-500 mt-2">
              <p><strong>Troubleshooting:</strong></p>
              <p>• Ensure you're on HTTPS or localhost</p>
              <p>• Check if other apps are using your camera</p>
              <p>• Click the camera icon in your browser's address bar to manage permissions</p>
              <p>• Try refreshing the page if permissions were denied</p>
            </div>
          </div>
        )}
        
        {/* Error-specific troubleshooting */}
        {error && error.includes('Camera/microphone access denied') && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>To enable camera and microphone:</strong></p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Click the camera/microphone icon in your browser's address bar</li>
                  <li>Select "Allow" for both camera and microphone</li>
                  <li>Refresh this page and try again</li>
                  <li>If the issue persists, check your system privacy settings</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {callState === 'calling' && userRole === 'doctor' && (
          <div className="text-center text-sm text-gray-600 mt-4">
            <p>Waiting for the patient to join the call...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoCallInterface;