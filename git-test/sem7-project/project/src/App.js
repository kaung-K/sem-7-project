import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './components/Homepage';
import FactsPage from './components/FactsPage';
import AboutPage from './components/AboutPage';
import LoginPage from './components/LoginPage';
import EditProfile from './components/EditProfile';
import NotificationsPage from './components/NotificationsPage';
import CommentsDemo from './components/CommentsDemo';
import Dashboard from './components/Dashboard';
import DebugDashboard from './components/DebugDashboard';
import CreatePost from './components/CreatePost';
import './components/comments.css';
import PostPageWrapper from "./components/PostPageWrapper";
import CreatorProfile from './components/CreatorProfile';
import CreatorsPage from './components/CreatorsPage';
import Chatbot from './components/Chatbot';
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import SubscribeSuccess from "./components/SubscribeSuccess";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import EditPost from './components/EditPost';
import UpgradeToCreatorPage from './components/UpgradeToCreatorPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Homepage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/facts" element={<FactsPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/about" element={<AboutPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/login" element={<LoginPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/creator/:id" element={<CreatorProfile isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/creators" element={<CreatorsPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/success" element={<SubscribeSuccess isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/forgot-password" element={<ForgotPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/reset-password" element={<ResetPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/chatbot" element={<Chatbot isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/debug" element={<DebugDashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          <Route path="/edit-post/:postId" element={<EditPost isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
          
          <Route
            path="/cancel"
            element={
              <div className={`min-h-screen grid place-items-center ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
                <div className={`p-8 rounded-xl border shadow ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <h1 className="text-2xl font-bold mb-2">Checkout canceled</h1>
                  <p>You can try subscribing again anytime.</p>
                </div>
              </div>
            }
          />
          {/* Protected pages */}
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
  path="/upgrade-to-creator"
  element={
    <ProtectedRoute>
      <UpgradeToCreatorPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </ProtectedRoute>
  }
/>
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comments-demo"
            element={
              <ProtectedRoute>
                <CommentsDemo isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <PostPageWrapper isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
