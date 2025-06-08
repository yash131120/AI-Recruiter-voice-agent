import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Bot, 
  User, 
  Volume2,
  VolumeX,
  Clock,
  Activity
} from 'lucide-react';
import { apiService, Conversation } from '../services/api';
import { socketService, TranscriptMessage } from '../services/socket';
import VoiceWaveform from '../components/VoiceWaveform';

const InterviewCall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadConversation();
      setupSocketConnection();
    }

    return () => {
      socketService.disconnect();
    };
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const loadConversation = async () => {
    try {
      const data = await apiService.getConversation(id!);
      setConversation(data);
      setTranscript(data.transcript || []);
      setIsCallActive(data.status === 'active' || data.status === 'starting');
      
      if (data.startTime) {
        const startTime = new Date(data.startTime).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setCallDuration(elapsed > 0 ? elapsed : 0);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const setupSocketConnection = () => {
    const socket = socketService.connect();
    
    if (conversation?.callId) {
      socketService.joinCall(conversation.callId);
    }

    socketService.on('transcript-update', (message: TranscriptMessage) => {
      setTranscript(prev => [...prev, message]);
    });

    socketService.on('call-started', () => {
      setIsCallActive(true);
    });

    socketService.on('call-ended', () => {
      setIsCallActive(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    });

    socketService.on('speech-started', (data) => {
      if (data.speaker === 'ai') {
        setAiSpeaking(true);
      } else {
        setUserSpeaking(true);
      }
    });

    socketService.on('speech-ended', (data) => {
      if (data.speaker === 'ai') {
        setAiSpeaking(false);
      } else {
        setUserSpeaking(false);
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    if (conversation?.callId) {
      try {
        await apiService.endCall(conversation.callId);
      } catch (error) {
        console.error('Error ending call:', error);
      }
    }
    setIsCallActive(false);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PhoneOff className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isCallActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PhoneOff className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Ended</h2>
          <p className="text-gray-600 mb-4">Thank you for your time. Redirecting to dashboard...</p>
          <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bot className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Voice Interview Session</h1>
              <p className="text-gray-600">{conversation?.position} Position</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(callDuration)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Interview In Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interview Interface */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* AI Agent Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Interviewer</h3>
                <p className="text-gray-600">Sophia AI</p>
              </div>
              <div className="ml-auto">
                <div className={`text-purple-600 ${aiSpeaking ? 'opacity-100' : 'opacity-30'}`}>
                  <VoiceWaveform isActive={aiSpeaking} />
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {transcript.filter(msg => msg.speaker === 'ai').map((msg, index) => (
                <div key={index} className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-800">{msg.text}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {aiSpeaking && (
                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 animate-pulse">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-purple-600 animate-pulse" />
                    <span className="text-sm text-purple-600">AI is speaking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Candidate</h3>
                <p className="text-gray-600">{conversation?.candidateName}</p>
              </div>
              <div className="ml-auto">
                <div className={`text-blue-600 ${userSpeaking ? 'opacity-100' : 'opacity-30'}`}>
                  <VoiceWaveform isActive={userSpeaking} />
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {transcript.filter(msg => msg.speaker === 'user').map((msg, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-800">{msg.text}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {userSpeaking && (
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 animate-pulse">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
                    <span className="text-sm text-blue-600">Candidate is speaking...</span>
                  </div>
                </div>
              )}
              
              {transcript.filter(msg => msg.speaker === 'user').length === 0 && !userSpeaking && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500 italic">Waiting for candidate response...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isMuted 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isSpeakerOn 
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </button>

            <button
              onClick={handleEndCall}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
            >
              <PhoneOff className="h-8 w-8" />
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              {isMuted && <span className="text-red-600 font-medium">Microphone muted • </span>}
              {!isSpeakerOn && <span className="text-red-600 font-medium">Speaker off • </span>}
              Interview in progress with {conversation?.candidateName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCall;