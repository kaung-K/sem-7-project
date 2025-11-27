import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCreatorPosts, getMyPosts } from '../services/posts';
import { useAuth } from '../AuthContext';
import Navbar from './Navbar';
import PostCard from "./PostCard";

// lightweight inline icons (no library)
const Icon = {
  Heart: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M12 21s-7.2-4.35-9.6-8.4C.5 9.2 2.3 5.5 6 5.5c2 0 3.2 1 4 2 0.8-1 2-2 4-2 3.7 0 5.5 3.7 3.6 7.1C19.2 16.65 12 21 12 21z" />
    </svg>
  ),
  Message: (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
    </svg>
  ),
  Check: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z" />
    </svg>
  ),
  ArrowLeft: (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 7-7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
  </svg>
),
};
const BackHomeLink = ({ isDarkMode }) => (
  <div className="mb-8">
    <Link
      to="/"
      className={`
        group inline-flex items-center gap-2 rounded-full
        p-[1px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30
        hover:from-blue-500/50 hover:via-purple-500/50 hover:to-pink-500/50
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60
        transition
      `}
      aria-label="Back to Home"
    >
      <span
        className={`
          inline-flex items-center gap-2 rounded-full px-3 py-1.5
          ${isDarkMode ? "bg-gray-900 text-gray-100 ring-1 ring-gray-700/60" : "bg-white text-gray-800 ring-1 ring-gray-200"}
        `}
      >
        <span
          className={`
            inline-flex items-center justify-center w-6 h-6 rounded-full
            ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-700"}
            transition-transform group-hover:-translate-x-0.5
          `}
        >
          <Icon.ArrowLeft />
        </span>
        <span className="text-sm font-medium">Back to Home</span>
      </span>
    </Link>
  </div>
);

