import React, { useState } from 'react';

const AdminLogin = ({ onLogin, isDarkMode }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Use the real backend auth API
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.username.includes('@') ? credentials.username : 'chawsuhan1258@gmail.com',
                    password: credentials.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.message || 'Invalid admin credentials');
                return;
            }

            const data = await response.json();

            // Check if user has admin role
            if (data.user?.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                return;
            }

            // Store admin token and user data
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            onLogin(data.token);

        } catch (err) {
            console.error('Admin login error:', err);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); // Clear error when user starts typing
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`max-w-md w-full p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🛡️</div>
                    <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Admin Access
                    </h1>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Enter your admin credentials to continue
                    </p>
                </div>

                {/* Admin Credentials Info */}
                <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                    <h3 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                        Admin Login Options:
                    </h3>
                    <div className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                        <p>Email: <code className="font-mono">chawsuhan1258@gmail.com</code></p>
                        <p>Username: <code className="font-mono">admin</code> (auto-converts to email)</p>
                        <p>Password: <code className="font-mono">admin123</code></p>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900 border border-red-700 text-red-100' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                            <div className="flex items-center">
                                <span className="text-red-500 mr-2">⚠️</span>
                                {error}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Admin Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter admin username"
                            className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Admin Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter admin password"
                            className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !credentials.username || !credentials.password}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${loading || !credentials.username || !credentials.password
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                            } text-white`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Verifying...
                            </div>
                        ) : (
                            'Login as Admin'
                        )}
                    </button>
                </form>

                {/* Security Notice */}
                <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-0.5">🔒</span>
                        <div>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Security Notice
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Admin sessions are monitored and logged for security purposes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Need help? Contact system administrator
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
