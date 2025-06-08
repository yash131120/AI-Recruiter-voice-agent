import React, { useState, useEffect } from 'react';
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
  Play,
  Phone
} from 'lucide-react';
import { apiService, Conversation } from '../services/api';

const ConversationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('date');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await apiService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-600 bg-gray-100';
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredConversations = conversations.filter(conv => 
    conv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.tags && conv.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const exportTranscript = (conversation: Conversation) => {
    const content = `
Interview Transcript
Candidate: ${conversation.candidateName}
Position: ${conversation.position}
Phone: ${conversation.candidatePhone}
Date: ${new Date(conversation.startTime).toLocaleDateString()}
Duration: ${conversation.duration ? Math.round(conversation.duration / 60) + ' minutes' : 'N/A'}
Score: ${conversation.score || 'N/A'}/100

Transcript:
${conversation.transcript.map((msg) => 
  `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.speaker.toUpperCase()}: ${msg.text}`
).join('\n\n')}

Notes:
${conversation.summary || 'No notes available'}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${conversation.candidateName.replace(' ', '-')}-${new Date(conversation.startTime).toISOString().split('T')[0]}.txt`;
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
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No conversations found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <div key={conversation._id} className="bg-white rounded-xl shadow-sm border">
                {/* Conversation Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedConversation(
                    selectedConversation === conversation._id ? null : conversation._id
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
                        <p className="text-sm text-gray-500">{conversation.candidatePhone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{new Date(conversation.startTime).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">
                          {conversation.duration ? `${Math.round(conversation.duration / 60)} min` : '-'}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          conversation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          conversation.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {conversation.status}
                        </span>
                      </div>
                      
                      {conversation.score && (
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Score</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(conversation.score)}`}>
                            {conversation.score}
                          </span>
                        </div>
                      )}
                      
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
                        
                        {selectedConversation === conversation._id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {conversation.tags && conversation.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {conversation.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded Transcript */}
                {selectedConversation === conversation._id && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Transcript */}
                      <div className="lg:col-span-2">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Full Transcript</h4>
                        <div className="space-y-4 max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-4">
                          {conversation.transcript && conversation.transcript.length > 0 ? (
                            conversation.transcript.map((message, index) => (
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
                                    <span className="text-xs opacity-70">
                                      {new Date(message.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{message.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center">No transcript available</p>
                          )}
                        </div>
                      </div>

                      {/* Notes and Analysis */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Interview Notes</h4>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-gray-700 text-sm">
                            {conversation.summary || 'No notes available for this interview.'}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          {conversation.score && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Overall Score</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(conversation.score)}`}>
                                {conversation.score}/100
                              </span>
                            </div>
                          )}
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
                            to={`/interview/${conversation._id}`}
                            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                          >
                            <Play className="h-4 w-4" />
                            <span>View Interview</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;