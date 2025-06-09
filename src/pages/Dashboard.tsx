import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  BarChart3, 
  Settings, 
  Search,
  Filter,
  ChevronRight,
  Star,
  Play,
  Phone
} from 'lucide-react';
import { apiService, Conversation } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);

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

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || conversation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const completedInterviews = conversations.filter(c => c.status === 'completed');
  const avgScore = completedInterviews.length > 0 
    ? completedInterviews.reduce((sum, c) => sum + (c.score || 0), 0) / completedInterviews.length 
    : 0;
  const avgDuration = completedInterviews.length > 0
    ? completedInterviews.reduce((sum, c) => sum + (c.duration || 0), 0) / completedInterviews.length
    : 0;
  const topCandidates = completedInterviews.filter(c => (c.score || 0) > 90).length;

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
              className="flex items-center space-x-3 px-4 py-3 text-purple-600 bg-purple-50 rounded-lg font-medium"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/history" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>Interviews</span>
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your AI interviews and candidate insights</p>
          </div>
          <button 
            onClick={() => setShowStartModal(true)}
            className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Start New Interview
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Total Interviews</h3>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{conversations.length}</p>
            <p className="text-sm text-green-600 mt-1">
              {conversations.filter(c => {
                const today = new Date();
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                return new Date(c.startTime) > weekAgo;
              }).length} this week
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Avg Score</h3>
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{avgScore.toFixed(1)}</p>
            <p className="text-sm text-blue-600 mt-1">Quality interviews</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Avg Duration</h3>
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{Math.round(avgDuration / 60)} min</p>
            <p className="text-sm text-gray-600 mt-1">Optimal range</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Top Candidates</h3>
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{topCandidates}</p>
            <p className="text-sm text-indigo-600 mt-1">Score {'>'} 90</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates or positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="starting">Starting</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interview List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Interviews</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading interviews...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No interviews found. Start your first interview!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <div key={conversation._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
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
                      
                      <Link 
                        to={`/interview/${conversation._id}`}
                        className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <Play className="h-5 w-5 mr-1" />
                        <span className="font-medium">View</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                  
                  {conversation.summary && (
                    <div className="mt-4 pl-16">
                      <p className="text-gray-600 text-sm">{conversation.summary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Start Interview Modal */}
      {showStartModal && (
        <StartInterviewModal 
          onClose={() => setShowStartModal(false)}
          onSuccess={() => {
            setShowStartModal(false);
            loadConversations();
          }}
        />
      )}
    </div>
  );
};

// Start Interview Modal Component
const StartInterviewModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidateName: '',
    candidatePhone: '',
    position: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.startCall(formData);
      if (response.success) {
        onSuccess();
        // Navigate to the interview page immediately
        navigate(`/interview/${response.conversationId}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Start New Interview</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Name
            </label>
            <input
              type="text"
              value={formData.candidateName}
              onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.candidatePhone}
              onChange={(e) => setFormData({ ...formData, candidatePhone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="+1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Start Call
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;