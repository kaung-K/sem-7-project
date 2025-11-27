import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3002/api'; // fallback for local
const DEFAULT_IMAGE = '/images/creator-laptop.jpg';

const EditProfile = ({ isDarkMode, toggleTheme }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    image: DEFAULT_IMAGE,
  });
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  // Load current profile
  useEffect(() => {
    (async () => {
      const stored = (() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); }
        catch { return {}; }
      })();

      try {
        const { data } = await axios.get(`${API}/private/dashboard`); // if you have the GET
        const user = { ...stored, ...data }; // prefer API, fallback to stored
        const pic = user.profilePic && (user.profilePic.url || user.profilePic);

        setProfile({
          name: user.username || user.name || '',
          email: user.email || '',            // ✅ now always filled
          bio: user.bio || '',
          image: pic || DEFAULT_IMAGE,
        });
        setImagePreview(pic || DEFAULT_IMAGE);
      } catch (e) {
        // If GET isn’t available, still show email from storage
        if (stored?.email) {
          const pic = stored.profilePic && (stored.profilePic.url || stored.profilePic);
          setProfile({
            name: stored.username || stored.name || '',
            email: stored.email || '',
            bio: stored.bio || '',
            image: pic || DEFAULT_IMAGE,
          });
          setImagePreview(pic || DEFAULT_IMAGE);
        } else {
          setError('Failed to fetch profile');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Clean up object URL when user picks a new file
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // instant preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const fd = new FormData();
      fd.append('username', profile.name);
      fd.append('bio', profile.bio || '');
      if (imageFile) fd.append('profilePic', imageFile); // must match upload.single('profilePic')

      await axios.patch(`${API}/private/dashboard`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // refresh once
      const { data } = await axios.get(`${API}/private/dashboard`);
      const pic = data.profilePic && (data.profilePic.url || data.profilePic);
      setProfile({
        name: data.username || data.name || '',
        email: data.email || '',
        bio: data.bio || '',
        image: pic || DEFAULT_IMAGE,
      });
      setImagePreview(pic || DEFAULT_IMAGE);

      // keep local cache fresh (optional)
      try {
        const current = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...current, ...data }));
      } catch { }

      setSuccess('Profile saved!');
      navigate('/', { replace: true });
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        Loading profile...
      </div>
    );
  }
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="flex items-center justify-center min-h-screen pt-16">
        <form onSubmit={handleSubmit} className={`w-full max-w-lg p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className="text-2xl font-bold mb-8 text-center">Edit Profile</h2>

          {success && <div className="mb-4 text-green-600 text-center">{success}</div>}

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={imagePreview}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
              onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
            />
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {/* Name (username) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          {/* Email (read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              readOnly
              className={`w-full px-4 py-3 rounded-lg border opacity-70 cursor-not-allowed ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-medium ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Save Profile
          </button>
        </form>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default EditProfile;
