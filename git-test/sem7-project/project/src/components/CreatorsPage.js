import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const CreatorsPage = ({ isDarkMode, toggleTheme }) => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3002/api/public/creator/all')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch creators');
        return res.json();
      })
      .then(data => {
        setCreators(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>Loading creators...</div>;
  }
  if (error) {
    return <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>Error: {error}</div>;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="max-w-6xl mx-auto py-16 px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Creators</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <Link to={`/creator/${creator._id || creator.id}`} key={creator._id || creator.id} className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 block">
              <div className={`${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
                <img
                  src={creator.profilePic?.url || '/images/creator.jpg'}
                  alt={creator.username || creator.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-article.jpg';
                  }}
                />
                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{creator.username || creator.name}</h3>
                  <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{creator.bio || creator.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorsPage; 