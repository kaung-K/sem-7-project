import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CommentsSection from './CommentsSection';
import axios from 'axios';
import { useAuth } from '../AuthContext';            // ✅ add

const Homepage = ({ isDarkMode, toggleTheme }) => {  // ✅ remove isLoggedIn, logout props
  const { isLoggedIn } = useAuth();                  // ✅ read from context

  // Creators state
  const [creators, setCreators] = useState([]);
  const [creatorsLoading, setCreatorsLoading] = useState(true);
  const [creatorsError, setCreatorsError] = useState(null);

  // Posts state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  // ✅ Fetch posts only when logged in, and re-run when login state changes
  useEffect(() => {
    const fetchPosts = async () => {
      if (!isLoggedIn) {
        setPosts([]);
        setPostsLoading(false);
        setPostsError(null);
        return;
      }

      setPostsLoading(true);
      setPostsError(null);

      try {
        const base = process.env.REACT_APP_API_URL; // e.g. http://localhost:3000/api
        if (!base) throw new Error("REACT_APP_API_URL not set");
        const url = `${base}/private/post`;

        const token = localStorage.getItem('token');
        if (!token) throw new Error("Missing token");

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data || []);
      } catch (err) {
        console.error("Fetch posts failed:", err);
        setPostsError('Failed to fetch posts.');
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [isLoggedIn]);  // ✅ key line

  // ---------- Fetch Creators (tries modern endpoint, then legacy) ----------
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        // Preferred: your spec's random creators endpoint
        // e.g. REACT_APP_API_URL=http://localhost:3000/api
        const base = process.env.REACT_APP_API_URL;
        if (base) {
          const urlPreferred = `${base}/public/creator/random`;
          const { data } = await axios.get(urlPreferred);
          setCreators((data || []).slice(0, 3));
          setCreatorsLoading(false);
          return;
        }
        throw new Error('REACT_APP_API_URL not set');
      } catch {
        // Fallback: your old local endpoint
        try {
          const urlFallback = 'http://localhost:3002/api/public/creator/all';
          const res = await fetch(urlFallback);
          if (!res.ok) throw new Error('Failed to fetch creators');
          const data = await res.json();
          setCreators((data || []).slice(0, 3));
        } catch (err) {
          setCreatorsError(err.message || 'Failed to fetch creators');
        } finally {
          setCreatorsLoading(false);
        }
      }
    };
    fetchCreators();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* ✅ no auth props */}
      {/* Hero Section */}
      <div className="flex items-center justify-between max-w-6xl mx-auto px-8 py-16 mt-16 min-h-[80vh]">
        <div className="flex-1">
          <h1 className={`text-5xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Unlock Premium</h1>
          <h2 className={`text-4xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Content Today</h2>
          <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Join thousands of creators and subscribers on the ultimate content platform</p>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="/images/contentcreator.jpg" alt="Content Creators" className="max-w-md h-auto" />
        </div>
      </div>

      {/* Services Section */}
      <div className={`py-16 px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Platform Features</h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className={`p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
            <img src="/images/become.jpg" alt="Creator" className="w-20 h-20 mx-auto mb-4 rounded-xl" />
            <h3 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Become a Creator</h3>
            <p className={`text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Start monetizing your content and build a loyal subscriber base with our creator tools.
            </p>
          </div>

          <div className={`p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
            <img src="/images/premium.png" alt="Subscription" className="w-20 h-20 mx-auto mb-4 rounded-xl" />
            <h3 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Premium Subscriptions</h3>
            <p className={`text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Access exclusive content from your favorite creators with flexible subscription plans.
            </p>
          </div>

          <div className={`p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
            <img src="/images/join.png" alt="Community" className="w-20 h-20 mx-auto mb-4 rounded-xl" />
            <h3 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Join Communities</h3>
            <p className={`text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Connect with like-minded people in exclusive creator communities and discussions.
            </p>
          </div>

          <div className={`p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
            <img src="/images/analytics.png" alt="Analytics" className="w-20 h-20 mx-auto mb-4 rounded-xl" />
            <h3 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Creator Analytics</h3>
            <p className={`text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Track your growth and earnings with detailed analytics and insights dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Some Creators Section */}
      <div className={`py-16 px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-4xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Some Creators</h2>
            <Link
              to="/creators"
              className={`font-semibold transition-colors duration-300 hover:opacity-80 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              See All →
            </Link>
          </div>

          {creatorsLoading ? (
            <div className="text-center py-8">Loading creators...</div>
          ) : creatorsError ? (
            <div className="text-center py-8 text-red-500">Error: {creatorsError}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {creators.map((creator) => {
                const id = creator._id || creator.id;
                const name = creator.username || creator.name || 'Unknown';
                const bio = creator.bio || creator.description || '';
                const pic =
                  (creator.profilePic && (creator.profilePic.url || creator.profilePic)) ||
                  creator.pic_url ||
                  creator.image ||
                  '/images/creator.jpg';

                return (
                  <Link to={`/creator/${id}`} key={id} className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 block">
                    <div className={`${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
                      <img
                        src={pic}
                        alt={name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/default-article.jpg';
                        }}
                      />
                      <div className="p-6">
                        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                        <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{bio}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      {/* <div className={`py-16 px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-4xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h2>
            <Link
              to="/faq"
              className={`font-semibold transition-colors duration-300 hover:opacity-80 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              See All →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="text-center">
              <img src="/images/faq.png" alt="FAQ Icon" className="max-w-xs mx-auto h-auto" />
            </div>

            <div className="lg:col-span-2 space-y-4">
              {[
                { question: 'How do I become a creator on SubHub?', answer: 'Sign up for a creator account, set up your profile, and start creating content. You can monetize through subscriptions, tips, and exclusive content.' },
                { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and digital wallets. Payments are processed securely and you can cancel anytime.' },
                { question: 'Can I cancel my subscription anytime?', answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period." },
                { question: 'How much can creators earn?', answer: 'Creator earnings depend on subscriber count and subscription price. Top creators can earn $5,000+ monthly with our platform.' },
              ].map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-xl overflow-hidden border transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                >
                  <div className={`p-6 font-semibold cursor-pointer transition-colors duration-300 flex justify-between items-center ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                    {faq.question}
                    <span className="text-xl font-bold">+</span>
                  </div>
                  <div className={`p-6 leading-relaxed hidden ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* Community Discussion */}
      {/* <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Community Discussion</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Share your thoughts about our healthcare platform and connect with other users.
          </p> */}

          {/* ✅ If logged out, show CTA instead of error */}
          {/* {!isLoggedIn && (
            <div className="text-sm opacity-80">
              Please <Link to="/login" className="text-blue-600 underline">log in</Link> to view and discuss posts.
            </div>
          )}

          {isLoggedIn && postsLoading && <p>Loading posts...</p>}
          {isLoggedIn && postsError && <p className="text-red-500">{postsError}</p>}

          {isLoggedIn && !postsLoading && !postsError && (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id} className={`rounded-2xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
                  <div className="p-6">
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{post.title}</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{post.body}</p>
                    <CommentsSection postId={post._id} title="Comments" />
                  </div>
                </div>
              ))}
              {posts.length === 0 && <div className="text-center text-sm opacity-70">No posts yet.</div>}
            </div>
          )}
        </div>
      </div> */}


      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Homepage; 