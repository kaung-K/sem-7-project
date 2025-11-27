import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deletePost } from '../../../services/posts';

const PostCard = ({ post, isDarkMode }) => {
    const postTitle = post.title || 'Untitled Post';
    const postContent = post.body || post.content || 'No content available';
    const postId = post._id || post.id;
    const createdAt = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently';
    const attachments = post.attachments || [];
    const navigate = useNavigate();
    
    // Real engagement data
    const likeCount = typeof post?.likeCount === "number" ? post.likeCount : 0;
    const commentCount = typeof post?.commentCount === "number" ? post.commentCount : 0;

    const handleDeleteClick = async () => {
    if (!postId) return;
    const ok = window.confirm("Delete this post? This cannot be undone.");
    if (!ok) return;

    try {
      await deletePost(postId);
      // simplest UX: reload or redirect so the list refreshes
      // Option A: full reload
      window.location.reload();

      // Option B: if you're on a detail page:
      // navigate("/dashboard");
    } catch (err) {
      if (err?.status === 401) {
        const redirect = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = `/login?redirect=${redirect}`;
        return;
      }
      alert(err?.message || "Failed to delete");
    }
  };
    return (
        <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {postTitle}
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Published {createdAt}
                    </p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                    <button onClick={() => navigate(`/edit-post/${postId}`)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                        }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button onClick={handleDeleteClick} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-red-900 text-red-400' : 'hover:bg-red-50 text-red-500'
                        }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {postContent}
            </p>

            {/* Attachments indicator */}
            {attachments.length > 0 && (
                <div className="mb-3">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                        }`}>
                        📎 {attachments.length} attachment{attachments.length > 1 ? 's' : ''}
                    </div>
                </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* <div className="flex items-center">
                        <span className="text-sm mr-1">👁️</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {mockStats.views}
                        </span>
                    </div> */}
                    <div className="flex items-center">
                        <span className="text-sm mr-1">❤️</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {likeCount}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm mr-1">💬</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {commentCount}
                        </span>
                    </div>
                </div>

                <Link
                    to={`/post/${postId}`}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isDarkMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    View Post
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