const CreatorProfile = ({ isDarkMode, toggleTheme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [creator, setCreator] = useState(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [creatorError, setCreatorError] = useState(null);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const creatorId = String(creator?._id || creator?.id || id || "");
  const viewerId  = String(user?._id || user?.id || "");
  const isOwner   = Boolean(creatorId && viewerId && creatorId === viewerId);


  // // UI state (local only for now)
  // const [openComments, setOpenComments] = useState({});     // { [postId]: boolean }
  // const [likeState, setLikeState] = useState({});           // { [postId]: { liked:boolean, count:number } }

  // 1) public creator profile
  useEffect(() => {
    let alive = true;
    setCreatorLoading(true);

    fetch(`http://localhost:3002/api/public/creator/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch creator');
        return res.json();
      })
      .then(data => { if (alive) { setCreator(data); setCreatorLoading(false); } })
      .catch(err => { if (alive) { setCreatorError(err.message); setCreatorLoading(false); } });

    return () => { alive = false; };
  }, [id]);

  // 2) gated posts by subscription
  useEffect(() => {
    let alive = true;
    setPostsLoading(true);

     if (!creatorId || authLoading) { setPostsLoading(false); return; }
     const fetcher = isOwner ? getMyPosts : () => getCreatorPosts(creatorId);

      fetcher()
      .then(data => {
        if (!alive) return;
        // both endpoints often return { posts: [...] } — support both shapes
        const list = Array.isArray(data) ? data : (data?.posts || []);
        setPosts(list);
        setIsSubscribed(true);            // owner or subscribed viewer
      })
      .catch(() => {
        if (!alive) return;
        // Only non-owners should ever land here
        setIsSubscribed(false);
        setPosts([]);
      })
      .finally(() => { if (alive) setPostsLoading(false); });

    return () => { alive = false; };
  }, [creatorId, isOwner, authLoading]);

  // useEffect(() => {
  //   setOpenComments({});
  //   setLikeState({});
  // }, [id]);

  // if (creatorLoading) {
  //   return (
  //     <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
  //       Loading creator...
  //     </div>
  //   );
  // }

  // // Helpers
  // const getLikeInfo = (post) => {
  //   const pid = post._id || post.id;
  //   const local = likeState[pid] || {};
  //   const baseCount = typeof post.likeCount === 'number' ? post.likeCount : 0;
  //   return {
  //     liked: local.liked ?? post.likedByMe ?? false,
  //     count: local.count ?? baseCount,
  //   };
  // };

  // const toggleLike = (post) => {
  //   const pid = post._id || post.id;
  //   const { liked, count } = getLikeInfo(post);
  //   const next = { liked: !liked, count: Math.max(0, count + (liked ? -1 : 1)) };
  //   setLikeState((prev) => ({ ...prev, [pid]: next }));
  //   // later: call like/unlike API and handle errors (revert if needed)
  // };

  if (creatorError || !creator) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Creator not found</h2>
          <BackHomeLink isDarkMode={isDarkMode} />
        </div>
      </div>
    );
  }

  // inside CreatorProfile.jsx
  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      if (!token) {
        // not logged in → go login, then come back here
        navigate(`/login?redirect=/creator/${id}`);
        return;
      }

      // ⚠️ Use the EXACT path your server exposes (match your Postman tab)
      const res = await fetch(`http://localhost:3002/api/private/subscribe/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        navigate(`/login?redirect=/creator/${id}`);
        return;
      }
      if (!res.ok) throw new Error(`Subscribe failed (${res.status})`);

      const data = await res.json();

      // Your server returns { url: session.url } (see your screenshot),
      // so redirect using data.url (NOT checkoutUrl).
      if (data.url) {
        window.location.href = data.url;          // go to Stripe Checkout
        return;
      }

      // (If you later change server to return { checkoutUrl }, handle it here)
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Fallback if neither key exists
      throw new Error("No checkout URL returned");
    } catch (err) {
      console.error(err);
      navigate(`/subscribe/${id}/error`);
    }
  };

  const avatar = creator?.profilePic?.url || '/images/creator.jpg';
  const displayName = creator?.username || creator?.name || 'Unknown';
  const handle = creator?.handle ? `@${creator.handle}` : '';
  const bio = creator?.bio || creator?.description || '';
  const postCount = Array.isArray(posts) ? posts.length : 0;
  const canViewPosts = isOwner || isSubscribed;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* ✅ no auth props */}
      <div className="fixed left-4 top-[72px] z-40">
  <BackHomeLink isDarkMode={isDarkMode} />
</div>
      <div className="max-w-3xl mx-auto py-16 px-4">


        {/* Profile header card */}
        <div className="mb-10 rounded-3xl p-[1px] bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
          <div className={`rounded-3xl overflow-hidden border shadow-sm ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            {/* Cover (placeholder gradient) */}
            <div className={`h-28 w-full ${isDarkMode ? 'bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`} />

            {/* Header content */}
            <div className="p-6 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                {/* Avatar */}
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/70 dark:ring-gray-900/70 shadow-md transition-transform duration-300"
                />

                {/* Name + meta */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{displayName}</h1>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                      <Icon.Check /> Creator
                    </span>
                  </div>
                  <div className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{handle}</div>
                  {bio && <p className={`mt-3 max-w-2xl ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{bio}</p>}

                  {/* Stats + CTA */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="font-semibold text-gray-900 dark:text-white">{postCount}</span> posts
                    </div>

                    <div className="flex-1" />

                    {!canViewPosts ? (
                      <button
                        onClick={handleSubscribe}
                        className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                      >
                        Subscribe
                      </button>
                    ) : (
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-green-800/70 text-green-100 border border-green-700/50' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        Subscribed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div>
          <h2 className="text-2xl font-semibold mb-4">Posts</h2>

          {postsLoading ? (
            <div className="text-center opacity-70">Loading posts…</div>
          ) : canViewPosts ? (
            posts.length ? (
              <div className="space-y-6">
                {posts.map((post) => {
                  const pid = post._id || post.id;

                  return (
                    <PostCard
                      key={pid}
                      post={post}
                      author={{
                        _id: creator._id || creator.id,
                        username: creator.username || creator.name,
                        handle: creator.handle,
                        profilePic: creator.profilePic,
                      }}
                      isDarkMode={isDarkMode}
                      // onLikeToggle={() => toggleLike(post)}
                    />

                  );
                })}
              </div>
            ) : (
              <div className="text-center opacity-70">No posts yet.</div>
            )
          ) : (
            <div className="text-center p-[1px] rounded-2xl bg-gradient-to-br from-amber-400/30 via-orange-400/30 to-yellow-400/30">
              <div className="p-8 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-900">
                <p>You must subscribe to view this creator's posts.</p>
                <button onClick={handleSubscribe} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
                  Subscribe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;