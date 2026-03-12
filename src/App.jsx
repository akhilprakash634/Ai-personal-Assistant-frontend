import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ActivityLog from './pages/ActivityLog';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Layout from './components/Layout';

import Expenses from './pages/Expenses';
import Subscriptions from './pages/Subscriptions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        {/* Protected Dashboard/App Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/activity" 
          element={
            <ProtectedRoute>
              <Layout>
                <ActivityLog />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <Layout>
                <Tasks />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expenses" 
          element={
            <ProtectedRoute>
              <Layout>
                <Expenses />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscriptions" 
          element={
            <ProtectedRoute>
              <Layout>
                <Subscriptions />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
