import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AskDoubt from './pages/AskDoubt';
import DoubtsHistory from './pages/DoubtsHistory';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UploadPage from './pages/UploadPage';
import MentorDashboard from './pages/MentorDashboard';
import MentorDoubtDetail from './pages/MentorDoubtDetail';
import AdminDashboard from './pages/AdminDashboard';

import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import SetPasswordModal from './components/SetPasswordModal';
import MainLayout from './components/MainLayout';
import useAuthStore from './store/useAuthStore';

import api from './config/api';

function App() {
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
    const warmUpBackend = async () => {
      try {
        // Use a direct axios call or fetch to bypass the configured 'api' instance which appends /api
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const rootUrl = API_URL.replace('/api', '');
        await axios.get(`${rootUrl}/health`);
      } catch (error) {
        console.log('Backend warming up...');
      }
    };
    warmUpBackend();
  }, []);

  return (
    <Router>
      <div className="App">
        <LoginModal />
        <SignupModal />
        <SetPasswordModal />

        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
          />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/ask" element={<AskDoubt />} />
            <Route path="/doubts" element={<DoubtsHistory />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            {/* Mentor Routes */}
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/doubt/:id" element={<MentorDoubtDetail />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;