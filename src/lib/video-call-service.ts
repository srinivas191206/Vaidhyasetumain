// WebRTC and Agora Video Call Integration
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { appointmentsCollection } from './firestore-collections';

// WebRTC Configuration
const rtcConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

// Agora Configuration (replace with your actual Agora App ID)
const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID || 'your-agora-app-id';

/**
 * WebRTC Video Call Manager
 */
export class WebRTCCallManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private videoRoomId: string;
  private appointmentId: string;

  constructor(videoRoomId: string, appointmentId: string) {
    this.videoRoomId = videoRoomId;
    this.appointmentId = appointmentId;
  }

  /**
   * Initialize WebRTC connection
   */
  async initializeCall(): Promise<void> {
    try {
      // Create peer connection
      this.peerConnection = new RTCPeerConnection(rtcConfiguration);

      // Set up event handlers
      this.peerConnection.onicecandidate = this.handleIceCandidate.bind(this);
      this.peerConnection.ontrack = this.handleRemoteTrack.bind(this);
      this.peerConnection.onconnectionstatechange = this.handleConnectionStateChange.bind(this);

      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      console.log('WebRTC call initialized for room:', this.videoRoomId);
    } catch (error) {
      console.error('Error initializing WebRTC call:', error);
      throw new Error('Failed to initialize video call');
    }
  }

  /**
   * Create offer for initiating call
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      // Update appointment status to in-progress
      await updateDoc(doc(appointmentsCollection, this.appointmentId), {
        status: 'in-progress',
        updatedAt: serverTimestamp(),
      });

      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  /**
   * Create answer for responding to call
   */
  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      return answer;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  }

  /**
   * Set remote description
   */
  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(description);
    } catch (error) {
      console.error('Error setting remote description:', error);
      throw error;
    }
  }

  /**
   * Add ICE candidate
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
      throw error;
    }
  }

  /**
   * End the call
   */
  async endCall(): Promise<void> {
    try {
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

      // Update appointment status to completed
      await updateDoc(doc(appointmentsCollection, this.appointmentId), {
        status: 'completed',
        updatedAt: serverTimestamp(),
      });

      console.log('Call ended for room:', this.videoRoomId);
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
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
      return audioTrack.enabled;
    }
    return false;
  }

  // Event handlers
  private handleIceCandidate(event: RTCPeerConnectionIceEvent): void {
    if (event.candidate) {
      // In a real application, you would send this candidate to the remote peer
      // through your signaling server (Firebase Realtime Database, Socket.io, etc.)
      console.log('ICE candidate:', event.candidate);
    }
  }

  private handleRemoteTrack(event: RTCTrackEvent): void {
    console.log('Remote track received');
    this.remoteStream = event.streams[0];
  }

  private handleConnectionStateChange(): void {
    if (this.peerConnection) {
      console.log('Connection state:', this.peerConnection.connectionState);
    }
  }

  // Getters
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }
}

/**
 * Agora Video Call Manager
 */
export class AgoraCallManager {
  private client: any = null;
  private localVideoTrack: any = null;
  private localAudioTrack: any = null;
  private videoRoomId: string;
  private appointmentId: string;
  private userId: string;

  constructor(videoRoomId: string, appointmentId: string, userId: string) {
    this.videoRoomId = videoRoomId;
    this.appointmentId = appointmentId;
    this.userId = userId;
  }

  /**
   * Initialize Agora SDK (requires agora-rtc-sdk-ng package)
   */
  async initializeAgora(): Promise<void> {
    try {
      // Note: You need to install agora-rtc-sdk-ng package
      // npm install agora-rtc-sdk-ng
      
      // Dynamic import for Agora SDK
      const AgoraRTC = await import('agora-rtc-sdk-ng');
      
      // Create Agora client
      this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      // Set up event handlers
      this.client.on('user-published', this.handleUserPublished.bind(this));
      this.client.on('user-unpublished', this.handleUserUnpublished.bind(this));

      console.log('Agora SDK initialized for room:', this.videoRoomId);
    } catch (error) {
      console.error('Error initializing Agora SDK:', error);
      throw new Error('Failed to initialize Agora SDK. Please install agora-rtc-sdk-ng package.');
    }
  }

