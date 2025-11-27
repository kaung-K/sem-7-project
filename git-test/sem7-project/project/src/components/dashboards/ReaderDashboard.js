import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubscriptions, getNotificationCount } from '../../services/dashboard';
import StatCard from './components/StatCard';
import ActivityCard from './components/ActivityCard';
import SubscriptionCard from './components/SubscriptionCard';

const ReaderDashboard = ({ isDarkMode, user, dashboardData }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [notifications, setNotifications] = useState(0);
    const [stats, setStats] = useState({
        totalSubscriptions: 0,
        totalSpent: 0,
        unreadNotifications: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReaderData = async () => {
            try {
                setLoading(true);

                const [subsData, notifData] = await Promise.all([
                    getSubscriptions().catch(err => ({ data: [] })),
                    getNotificationCount().catch(err => ({ data: { count: 0 } }))
                ]);

                const subs = Array.isArray(subsData) ? subsData : (subsData?.data || []);
                setSubscriptions(subs);
                setNotifications(notifData?.data?.count || 0);

                // Calculate stats
                setStats({
                    totalSubscriptions: subs.length,
                    totalSpent: subs.reduce((total, sub) => total + (sub.fee || 10), 0),
                    unreadNotifications: notifData?.data?.count || 0,
                    recentActivity: subs.slice(0, 3) // Recent subscriptions as activity
                });

            } catch (error) {
                console.error('Failed to fetch reader data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReaderData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className={`h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-6`}></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl`}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Welcome back, {user?.username || 'Reader'}! 👋
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Here's what's happening with your subscriptions
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Active Subscriptions"
                    value={stats.totalSubscriptions}
                    icon="📚"
                    //trend="+2 this month"
                    isDarkMode={isDarkMode}
                />
                <StatCard
                    title="Total Spent"
                    value={`$${stats.totalSpent}`}
                    icon="💰"
                    //trend="This month: $45"
                    isDarkMode={isDarkMode}
                />
                <StatCard
                    title="Unread Notifications"
                    value={stats.unreadNotifications}
                    icon="🔔"
                    trend={stats.unreadNotifications > 0 ? "New updates!" : "All caught up"}
                    isDarkMode={isDarkMode}
                    highlight={stats.unreadNotifications > 0}
                />
                <Link
  to="/upgrade-to-creator"
  className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
>
  <StatCard
    title="Upgrade"
    value="🚀"
    icon="⭐"
    trend="Become a Creator →"
    isDarkMode={isDarkMode}
    highlight
  />
</Link>

                {/* <StatCard
                    title="Saved Posts"
                    value="12"
                    icon="🔖"
                    trend="+3 this week"
                    isDarkMode={isDarkMode}
                /> */}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Subscriptions List */}
                <div className="lg:col-span-2">
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Your Subscriptions
                            </h2>
                            <Link
                                to="/creators"
                                className={`text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}
                            >
                                Browse More →
                            </Link>
                        </div>

                        {subscriptions.length > 0 ? (
                            <div className="space-y-4">
                                {subscriptions.map((subscription, index) => (
                                    <SubscriptionCard
                                        key={subscription._id || index}
                                        subscription={subscription}
                                        isDarkMode={isDarkMode}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    No subscriptions yet
                                </h3>
                                <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Discover amazing creators and start your learning journey
                                </p>
                                <Link
                                    to="/creators"
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Explore Creators
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    {/* <ActivityCard
                        title="Recent Activity"
                        activities={[
                            { action: "New post from TechGuru", time: "2 hours ago", icon: "📝" },
                            { action: "Comment reply received", time: "5 hours ago", icon: "💬" },
                            { action: "New creator followed", time: "1 day ago", icon: "👤" },
                            { action: "Subscription renewed", time: "3 days ago", icon: "🔄" }
                        ]}
                        isDarkMode={isDarkMode}
                    /> */}

                    {/* Quick Actions */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Link
                                to="/notifications"
                                className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span className="flex items-center">
                                    🔔 <span className="ml-3">View Notifications</span>
                                    {stats.unreadNotifications > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {stats.unreadNotifications}
                                        </span>
                                    )}
                                </span>
                            </Link>
                            <Link
                                to="/edit-profile"
                                className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span className="flex items-center">
                                    ⚙️ <span className="ml-3">Edit Profile</span>
                                </span>
                            </Link>
                            <Link
                                to="/creators"
                                className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span className="flex items-center">
                                    🔍 <span className="ml-3">Discover Creators</span>
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Recommended */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-purple-900 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            💡 Recommended for You
                        </h3>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Based on your interests, you might enjoy these creators
                        </p>
                        <Link
                            to="/creators"
                            className={`inline-flex items-center text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}
                        >
                            View Recommendations →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReaderDashboard;
