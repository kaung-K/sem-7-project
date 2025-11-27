import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const DebugDashboard = ({ isDarkMode }) => {
    const { user, isLoggedIn } = useAuth();
    const [debugInfo, setDebugInfo] = useState({
        token: null,
        user: null,
        isLoggedIn: false,
        apiTests: []
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        setDebugInfo(prev => ({
            ...prev,
            token: token ? token.substring(0, 20) + '...' : 'No token',
            user: storedUser ? JSON.parse(storedUser) : null,
            isLoggedIn
        }));

        // Test API endpoints
        testApiEndpoints(token);
    }, [isLoggedIn]);

    const testApiEndpoints = async (token) => {
        const tests = [];
        const baseUrl = 'http://localhost:3002/api';

        // Test 1: Public endpoint (no auth)
        try {
            const response = await fetch(`${baseUrl}/public/creator/all`);
            const data = await response.text();
            tests.push({
                endpoint: '/public/creator/all',
                status: response.status,
                success: response.ok,
                data: data.substring(0, 100)
            });
        } catch (error) {
            tests.push({
                endpoint: '/public/creator/all',
                status: 'ERROR',
                success: false,
                data: error.message
            });
        }

        // Test 2: Private dashboard (needs auth)
        if (token) {
            try {
                const response = await fetch(`${baseUrl}/private/dashboard`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.text();
                tests.push({
                    endpoint: '/private/dashboard',
                    status: response.status,
                    success: response.ok,
                    data: data.substring(0, 200)
                });
            } catch (error) {
                tests.push({
                    endpoint: '/private/dashboard',
                    status: 'ERROR',
                    success: false,
                    data: error.message
                });
            }

            // Test 3: User route
            try {
                const response = await fetch(`${baseUrl}/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.text();
                tests.push({
                    endpoint: '/user',
                    status: response.status,
                    success: response.ok,
                    data: data.substring(0, 200)
                });
            } catch (error) {
                tests.push({
                    endpoint: '/user',
                    status: 'ERROR',
                    success: false,
                    data: error.message
                });
            }
        }

        setDebugInfo(prev => ({ ...prev, apiTests: tests }));
    };

    return (
        <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🔍 Debug Dashboard</h1>

                {/* Authentication Status */}
                <div className={`p-6 rounded-lg border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Is Logged In:</strong>
                            <span className={`ml-2 px-2 py-1 rounded ${isLoggedIn ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {isLoggedIn ? '✅ Yes' : '❌ No'}
                            </span>
                        </div>
                        <div>
                            <strong>Token:</strong>
                            <code className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {debugInfo.token}
                            </code>
                        </div>
                    </div>

                    {debugInfo.user && (
                        <div className="mt-4">
                            <strong>User Data:</strong>
                            <pre className={`mt-2 p-3 rounded text-sm overflow-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                {JSON.stringify(debugInfo.user, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                {/* API Tests */}
                <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h2 className="text-xl font-semibold mb-4">API Endpoint Tests</h2>

                    {debugInfo.apiTests.length === 0 ? (
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Running tests...</p>
                    ) : (
                        <div className="space-y-4">
                            {debugInfo.apiTests.map((test, index) => (
                                <div key={index} className={`p-4 rounded border-l-4 ${test.success
                                        ? isDarkMode ? 'bg-green-900 border-green-500' : 'bg-green-50 border-green-500'
                                        : isDarkMode ? 'bg-red-900 border-red-500' : 'bg-red-50 border-red-500'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">
                                            {test.success ? '✅' : '❌'} {test.endpoint}
                                        </h3>
                                        <span className={`px-2 py-1 rounded text-sm ${test.success
                                                ? isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
                                                : isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'
                                            }`}>
                                            Status: {test.status}
                                        </span>
                                    </div>
                                    <div className="text-sm">
                                        <strong>Response:</strong>
                                        <pre className={`mt-1 p-2 rounded text-xs overflow-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                            {test.data}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className={`p-6 rounded-lg border mt-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => testApiEndpoints(localStorage.getItem('token'))}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            🔄 Retest APIs
                        </button>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            🗑️ Clear Storage & Reload
                        </button>
                        <a
                            href="/login"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors inline-block"
                        >
                            🔐 Go to Login
                        </a>
                        <a
                            href="http://localhost:3002"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors inline-block"
                        >
                            🌐 Test Backend Directly
                        </a>
                    </div>
                </div>

                {/* Environment Info */}
                <div className={`p-6 rounded-lg border mt-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
                    <div className="text-sm space-y-2">
                        <div><strong>Frontend URL:</strong> {window.location.origin}</div>
                        <div><strong>Backend URL:</strong> http://localhost:3002</div>
                        <div><strong>API Base:</strong> http://localhost:3002/api</div>
                        <div><strong>Current Path:</strong> {window.location.pathname}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugDashboard;