  /**
   * Join Agora channel
   */
  async joinChannel(token?: string): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('Agora client not initialized');
      }

      // Join the channel
      await this.client.join(AGORA_APP_ID, this.videoRoomId, token || null, this.userId);

      // Create local tracks
      const AgoraRTC = await import('agora-rtc-sdk-ng');
      
      [this.localAudioTrack, this.localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      // Publish local tracks
      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);

      // Update appointment status
      await updateDoc(doc(appointmentsCollection, this.appointmentId), {
        status: 'in-progress',
        updatedAt: serverTimestamp(),
      });

      console.log('Joined Agora channel:', this.videoRoomId);
    } catch (error) {
      console.error('Error joining Agora channel:', error);
      throw error;
    }
  }

  /**
   * Leave Agora channel
   */
  async leaveChannel(): Promise<void> {
    try {
      // Close local tracks
      if (this.localVideoTrack) {
        this.localVideoTrack.close();
        this.localVideoTrack = null;
      }
      if (this.localAudioTrack) {
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }

      // Leave channel
      if (this.client) {
        await this.client.leave();
      }

      // Update appointment status
      await updateDoc(doc(appointmentsCollection, this.appointmentId), {
        status: 'completed',
        updatedAt: serverTimestamp(),
      });

      console.log('Left Agora channel:', this.videoRoomId);
    } catch (error) {
      console.error('Error leaving Agora channel:', error);
      throw error;
    }
  }

  /**
   * Toggle video
   */
  async toggleVideo(): Promise<boolean> {
    if (!this.localVideoTrack) return false;

    const enabled = this.localVideoTrack.enabled;
    await this.localVideoTrack.setEnabled(!enabled);
    return !enabled;
  }

  /**
   * Toggle audio
   */
  async toggleAudio(): Promise<boolean> {
    if (!this.localAudioTrack) return false;

    const enabled = this.localAudioTrack.enabled;
    await this.localAudioTrack.setEnabled(!enabled);
    return !enabled;
  }

  // Event handlers
  private async handleUserPublished(user: any, mediaType: string): Promise<void> {
    console.log('User published:', user.uid, mediaType);
    
    // Subscribe to remote user
    await this.client.subscribe(user, mediaType);
    
    if (mediaType === 'video') {
      // Play remote video track
      const remoteVideoTrack = user.videoTrack;
      const remoteVideoElement = document.getElementById('remote-video');
      if (remoteVideoElement) {
        remoteVideoTrack.play(remoteVideoElement);
      }
    }
    
    if (mediaType === 'audio') {
      // Play remote audio track
      user.audioTrack.play();
    }
  }

  private handleUserUnpublished(user: any, mediaType: string): void {
    console.log('User unpublished:', user.uid, mediaType);
  }

  // Getters
  getLocalVideoTrack(): any {
    return this.localVideoTrack;
  }

  getLocalAudioTrack(): any {
    return this.localAudioTrack;
  }
}

/**
 * Video Call Factory - Choose between WebRTC or Agora
 */
export class VideoCallFactory {
  static createWebRTCCall(videoRoomId: string, appointmentId: string): WebRTCCallManager {
    return new WebRTCCallManager(videoRoomId, appointmentId);
  }

  static createAgoraCall(videoRoomId: string, appointmentId: string, userId: string): AgoraCallManager {
    return new AgoraCallManager(videoRoomId, appointmentId, userId);
  }
}

/**
 * Utility function to check browser compatibility
 */
export const checkWebRTCSupport = (): boolean => {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.RTCPeerConnection
  );
};

/**
 * Get user media with error handling
 */
export const getUserMedia = async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('getUserMedia is not supported in this browser');
    }

    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('Error accessing user media:', error);
    
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera and microphone access denied. Please allow permissions and try again.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera or microphone found. Please check your devices.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera or microphone is already in use by another application.');
      }
    }
    
    throw new Error('Failed to access camera and microphone');
  }
};