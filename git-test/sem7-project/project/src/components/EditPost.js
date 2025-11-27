// src/components/EditPost.js
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

export default function EditPost({ isDarkMode, toggleTheme }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const [postData, setPostData] = useState({ title: '', body: '' });

  // existing (from DB) vs new (picked now)
  const [existing, setExisting] = useState([]);      // [{url, publicId}, ...]
  const [keptIds, setKeptIds]   = useState(new Set());
  const [newFiles, setNewFiles] = useState([]);      // File[]

  // Load post once
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/private/post/detail/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load post');
        const data = await res.json();

        const p = data?.post || data; // support either shape
        setPostData({ title: p.title || '', body: p.body || p.content || '' });

        const atts = Array.isArray(p.attachments) ? p.attachments : [];
        setExisting(atts);
        setKeptIds(new Set(atts.map(a => a.publicId).filter(Boolean)));
      } catch (e) {
        setError(e.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (valid.length !== files.length) {
      setError('Only images up to 5MB are allowed');
    } else {
      setError('');
    }
    setNewFiles(prev => [...prev, ...valid]);
  };

  const removeExisting = (publicId) => {
    setKeptIds(prev => {
      const next = new Set(prev);
      next.delete(publicId);
      return next;
    });
  };

  const removeNewFile = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.title.trim() || !postData.body.trim()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('title', postData.title);
      fd.append('body', postData.body);

      // Which existing images are kept?
      const kept = existing.filter(a => a.publicId && keptIds.has(a.publicId));

      // If you used the "partial replace" backend:
      fd.append('keptExisting', JSON.stringify(kept.map(a => a.publicId)));
      fd.append('existingAttachments', JSON.stringify(kept));

      // New files
      for (const file of newFiles) fd.append('attachments', file);

      const res = await fetch(`${API}/private/post/${postId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || 'Failed to update post');
      }

      setSuccess('Post updated!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (e) {
      setError(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const existingKeptList = useMemo(
    () => existing.filter(a => a.publicId && keptIds.has(a.publicId)),
    [existing, keptIds]
  );

  if (loading) {
    return <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>Loading post…</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              ✏️ Edit Post
            </h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Update your content and attachments</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-red-900 border border-red-700 text-red-100' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-green-900 border border-green-700 text-green-100' : 'bg-green-50 border-green-200 text-green-800'}`}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
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
              className={`w-full text-2xl font-bold border-none outline-none bg-transparent ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            />
          </div>

          {/* Body (you can reuse your markdown toolbar from Create) */}
          <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Post Content *
            </label>
            <textarea
              id="post-body"
              name="body"
              value={postData.body}
              onChange={handleInputChange}
              required
              rows={18}
              className={`w-full border-none outline-none bg-transparent font-mono text-sm leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}
            />
          </div>

          {/* Attachments */}
          <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📎 Attachments</h3>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                + Add Images
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleAddFiles} className="hidden" />
            </div>

            {/* Existing (kept/removable) */}
            {existing.length > 0 && (
              <>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Existing images</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {existing.map((att, idx) => {
                    const kept = att.publicId && keptIds.has(att.publicId);
                    return (
                      <div key={att.publicId || idx} className={`relative rounded-lg overflow-hidden border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <img src={att.url} alt="" className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 flex items-end justify-between p-2">
                          <span className={`text-xs px-2 py-1 rounded ${kept ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>
                            {kept ? 'Keep' : 'Removed'}
                          </span>
                          <button
                            type="button"
                            onClick={() => (kept ? removeExisting(att.publicId) : setKeptIds(prev => new Set(prev).add(att.publicId)))}
                            className="px-2 py-1 text-xs rounded bg-black/60 text-white"
                          >
                            {kept ? 'Remove' : 'Undo'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* New files */}
            {newFiles.length > 0 && (
              <>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>New images</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {newFiles.map((file, i) => (
                    <div key={i} className={`relative rounded-lg overflow-hidden border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-32 object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute right-2 bottom-2 px-2 py-1 text-xs rounded bg-red-600 text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {existing.length === 0 && newFiles.length === 0 && (
              <div className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center ${isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                No images. Click “Add Images” to attach files.
              </div>
            )}
          </div>

          {/* Submit */}
          <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className={`px-6 py-3 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !postData.title.trim() || !postData.body.trim()}
                className={`px-6 py-3 rounded-lg text-white ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
