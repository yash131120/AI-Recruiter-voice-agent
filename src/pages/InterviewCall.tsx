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

const InterviewCall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCallActive, setIsCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);

  // Mock conversation data
  const [conversation, setConversation] = useState([
    {
      speaker: 'ai',
      text: "Hello! I'm your AI interviewer. Thank you for joining today's interview session. Could you please introduce yourself?",
      timestamp: new Date()
    }
  ]);

  const [currentAiText, setCurrentAiText] = useState('');
  const [currentUserText, setCurrentUserText] = useState('');

  // Mock real-time transcription effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCallActive) {
        setCallDuration(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCallActive]);

  // Simulate AI speaking and transcription
  useEffect(() => {
    if (isCallActive && conversation.length === 1) {
      const timer = setTimeout(() => {
        setAiSpeaking(true);
        setCurrentAiText("That's great! I can see you have a strong background in software development. Let me ask you about your experience with...");
        
        setTimeout(() => {
          setAiSpeaking(false);
          setConversation(prev => [...prev, {
            speaker: 'ai',
            text: "That's great! I can see you have a strong background in software development. Let me ask you about your experience with React and modern JavaScript frameworks.",
            timestamp: new Date()
          }]);
          setCurrentAiText('');
        }, 3000);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isCallActive, conversation.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const WaveformAnimation = ({ isActive }: { isActive: boolean }) => (
    <div className="flex items-center space-x-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-current rounded-full transition-all duration-300 ${
            isActive 
              ? 'animate-pulse' 
              : 'h-2'
          }`}
          style={{
            height: isActive ? `${Math.random() * 20 + 10}px` : '8px',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );

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
              <p className="text-gray-600">Frontend Developer Position</p>
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
                  <WaveformAnimation isActive={aiSpeaking} />
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {conversation.filter(msg => msg.speaker === 'ai').map((msg, index) => (
                <div key={index} className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-800">{msg.text}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {currentAiText && (
                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 animate-pulse">
                  <p className="text-gray-800">{currentAiText}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Activity className="h-4 w-4 text-purple-600 animate-pulse" />
                    <span className="text-xs text-purple-600">Live transcription...</span>
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
                <p className="text-gray-600">Alice Johnson</p>
              </div>
              <div className="ml-auto">
                <div className={`text-blue-600 ${userSpeaking ? 'opacity-100' : 'opacity-30'}`}>
                  <WaveformAnimation isActive={userSpeaking} />
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {conversation.filter(msg => msg.speaker === 'user').map((msg, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-800">{msg.text}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {currentUserText && (
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 animate-pulse">
                  <p className="text-gray-800">{currentUserText}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
                    <span className="text-xs text-blue-600">Live transcription...</span>
                  </div>
                </div>
              )}
              
              {/* Placeholder for user to start speaking */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 italic">Waiting for your response...</p>
                <button 
                  onClick={() => {
                    setUserSpeaking(true);
                    setCurrentUserText("Hi! I'm Alice Johnson, a frontend developer with 5 years of experience. I specialize in React, TypeScript, and modern web technologies...");
                    setTimeout(() => {
                      setUserSpeaking(false);
                      setConversation(prev => [...prev, {
                        speaker: 'user',
                        text: "Hi! I'm Alice Johnson, a frontend developer with 5 years of experience. I specialize in React, TypeScript, and modern web technologies. I'm passionate about creating intuitive user experiences.",
                        timestamp: new Date()
                      }]);
                      setCurrentUserText('');
                    }, 4000);
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Click to simulate response
                </button>
              </div>
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
              Interview in progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCall;