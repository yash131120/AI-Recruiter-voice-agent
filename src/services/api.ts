import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface StartCallRequest {
  candidateName: string;
  candidatePhone: string;
  position: string;
}

export interface StartCallResponse {
  success: boolean;
  callId: string;
  conversationId: string;
}

export interface Conversation {
  _id: string;
  callId?: string;
  candidateName: string;
  candidatePhone: string;
  position: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: string;
  transcript: TranscriptMessage[];
  summary?: string;
  score?: number;
  tags: string[];
}

export interface TranscriptMessage {
  speaker: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const apiService = {
  // Start a new call
  startCall: async (data: StartCallRequest): Promise<StartCallResponse> => {
    const response = await api.post('/calls/start', data);
    return response.data;
  },

  // End a call
  endCall: async (callId: string): Promise<void> => {
    await api.post(`/calls/${callId}/end`);
  },

  // Get call status
  getCallStatus: async (callId: string) => {
    const response = await api.get(`/calls/${callId}/status`);
    return response.data;
  },

  // Get conversation history
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/conversations');
    return response.data;
  },

  // Get specific conversation
  getConversation: async (id: string): Promise<Conversation> => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },
};

export default apiService;