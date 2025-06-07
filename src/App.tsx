import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InterviewCall from './pages/InterviewCall';
import ConversationHistory from './pages/ConversationHistory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview/:id" element={<InterviewCall />} />
          <Route path="/history" element={<ConversationHistory />} />
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;