import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CommentsSection from './CommentsSection';

const CommentsDemo = ({ isDarkMode, toggleTheme, isLoggedIn, logout }) => {
  const demoSections = [
    {
      id: '68767ba7be893e1294e162a2',
      title: 'The Future of Healthcare Technology',
      content: 'Artificial intelligence and machine learning are revolutionizing healthcare delivery, from diagnostic imaging to personalized treatment plans. This technology promises to make healthcare more accurate, efficient, and accessible to everyone.',
      type: 'Blog Post'
    },
    {
      id: '68767ba7be893e1294e162a2',
      title: 'New Research on Mental Health',
      content: 'Recent studies show that regular exercise and social connections play crucial roles in maintaining good mental health. Researchers recommend at least 30 minutes of physical activity daily.',
      type: 'News Article'
    },
    {
      id: '68767ba7be893e1294e162a2',
      title: 'Healthy Living Tips',
      content: 'Share your best tips for maintaining a healthy lifestyle. What works for you? What challenges do you face?',
      type: 'Community Discussion'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} logout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Nested Comments Demo
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience our advanced nested comment system with features like replies, likes, editing, and real-time updates.
            Each section below demonstrates how comments can be integrated into different types of content.
          </p>
        </div>

        {/* Features List */}
        <div className={`mb-12 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Comment System Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-green-500 mr-2">✓</span>
                Nested replies (unlimited depth)
              </div>
              <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-green-500 mr-2">✓</span>
                Like/unlike comments
              </div>
              <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-green-500 mr-2">✓</span>
                Edit your own comments
              </div>
              <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-green-500 mr-2">✓</span>
                Delete your own comments
              </div>
            </div>
            <div className="space-y-2">
              <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-green-500 mr-2">✓</span>
                Collapse/expand comment threads
              </div>
              <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-green-500 mr-2">✓</span>
                Real-time comment count
              </div>
              <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-green-500 mr-2">✓</span>
                Responsive design
              </div>
              <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-green-500 mr-2">✓</span>
                Dark mode support
              </div>
            </div>
          </div>
        </div>

        {/* Demo Sections */}
        <div className="space-y-12">
          {demoSections.map((section) => (
            <div key={section.id} className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    section.type === 'Blog Post' ? 'bg-blue-100 text-blue-800' :
                    section.type === 'News Article' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {section.type}
                  </span>
                </div>
                <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {section.title}
                </h2>
                <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {section.content}
                </p>
              </div>
              
              <CommentsSection 
                postId={section.id} 
                title={`Comments on "${section.title}"`}
              />
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <div className={`mt-12 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            How to Use Comments in Your App
          </h2>
          <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <div>
              <h3 className="font-semibold mb-2">1. Import the CommentsSection component:</h3>
              <code className={`block p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-sm`}>
                import CommentsSection from './components/CommentsSection';
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Add it to any page or component:</h3>
              <code className={`block p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-sm`}>
                {`<CommentsSection postId="68767ba7be893e1294e162a2" title="Comments" />`}
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Make sure your backend API is running:</h3>
              <p>The comment system requires a backend API server. Make sure your API is running on the configured URL (default: http://localhost:3001/api).</p>
            </div>
          </div>
        </div>
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default CommentsDemo;