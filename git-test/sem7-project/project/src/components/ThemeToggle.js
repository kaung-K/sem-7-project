import React from 'react';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <button 
      className={`p-2 rounded-md transition-colors duration-300 ${isDarkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
      onClick={toggleTheme}
    >
      {isDarkMode ? (
        <span className="text-xl">☀️</span>
      ) : (
        <span className="text-xl">🌙</span>
      )}
    </button>
  );
};

export default ThemeToggle; 