import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const CreatePost = ({ isDarkMode, toggleTheme }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [postData, setPostData] = useState({
        title: '',
        body: ''
    });
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Rich text formatting functions
    const [showPreview, setShowPreview] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

            if (!isValidType) {
                setError('Only image files are allowed');
                return false;
            }
            if (!isValidSize) {
                setError('File size must be less than 5MB');
                return false;
            }
            return true;
        });

        setAttachments(prev => [...prev, ...validFiles]);
        setError('');
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const insertMarkdown = (before, after = '') => {
        const textarea = document.getElementById('post-body');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const newText = before + selectedText + after;

        const newValue =
            textarea.value.substring(0, start) +
            newText +
            textarea.value.substring(end);

        setPostData(prev => ({ ...prev, body: newValue }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('title', postData.title);
            formData.append('body', postData.body);

            // Add attachments
            attachments.forEach((file, index) => {
                formData.append('attachments', file);
            });

            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

            const response = await fetch(`${API_URL}/private/post`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create post');
            }

            const result = await response.json();
            setSuccess('Post created successfully!');

            // Reset form
            setPostData({ title: '', body: '' });
            setAttachments([]);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Create post error:', err);
            setError(err.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const toolbarButtons = [
        { label: 'Bold', action: () => insertMarkdown('**', '**'), icon: '𝐁' },
        { label: 'Italic', action: () => insertMarkdown('*', '*'), icon: '𝐼' },
        { label: 'Heading', action: () => insertMarkdown('\n## ', '\n'), icon: 'H₁' },
        { label: 'List', action: () => insertMarkdown('\n- ', '\n'), icon: '•' },
        { label: 'Link', action: () => insertMarkdown('[', '](url)'), icon: '🔗' },
        { label: 'Code', action: () => insertMarkdown('`', '`'), icon: '</>' },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <div className="max-w-4xl mx-auto px-4 py-24">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                ✍️ Create New Post
                            </h1>
                            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Share your knowledge with your subscribers
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-red-900 border border-red-700 text-red-100' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-green-900 border border-green-700 text-green-100' : 'bg-green-50 border border-green-200 text-green-800'}`}>
                        ✅ {success}
                    </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Input */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Post Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={postData.title}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter an engaging title for your post..."
                            className={`w-full text-2xl font-bold border-none outline-none resize-none bg-transparent ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        {/* Toolbar */}
                        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center space-x-2">
                                {toolbarButtons.map((btn, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={btn.action}
                                        title={btn.label}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                                    >
                                        {btn.icon}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showPreview
                                            ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                                            : isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {showPreview ? '📝 Edit' : '👁️ Preview'}
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6">
                            {showPreview ? (
                                <div className={`min-h-96 prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
                                    <div
                                        className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}
                                        dangerouslySetInnerHTML={{
                                            __html: postData.body
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>')
                                                .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
                                                .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
                                                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
                                                .replace(/\n/g, '<br/>')
                                        }}
                                    />
                                    {postData.body.trim() === '' && (
                                        <p className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Your post content will appear here...
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Post Content *
                                        <span className={`font-normal ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            (Supports Markdown formatting)
                                        </span>
                                    </label>
                                    <textarea
                                        id="post-body"
                                        name="body"
                                        value={postData.body}
                                        onChange={handleInputChange}
                                        required
                                        rows={20}
                                        placeholder="Write your post content here... You can use Markdown formatting:

**Bold text**
*Italic text*
## Headings
- Bullet points
[Links](url)
`Code blocks`

Share your insights, tutorials, tips, or any valuable content with your subscribers!"
                                        className={`w-full border-none outline-none resize-none bg-transparent font-mono text-sm leading-relaxed ${isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                📎 Attachments
                            </h3>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
                            >
                                + Add Images
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {attachments.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {attachments.map((file, index) => (
                                    <div key={index} className={`relative group rounded-lg overflow-hidden border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Attachment ${index + 1}`}
                                            className="w-full h-32 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className={`absolute bottom-0 left-0 right-0 p-2 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} bg-opacity-90`}>
                                            <p className={`text-xs truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {file.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                                <div className="text-4xl mb-2">📸</div>
                                <p className="text-sm">
                                    No images attached. Click "Add Images" to include visuals in your post.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Markdown Help */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} p-6`}>
                        <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                            💡 Formatting Tips
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className={isDarkMode ? 'text-blue-200' : 'text-blue-800'}>
                                <code>**Bold text**</code> → <strong>Bold text</strong>
                            </div>
                            <div className={isDarkMode ? 'text-blue-200' : 'text-blue-800'}>
                                <code>*Italic text*</code> → <em>Italic text</em>
                            </div>
                            <div className={isDarkMode ? 'text-blue-200' : 'text-blue-800'}>
                                <code>## Heading</code> → Large heading
                            </div>
                            <div className={isDarkMode ? 'text-blue-200' : 'text-blue-800'}>
                                <code>- List item</code> → • List item
                            </div>
                            <div className={isDarkMode ? 'text-blue-200' : 'text-blue-800'}>
                                <code>`code`</code> → <code className="bg-gray-200 px-1 rounded">code</code>
                            </div>
                            <div className={isDarkMode ? 'text-blue-200' : 'text-blue-800'}>
                                <code>[Link](url)</code> → Hyperlink
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Draft auto-saved • {new Date().toLocaleTimeString()}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className={`px-6 py-3 rounded-lg border font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !postData.title.trim() || !postData.body.trim()}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${loading || !postData.title.trim() || !postData.body.trim()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                                        } text-white`}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Publishing...
                                        </div>
                                    ) : (
                                        '🚀 Publish Post'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
};

export default CreatePost;
