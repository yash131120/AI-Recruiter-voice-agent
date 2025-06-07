import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  ArrowLeft,
  Download,
  Star,
  ChevronDown,
  ChevronUp,
  Play
} from 'lucide-react';

const ConversationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('date');

  // Mock conversation data
  const conversations = [
    {
      id: 1,
      candidateName: 'Alice Johnson',
      position: 'Frontend Developer',
      date: '2024-01-15',
      time: '14:30',
      duration: '25 min',
      score: 85,
      status: 'completed',
      transcript: [
        { speaker: 'ai', text: "Hello! I'm your AI interviewer. Thank you for joining today's interview session. Could you please introduce yourself?", timestamp: '14:30:12' },
        { speaker: 'user', text: "Hi! I'm Alice Johnson, a frontend developer with 5 years of experience. I specialize in React, TypeScript, and modern web technologies. I'm passionate about creating intuitive user experiences.", timestamp: '14:30:45' },
        { speaker: 'ai', text: "That's great! I can see you have a strong background in software development. Let me ask you about your experience with React. Can you tell me about a challenging project you've worked on using React?", timestamp: '14:31:15' },
        { speaker: 'user', text: "Sure! I recently led the development of a complex dashboard application for a fintech startup. The main challenge was handling real-time data updates while maintaining optimal performance. I implemented a custom hook system for state management and used React.memo and useMemo extensively to prevent unnecessary re-renders.", timestamp: '14:31:30' },
        { speaker: 'ai', text: "Excellent! Performance optimization is crucial in React applications. How did you handle the real-time data updates? Did you use WebSockets or Server-Sent Events?", timestamp: '14:32:15' },
        { speaker: 'user', text: "We used WebSockets for bidirectional communication. I created a custom WebSocket hook that managed connection states, automatic reconnection, and message queuing. This ensured reliable real-time updates even with network instability.", timestamp: '14:32:30' }
      ],
      tags: ['React', 'TypeScript', 'Performance', 'WebSockets'],
      notes: 'Strong technical skills, excellent problem-solving approach. Shows good understanding of React optimization techniques.'
    },
    {
      id: 2,
      candidateName: 'Bob Smith',
      position: 'Backend Developer',
      date: '2024-01-14',
      time: '10:00',
      duration: '32 min',
      score: 92,
      status: 'completed',
      transcript: [
        { speaker: 'ai', text: "Welcome Bob! Let's start with your background. Can you tell me about your experience with backend development?", timestamp: '10:00:12' },
        { speaker: 'user', text: "Thank you! I've been working as a backend developer for 7 years, primarily with Node.js, Python, and Go. I have extensive experience with microservices architecture, databases, and cloud platforms like AWS and Google Cloud.", timestamp: '10:00:25' },
        { speaker: 'ai', text: "Impressive experience! Let's dive into microservices. Can you describe a complex microservices system you've designed and the challenges you faced?", timestamp: '10:01:00' },
        { speaker: 'user', text: "I designed a microservices architecture for an e-commerce platform handling 100k+ daily transactions. The main challenges were service discovery, data consistency, and handling distributed transactions. I implemented event sourcing with Apache Kafka for reliable communication between services.", timestamp: '10:01:15' }
      ],
      tags: ['Node.js', 'Microservices', 'AWS', 'Kafka'],
      notes: 'Outstanding architectural knowledge and hands-on experience with complex systems.'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredConversations = conversations.filter(conv => 
    conv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportTranscript = (conversation: any) => {
    const content = `
Interview Transcript
Candidate: ${conversation.candidateName}
Position: ${conversation.position}
Date: ${conversation.date}
Duration: ${conversation.duration}
Score: ${conversation.score}/100

Transcript:
${conversation.transcript.map((msg: any) => 
  `[${msg.timestamp}] ${msg.speaker.toUpperCase()}: ${msg.text}`
).join('\n\n')}

Notes:
${conversation.notes}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${conversation.candidateName.replace(' ', '-')}-${conversation.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center space-x-2 p-6 border-b">
          <Bot className="h-8 w-8 text-purple-600" />
          <span className="text-xl font-bold text-gray-900">AI Recruiter</span>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-3 px-4 py-3 text-purple-600 bg-purple-50 rounded-lg font-medium">
              <Calendar className="h-5 w-5" />
              <span>Interview History</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conversation History</h1>
            <p className="text-gray-600 mt-2">Review past AI interviews and detailed transcripts</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by candidate name, position, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="duration">Sort by Duration</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <div key={conversation.id} className="bg-white rounded-xl shadow-sm border">
              {/* Conversation Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedConversation(
                  selectedConversation === conversation.id ? null : conversation.id
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{conversation.candidateName}</h3>
                      <p className="text-gray-600">{conversation.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date(conversation.date).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{conversation.duration}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Score</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(conversation.score)}`}>
                        {conversation.score}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportTranscript(conversation);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Download transcript"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      
                      {selectedConversation === conversation.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {conversation.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded Transcript */}
              {selectedConversation === conversation.id && (
                <div className="border-t border-gray-200 p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Transcript */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Full Transcript</h4>
                      <div className="space-y-4 max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-4">
                        {conversation.transcript.map((message, index) => (
                          <div key={index} className={`flex ${message.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              message.speaker === 'ai' 
                                ? 'bg-purple-100 text-purple-900' 
                                : 'bg-blue-100 text-blue-900'
                            }`}>
                              <div className="flex items-center space-x-2 mb-1">
                                {message.speaker === 'ai' ? (
                                  <Bot className="h-4 w-4" />
                                ) : (
                                  <User className="h-4 w-4" />
                                )}
                                <span className="text-xs font-medium">
                                  {message.speaker === 'ai' ? 'AI Interviewer' : 'Candidate'}
                                </span>
                                <span className="text-xs opacity-70">{message.timestamp}</span>
                              </div>
                              <p className="text-sm">{message.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes and Analysis */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Interview Notes</h4>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700 text-sm">{conversation.notes}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Overall Score</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(conversation.score)}`}>
                            {conversation.score}/100
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Communication</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Technical Skills</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Problem Solving</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <button
                          onClick={() => exportTranscript(conversation)}
                          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export Transcript</span>
                        </button>
                        
                        <Link
                          to={`/interview/${conversation.id}`}
                          className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Play className="h-4 w-4" />
                          <span>Replay Interview</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationHistory;