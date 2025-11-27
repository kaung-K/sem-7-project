// at top of CreatorDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCreatorStats, getCreatorPosts, getStripeDashboardLink } from '../../services/dashboard';
import StatCard from './components/StatCard';
import ActivityCard from './components/ActivityCard';
import RevenueChart from './components/RevenueChart';
import EngagementChart from './components/EngagementChart';
import PostCard from './components/PostCard';
import { makeRequest } from "../../services/makeRequest";
import { getWeeklyEngagement, getRevenueLast6Months } from "../../services/analytics";

const CreatorDashboard = ({ isDarkMode, user, dashboardData }) => {
    const [stats, setStats] = useState({
        totalSubscribers: 0,
        monthlyRevenue: 0,
        totalPosts: 0,
        engagement: 0,
        growth: '+12%'
    });
    const [posts, setPosts] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [engagementData, setEngagementData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stripeLoading, setStripeLoading] = useState(false);

    const openStripeDashboard = async () => {
        try {
            setStripeLoading(true);
            const res = await getStripeDashboardLink();
            const url = res?.url || res?.data?.url; // robust to makeRequest/axios shapes
            if (!url) throw new Error('Stripe dashboard URL missing');
            window.location.href = url; // redirect to Stripe
        } catch (err) {
            console.error(err);
            alert(err.message || 'Could not open Stripe dashboard.');
        } finally {
            setStripeLoading(false);
        }
    };

    useEffect(() => {
        const fetchCreatorData = async () => {
            try {
                setLoading(true);

                const [subscribersData, postsData, weeklyRes, revenueRes] = await Promise.all([
                    getCreatorStats().catch(() => ({ data: [] })),
                    getCreatorPosts().catch(() => ({ data: [] })),
                    getWeeklyEngagement().catch(() => ({ data: [] })),
                    getRevenueLast6Months().catch(() => ({ data: [] })), // ← use if you want real revenue
                ]);

                const subs = Array.isArray(subscribersData) ? subscribersData : (subscribersData?.data || []);
                const postsArray = Array.isArray(postsData) ? postsData : (postsData?.data || []);
                const weeklyArr = Array.isArray(weeklyRes?.data ?? weeklyRes) ? (weeklyRes?.data ?? weeklyRes) : [];
                const revenueArr = Array.isArray(revenueRes?.data ?? revenueRes) ? (revenueRes?.data ?? revenueRes) : [];

                // ---- REAL monthly revenue (this month, in dollars) from invoices
                const currentMonthRevenue =
                    revenueArr.length ? Number(revenueArr.at(-1)?.revenue) || 0 : 0;

                // ---- REAL engagement rate for this week
                // interactions = likes + comments (+ shares if you add them)
                const totalInteractions = weeklyArr.reduce(
                    (sum, d) => sum +
                        (Number(d?.likes) || 0) +
                        (Number(d?.comments) || 0) +
                        (Number(d?.shares) || 0),
                    0
                );
                // ER = interactions / subscribers * 100 (cap to a sane max)
                const engagementRate = subs.length
                    ? Math.min(200, Math.round((totalInteractions / subs.length) * 100))
                    : 0;

                setSubscribers(subs);
                setPosts(postsArray);

                // stats
                const fee = Number(dashboardData?.fee) || 15;
                const monthlyRevenue = subs.length * fee;
                setStats({
                    totalSubscribers: subs.length,
                    monthlyRevenue: currentMonthRevenue,
                    totalPosts: postsArray.length,
                    engagement: engagementRate,
                    growth: subs.length > 10 ? "+12%" : "+5%",
                });

                // ✅ Weekly engagement -> chart shape
                setEngagementData(
                    weeklyArr.map(d => ({
                        day: d?.day ?? "",
                        likes: Number(d?.likes) || 0,
                        comments: Number(d?.comments) || 0,
                        shares: Number(d?.shares) || 0,
                    }))
                );

                // EITHER: ✅ real revenue series (from your API)
                if (revenueArr.length) {
                    setRevenueData(
                        revenueArr.map(m => ({
                            month: m?.month ?? "",
                            revenue: Number(m?.revenue) || 0,
                        }))
                    );
                } else {
                    // OR: keep your mock series (but ensure numbers are integers)
                    setRevenueData([
                        { month: "Jan", revenue: Math.round(monthlyRevenue * 0.6) },
                        { month: "Feb", revenue: Math.round(monthlyRevenue * 0.7) },
                        { month: "Mar", revenue: Math.round(monthlyRevenue * 0.8) },
                        { month: "Apr", revenue: Math.round(monthlyRevenue * 0.9) },
                        { month: "May", revenue: Math.round(monthlyRevenue * 0.95) },
                        { month: "Jun", revenue: Math.round(monthlyRevenue) },
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch creator data:", err);
                setSubscribers([]);
                setPosts([]);
                setEngagementData([]);
                setRevenueData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCreatorData();
    }, [dashboardData]);

    // helper inside the component (above return)
    const totals = useMemo(() => {
        // Robust to different shapes: either numeric fields or arrays
        const totalPosts = Array.isArray(posts) ? posts.length : 0;

        let totalLikes = 0;
        let totalComments = 0;
        if (Array.isArray(posts)) {
            for (const p of posts) {
                const lc =
                    typeof p?.likeCount === 'number'
                        ? p.likeCount
                        : Array.isArray(p?.likes)
                            ? p.likes.length
                            : 0;

                const cc =
                    typeof p?.commentCount === 'number'
                        ? p.commentCount
                        : Array.isArray(p?.comments)
                            ? p.comments.length
                            : 0;

                totalLikes += lc;
                totalComments += cc;
            }
        }
        return { totalPosts, totalLikes, totalComments };
    }, [posts]);

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
                    Creator Studio 🎨
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Welcome back, {user?.username || 'Creator'}! Here's how your content is performing
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Subscribers"
                    value={stats.totalSubscribers}
                    icon="👥"
                    //trend={stats.growth + " this month"}
                    isDarkMode={isDarkMode}
                    highlight={true}
                />
                {/* <StatCard
                    title="Monthly Revenue"
                    value={`$${stats.monthlyRevenue}`}
                    icon="💰"
                    trend="+15% vs last month"
                    isDarkMode={isDarkMode}
                /> */}
                <StatCard
                    title="Total Posts"
                    value={stats.totalPosts}
                    icon="📝"
                    //trend="+3 this week"
                    isDarkMode={isDarkMode}
                />
                <button
                    onClick={openStripeDashboard}
                    className="block w-full text-left rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <StatCard
                        title="Payouts (Stripe)"
                        value={stripeLoading ? "…" : "💳"}
                        icon="⭐"
                        trend="Open Stripe Dashboard →"
                        isDarkMode={isDarkMode}
                        highlight
                    />
                </button>

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Engagement Chart */}
                <EngagementChart data={engagementData} isDarkMode={isDarkMode} />

                {/* Right side stacked Quick Stats + Quick Actions */}
                <div className="space-y-6">
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Quick Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Posts</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totals.totalPosts}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Likes</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totals.totalLikes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comments</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totals.totalComments}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Link to="/create-post" className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                                📝 <span className="ml-3">Create New Post</span>
                            </Link>
                            <Link to="/edit-profile" className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                                ⚙️ <span className="ml-3">Edit Profile</span>
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
                </div>
            </div>


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Posts */}
                <div className="lg:col-span-2">
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Recent Posts
                            </h2>
                            <Link
                                to="/create-post"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                + Create Post
                            </Link>
                        </div>

                        {posts.length > 0 ? (
                            <div className="space-y-4">
                                {posts.slice(0, 3).map((post, index) => (
                                    <PostCard
                                        key={post._id || index}
                                        post={post}
                                        isDarkMode={isDarkMode}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    No posts yet
                                </h3>
                                <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Create your first post to start engaging with your audience
                                </p>
                                <Link
                                    to="/create-post"
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Create Your First Post
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    {/* <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Quick Stats
                        </h3>
                        <div className="space-y-4"> */}
                    {/* <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profile Views</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,234</span>
                            </div> */}
                    {/* <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Posts</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totals.totalPosts}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Likes</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totals.totalLikes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comments</span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totals.totalComments}</span>
                            </div>
                        </div>
                    </div> */}

                    {/* Recent Activity */}
                    {/* <ActivityCard
                        title="Recent Activity"
                        activities={[
                            { action: "New subscriber joined", time: "1 hour ago", icon: "🎉" },
                            { action: "Post got 25 new likes", time: "3 hours ago", icon: "❤️" },
                            { action: "New comment received", time: "5 hours ago", icon: "💬" },
                            { action: "Revenue milestone reached", time: "1 day ago", icon: "🏆" }
                        ]}
                        isDarkMode={isDarkMode}
                    /> */}

                    {/* Quick Actions */}
                    {/* <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Link
                                to="/create-post"
                                className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span className="flex items-center">
                                    📝 <span className="ml-3">Create New Post</span>
                                </span>
                            </Link>
                            <Link
                                to="/edit-profile"
                                className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span className="flex items-center">
                                    ⚙️ <span className="ml-3">Edit Profile</span>
                                </span>
                            </Link> */}
                    {/* <Link
                                to="/analytics"
                                className={`block w-full text-left p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span className="flex items-center">
                                    📊 <span className="ml-3">View Analytics</span>
                                </span>
                            </Link> */}
                    {/* </div>
                    </div> */}

                    {/* Pro Tip */}
                    {/* <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gradient-to-br from-green-900 to-blue-900 border-green-700' : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            💡 Pro Tip
                        </h3>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Posting consistently increases subscriber engagement by 40%
                        </p>
                        <button className={`inline-flex items-center text-sm font-medium ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'} transition-colors`}>
                            Learn More Tips →
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard;
