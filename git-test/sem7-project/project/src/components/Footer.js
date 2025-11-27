import React from 'react';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'}`}>
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2 text-gray-300">
              <p>Email: chawsuhan1258@gmail.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Creator Street, Digital City, DC 12345</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="/creators" className="text-gray-300 hover:text-white transition-colors duration-300">Creators</a></li>
              {/* <li><a href="/subscriptions" className="text-gray-300 hover:text-white transition-colors duration-300">Subscriptions</a></li> */}
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">LinkedIn</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Instagram</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <p className="text-center text-gray-300">
            &copy; 2024 Nexora - Premium Subscription Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 