// WebRTC Video Call Manager with Firebase Signaling
import { 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  deleteDoc, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export class WebRTCVideoCall {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callDoc: any = null;
  private iceCandidatesCollection: any = null;
  private unsubscribeCallDoc: (() => void) | null = null;
  private unsubscribeIceCandidates: (() => void) | null = null;

  public callId: string;
  public userId: string;
  public userRole: 'doctor' | 'patient';
  public appointmentId: string;
  public isCallActive: boolean = false;
  public isVideoEnabled: boolean = true;
  public isAudioEnabled: boolean = true;

  // Callbacks for UI updates
  public onLocalStreamReady: ((stream: MediaStream) => void) | null = null;
  public onRemoteStreamReady: ((stream: MediaStream) => void) | null = null;
  public onCallStateChange: ((state: string) => void) | null = null;
  public onError: ((error: string) => void) | null = null;

  private rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  constructor(
    callId: string, 
    userId: string, 
    userRole: 'doctor' | 'patient',
    appointmentId: string
  ) {
    this.callId = callId;
    this.userId = userId;
    this.userRole = userRole;
    this.appointmentId = appointmentId;
    
    // Initialize Firestore references
    this.callDoc = doc(db, 'videoCalls', this.callId);
    this.iceCandidatesCollection = doc(db, 'videoCalls', this.callId, 'iceCandidates', this.userId);
  }

  /**
   * Initialize WebRTC and get user media
   */
  async initialize(): Promise<void> {
    try {
      // Check if user has permission for this call
      await this.validateCallAccess();

      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.rtcConfiguration);
      this.setupPeerConnectionEventListeners();

      // Check for HTTPS or localhost (required for getUserMedia)
      if (!this.isSecureContext()) {
        throw new Error('Camera and microphone access requires HTTPS or localhost');
      }

      // Request permissions explicitly first
      await this.requestMediaPermissions();

      // Get user media with fallback options
      this.localStream = await this.getUserMediaWithFallback();

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Notify UI that local stream is ready
      if (this.onLocalStreamReady) {
        this.onLocalStreamReady(this.localStream);
      }

      this.callStateChange('initialized');
      console.log('WebRTC initialized successfully');
    } catch (error: any) {
      console.error('Error initializing WebRTC:', error);
      this.handleError(`Failed to initialize video call: ${error.message}`);
      throw error;
    }
  }

  /**
   * Start a new call (Doctor initiates)
   */
  async startCall(): Promise<void> {
    try {
      if (!this.peerConnection) {
        throw new Error('Peer connection not initialized');
      }

      // Create call document in Firestore
      await setDoc(this.callDoc, {
        appointmentId: this.appointmentId,
        doctorId: this.userRole === 'doctor' ? this.userId : null,
        patientId: this.userRole === 'patient' ? this.userId : null,
        status: 'calling',
        createdAt: serverTimestamp(),
        offer: null,
        answer: null
      });

      // Create offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Save offer to Firestore
      await updateDoc(this.callDoc, {
        offer: {
          type: offer.type,
          sdp: offer.sdp
        }
      });

      // Listen for answer and ICE candidates
      this.listenForAnswer();
      this.listenForIceCandidates();

      this.isCallActive = true;
      this.callStateChange('calling');
      console.log('Call started, waiting for answer...');
    } catch (error) {
      console.error('Error starting call:', error);
      this.handleError('Failed to start call');
      throw error;
    }
  }

  /**
   * Join an existing call (Patient joins)
   */
  async joinCall(): Promise<void> {
    try {
      if (!this.peerConnection) {
        throw new Error('Peer connection not initialized');
      }

      // Get call document
      const callSnapshot = await getDoc(this.callDoc);
      if (!callSnapshot.exists()) {
        throw new Error('Call not found');
      }

      const callData = callSnapshot.data();
      const offer = callData?.offer;

      if (!offer) {
        throw new Error('No offer found');
      }

      // Set remote description (offer)
      await this.peerConnection.setRemoteDescription(offer);

      // Create answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // Save answer to Firestore
      await updateDoc(this.callDoc, {
        answer: {
          type: answer.type,
          sdp: answer.sdp
        },
        status: 'connected',
        ...(this.userRole === 'patient' ? { patientId: this.userId } : { doctorId: this.userId })
      });

      // Listen for ICE candidates
      this.listenForIceCandidates();

      this.isCallActive = true;
      this.callStateChange('connected');
      console.log('Joined call successfully');
    } catch (error) {
      console.error('Error joining call:', error);
      this.handleError('Failed to join call');
      throw error;
    }
  }

  /**
   * End the call
   */
  async endCall(): Promise<void> {
    try {
      // Update call status
      if (this.callDoc) {
        await updateDoc(this.callDoc, {
          status: 'ended',
          endedAt: serverTimestamp(),
          endedBy: this.userId
        });
      }

      // Close peer connection
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      // Clean up listeners
      if (this.unsubscribeCallDoc) {
        this.unsubscribeCallDoc();
        this.unsubscribeCallDoc = null;
      }
      
      if (this.unsubscribeIceCandidates) {
        this.unsubscribeIceCandidates();
        this.unsubscribeIceCandidates = null;
      }

      this.isCallActive = false;
      this.callStateChange('ended');
      console.log('Call ended');
    } catch (error) {
      console.error('Error ending call:', error);
      this.handleError('Failed to end call');
    }
  }

  /**
   * Toggle video
   */
  toggleVideo(): boolean {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      this.isVideoEnabled = videoTrack.enabled;
      return videoTrack.enabled;
    }
    return false;
  }

  /**
   * Toggle audio
   */
  toggleAudio(): boolean {
    if (!this.localStream) return false;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      this.isAudioEnabled = audioTrack.enabled;
      return audioTrack.enabled;
    }
    return false;
  }

  /**
   * Validate that user has access to this call
   */
  private async validateCallAccess(): Promise<void> {
    try {
      // Get appointment document to validate access
      const appointmentDoc = await getDoc(doc(db, 'appointments', this.appointmentId));
      
      if (!appointmentDoc.exists()) {
        throw new Error('Appointment not found');
      }

      const appointment = appointmentDoc.data();
      const isDoctorAuthorized = this.userRole === 'doctor' && appointment?.doctorId === this.userId;
      const isPatientAuthorized = this.userRole === 'patient' && appointment?.patientId === this.userId;

      if (!isDoctorAuthorized && !isPatientAuthorized) {
        throw new Error('Unauthorized access to this call');
      }
    } catch (error) {
      console.error('Access validation failed:', error);
      throw new Error('You do not have permission to join this call');
    }
  }

  /**
   * Setup peer connection event listeners
   */
  private setupPeerConnectionEventListeners(): void {
    if (!this.peerConnection) return;

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.saveIceCandidate(event.candidate);
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Remote stream received');
      this.remoteStream = event.streams[0];
      if (this.onRemoteStreamReady) {
        this.onRemoteStreamReady(this.remoteStream);
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log('Connection state:', this.peerConnection.connectionState);
        this.callStateChange(this.peerConnection.connectionState);
      }
    };

    // Handle ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log('ICE connection state:', this.peerConnection.iceConnectionState);
        
        if (this.peerConnection.iceConnectionState === 'disconnected' || 
            this.peerConnection.iceConnectionState === 'failed') {
          this.handleError('Connection lost');
        }
      }
    };
  }

  /**
   * Listen for answer from remote peer
   */
  private listenForAnswer(): void {
    this.unsubscribeCallDoc = onSnapshot(this.callDoc, (snapshot) => {
      const data = snapshot.data();
      if (data && data.answer && this.peerConnection) {
        if (!this.peerConnection.remoteDescription) {
          this.peerConnection.setRemoteDescription(data.answer)
            .then(() => {
              console.log('Remote description set from answer');
              this.callStateChange('connected');
            })
            .catch(error => {
              console.error('Error setting remote description:', error);
              this.handleError('Failed to establish connection');
            });
        }
      }
    });
  }

  /**
   * Listen for ICE candidates from remote peer
   */
  private listenForIceCandidates(): void {
    const remoteUserId = this.userRole === 'doctor' ? 'patient' : 'doctor';
    const remoteCandidatesDoc = doc(db, 'videoCalls', this.callId, 'iceCandidates', remoteUserId);

    this.unsubscribeIceCandidates = onSnapshot(remoteCandidatesDoc, (snapshot) => {
      const data = snapshot.data();
      if (data?.candidates && this.peerConnection) {
        data.candidates.forEach((candidateData: any) => {
          const candidate = new RTCIceCandidate(candidateData);
          this.peerConnection!.addIceCandidate(candidate)
            .catch(error => console.error('Error adding ICE candidate:', error));
        });
      }
    });
  }

  /**
   * Save ICE candidate to Firestore
   */
  private async saveIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    try {
      const candidateData = {
        candidate: candidate.candidate,
        sdpMLineIndex: candidate.sdpMLineIndex,
        sdpMid: candidate.sdpMid
      };

      // Get existing candidates
      const candidateDoc = await getDoc(this.iceCandidatesCollection);
      const existingCandidates = candidateDoc.exists() ? (candidateDoc.data()?.candidates || []) : [];

      // Add new candidate
      existingCandidates.push(candidateData);

      // Save to Firestore
      await setDoc(this.iceCandidatesCollection, {
        candidates: existingCandidates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving ICE candidate:', error);
    }
  }

  /**
   * Handle call state changes
   */
  private callStateChange(state: string): void {
    if (this.onCallStateChange) {
      this.onCallStateChange(state);
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: string): void {
    if (this.onError) {
      this.onError(error);
    }
  }

  /**
   * Get local stream
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Get remote stream
   */
  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  /**
   * Check if running in secure context (HTTPS or localhost)
   */
  private isSecureContext(): boolean {
    return window.isSecureContext || 
           window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  }

  /**
   * Request media permissions explicitly
   */
  private async requestMediaPermissions(): Promise<void> {
    try {
      // Check if permission API is available
      if (navigator.permissions) {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        
        console.log('Camera permission:', cameraPermission.state);
        console.log('Microphone permission:', microphonePermission.state);
        
        if (cameraPermission.state === 'denied' || microphonePermission.state === 'denied') {
          throw new Error('Camera or microphone permission denied. Please allow access in browser settings.');
        }
      }
    } catch (error) {
      console.warn('Could not check permissions:', error);
      // Continue anyway, getUserMedia will handle the actual permission request
    }
  }

  /**
   * Get user media with fallback options
   */
  private async getUserMediaWithFallback(): Promise<MediaStream> {
    const constraints = [
      // First try: HD video and audio
      {
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true }
      },
      // Fallback 1: Standard video and audio
      {
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: true
      },
      // Fallback 2: Basic video and audio
      {
        video: true,
        audio: true
      },
      // Fallback 3: Audio only
      {
        video: false,
        audio: true
      }
    ];

    for (let i = 0; i < constraints.length; i++) {
      try {
        console.log(`Trying media constraints ${i + 1}:`, constraints[i]);
        const stream = await navigator.mediaDevices.getUserMedia(constraints[i]);
        console.log('Successfully got media stream with constraints:', constraints[i]);
        return stream;
      } catch (error: any) {
        console.warn(`Media constraint ${i + 1} failed:`, error);
        
        if (i === constraints.length - 1) {
          // Last attempt failed
          if (error.name === 'NotAllowedError') {
            throw new Error('Camera and microphone access denied. Please:\n1. Click the camera icon in your browser address bar\n2. Allow camera and microphone access\n3. Refresh the page and try again');
          } else if (error.name === 'NotFoundError') {
            throw new Error('No camera or microphone found. Please check your devices and try again.');
          } else if (error.name === 'NotSupportedError') {
            throw new Error('Your browser does not support video calling. Please use Chrome, Firefox, or Safari.');
          } else {
            throw new Error(`Camera/microphone error: ${error.message}\n\nTroubleshooting:\n1. Check if another app is using your camera\n2. Try refreshing the page\n3. Restart your browser`);
          }
        }
      }
    }
    
    throw new Error('Failed to access camera and microphone');
  }
}

/**
 * Generate a unique call ID
 */
export const generateCallId = (appointmentId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `call_${appointmentId}_${timestamp}_${random}`;
};

/**
 * Check if WebRTC is supported
 */
export const checkWebRTCSupport = (): { supported: boolean; missing: string[] } => {
  const missing: string[] = [];
  
  if (!navigator.mediaDevices) {
    missing.push('mediaDevices');
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    missing.push('getUserMedia');
  }
  if (!window.RTCPeerConnection) {
    missing.push('RTCPeerConnection');
  }
  if (!window.RTCSessionDescription) {
    missing.push('RTCSessionDescription');
  }
  if (!window.RTCIceCandidate) {
    missing.push('RTCIceCandidate');
  }
  
  return {
    supported: missing.length === 0,
    missing
  };
};