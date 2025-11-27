import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import ReaderDashboard from './dashboards/ReaderDashboard';
import CreatorDashboard from './dashboards/CreatorDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import AdminLogin from './dashboards/AdminLogin';
import { getDashboardData } from '../services/dashboard';

const Dashboard = ({ isDarkMode, toggleTheme }) => {
    const { user, isLoggedIn } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminAuth, setAdminAuth] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await getDashboardData();
                setDashboardData(data);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error('Dashboard data error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isLoggedIn]);

    // Check for admin access
    useEffect(() => {
        // Debug logging
        console.log('🔍 Admin check - user:', user);
        console.log('🔍 Admin check - dashboardData:', dashboardData);
        console.log('🔍 User role:', user?.role);
        console.log('🔍 Dashboard role:', dashboardData?.role);

        // Method 1: Check if current logged-in user is admin (regular login flow)
        if (user?.role === 'admin' || dashboardData?.role === 'admin') {
            console.log('✅ Admin detected! Setting admin state...');
            setIsAdmin(true);
            setAdminAuth(true);
            return;
        }

        // Method 2: Check separate admin login storage (admin-specific login flow)
        const adminToken = localStorage.getItem('adminToken');
        const adminUser = localStorage.getItem('adminUser');

        if (adminToken && adminUser) {
            try {
                const parsedUser = JSON.parse(adminUser);
                if (parsedUser.role === 'admin') {
                    setIsAdmin(true);
                    setAdminAuth(true);
                }
            } catch (e) {
                // Invalid admin data, clear it
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }
        }
    }, [user, dashboardData]);

    const handleAdminLogin = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAdmin(true);
        setAdminAuth(true);
    };

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <div className={`animate-spin rounded-full h-32 w-32 border-b-2 ${isDarkMode ? 'border-white' : 'border-gray-900'} mx-auto mb-4`}></div>
                    <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    // Admin login screen
    if (isAdmin && !adminAuth) {
        return <AdminLogin onLogin={handleAdminLogin} isDarkMode={isDarkMode} />;
    }

    // Admin dashboard
    if (isAdmin && adminAuth) {
        return (
            <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <AdminDashboard isDarkMode={isDarkMode} />
                <Footer isDarkMode={isDarkMode} />
            </div>
        );
    }

    // User not logged in
    if (!isLoggedIn) {
        return (
            <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <div className="flex items-center justify-center min-h-screen pt-16">
                    <div className={`max-w-md w-full p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <div className="text-center">
                            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Access Required
                            </h2>
                            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Please log in to access your dashboard.
                            </p>
                            <a
                                href="/login"
                                className="inline-block w-full py-3 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                Go to Login
                            </a>
                        </div>
                    </div>
                </div>
                <Footer isDarkMode={isDarkMode} />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <div className="flex items-center justify-center min-h-screen pt-16">
                    <div className={`max-w-md w-full p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <div className="text-center">
                            <div className="text-red-500 text-5xl mb-4">⚠️</div>
                            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Error Loading Dashboard
                            </h2>
                            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {error}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-block w-full py-3 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
                <Footer isDarkMode={isDarkMode} />
            </div>
        );
    }

    // Role-based dashboard rendering
    const userRole = user?.role || dashboardData?.role;

    // Debug logging for final rendering
    console.log('🎯 Final rendering - userRole:', userRole);
    console.log('🎯 Final rendering - isAdmin:', isAdmin);
    console.log('🎯 Final rendering - adminAuth:', adminAuth);
    console.log('🎯 Will render admin dashboard:', userRole === 'admin');

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <div className="pt-16">
                {userRole === 'admin' ? (
                    <AdminDashboard
                        isDarkMode={isDarkMode}
                        user={user}
                        dashboardData={dashboardData}
                    />
                ) : userRole === 'creator' ? (
                    <CreatorDashboard
                        isDarkMode={isDarkMode}
                        user={user}
                        dashboardData={dashboardData}
                    />
                ) : (
                    <ReaderDashboard
                        isDarkMode={isDarkMode}
                        user={user}
                        dashboardData={dashboardData}
                    />
                )}
            </div>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
};

export default Dashboard;
