import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Play
} from 'lucide-react';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for interviews
  const interviews = [
    {
      id: 1,
      candidateName: 'Alice Johnson',
      position: 'Frontend Developer',
      date: '2024-01-15',
      time: '14:30',
      duration: '25 min',
      score: 85,
      status: 'completed',
      summary: 'Strong technical skills, excellent communication. Recommended for next round.'
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
      summary: 'Outstanding problem-solving abilities. Perfect cultural fit.'
    },
    {
      id: 3,
      candidateName: 'Carol Williams',
      position: 'Full Stack Developer',
      date: '2024-01-13',
      time: '16:15',
      duration: '28 min',
      score: 78,
      status: 'completed',
      summary: 'Good technical foundation, needs improvement in system design.'
    },
    {
      id: 4,
      candidateName: 'David Brown',
      position: 'DevOps Engineer',
      date: '2024-01-12',
      time: '11:45',
      duration: '35 min',
      score: 88,
      status: 'completed',
      summary: 'Excellent infrastructure knowledge and automation experience.'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || interview.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
          <Link 
            to="/interview/new"
            className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Start New Interview
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Total Interviews</h3>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
            <p className="text-sm text-green-600 mt-1">+3 this week</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Avg Score</h3>
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">85.7</p>
            <p className="text-sm text-blue-600 mt-1">+2.3 improvement</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Avg Duration</h3>
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">28 min</p>
            <p className="text-sm text-gray-600 mt-1">Optimal range</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Top Candidates</h3>
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">8</p>
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
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interview List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Interviews</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredInterviews.map((interview) => (
              <div key={interview.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{interview.candidateName}</h3>
                        <p className="text-gray-600">{interview.position}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date(interview.date).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{interview.duration}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Score</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(interview.score)}`}>
                        {interview.score}
                      </span>
                    </div>
                    
                    <Link 
                      to={`/interview/${interview.id}`}
                      className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <Play className="h-5 w-5 mr-1" />
                      <span className="font-medium">View</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4 pl-16">
                  <p className="text-gray-600 text-sm">{interview.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;