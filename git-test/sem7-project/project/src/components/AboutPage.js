import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const AboutPage = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <div className="pt-16">
        {/* Header Section */}
        <div className="text-center py-16 px-8">
          <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            About Nexora
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Empowering creators and connecting communities through premium content
          </p>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-8 py-12 space-y-16">
          {/* Mission Section */}
          <div className="text-center">
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Mission
            </h2>
            <p className={`text-lg leading-relaxed max-w-4xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Nexora is dedicated to revolutionizing the way creators monetize their content and how audiences access premium experiences. 
              We believe that every creator deserves the opportunity to build a sustainable income doing what they love, 
              while providing subscribers with exclusive, high-quality content that enriches their lives.
            </p>
          </div>

          {/* What We Do Section */}
          <div>
            <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              What We Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  🎯 Creator Empowerment
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  We provide creators with powerful tools to monetize their content, build communities, and grow their audience.
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  💎 Premium Content
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Subscribers get access to exclusive content, early releases, and behind-the-scenes experiences from their favorite creators.
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  🤝 Community Building
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  We foster meaningful connections between creators and their communities through interactive features and exclusive events.
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  📊 Analytics & Insights
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Comprehensive analytics help creators understand their audience and optimize their content strategy.
                </p>
              </div>
            </div>
          </div>

          {/* Our Story Section */}
          <div className="text-center">
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Story
            </h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Founded in 2024, Nexora emerged from a simple observation: creators were struggling to monetize their passion, 
                while audiences were looking for more meaningful connections with the people they follow. 
                We built a platform that bridges this gap, creating a win-win ecosystem where everyone thrives.
              </p>
              <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Today, Nexora hosts thousands of creators across diverse categories - from tech tutorials to fitness coaching, 
                from business insights to entertainment. Our platform continues to evolve based on creator and subscriber feedback, 
                ensuring we remain at the forefront of the creator economy.
              </p>
            </div>
          </div>

          {/* Our Values Section */}
          <div>
            <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 rounded-2xl text-center ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Authenticity
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  We believe in genuine connections and authentic content that resonates with real people.
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl text-center ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Innovation
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  We constantly innovate to provide the best tools and experiences for our community.
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl text-center ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Community
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  We prioritize building strong, supportive communities where everyone feels valued.
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl text-center ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Transparency
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  We operate with complete transparency in our processes, fees, and creator partnerships.
                </p>
              </div>
            </div>
          </div>

          {/* Join Our Community Section */}
          <div className="text-center">
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Join Our Community
            </h2>
            <p className={`text-lg leading-relaxed mb-8 max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Whether you're a creator looking to monetize your passion or a subscriber seeking exclusive content, 
              Nexora is the platform for you. Join thousands of others who have already discovered the power of 
              meaningful creator-subscriber relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/facts" 
                className={`px-8 py-3 rounded-lg font-medium transition-colors duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Explore Creators
              </a>
              <a 
                href="/contact" 
                className={`px-8 py-3 rounded-lg font-medium transition-colors duration-300 border ${isDarkMode ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default AboutPage; 