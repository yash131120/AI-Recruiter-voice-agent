import { io, Socket } from 'socket.io-client';

export interface TranscriptMessage {
  speaker: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export interface SocketEvents {
  'transcript-update': (message: TranscriptMessage) => void;
  'call-started': (data: { callId: string }) => void;
  'call-ended': (data: { callId: string }) => void;
  'speech-started': (data: { speaker: 'ai' | 'user' }) => void;
  'speech-ended': (data: { speaker: 'ai' | 'user' }) => void;
}

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:3001');
      
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinCall(callId: string) {
    if (this.socket) {
      this.socket.emit('join-call', callId);
    }
  }

  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off<K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;