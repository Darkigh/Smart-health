import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© {new Date().getFullYear()} Smart Health Assistant. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</a>
            <a href="/recipe-finder" className="text-sm text-gray-400 hover:text-white transition-colors">Recipe Finder</a>
            <a href="/calories-calculator" className="text-sm text-gray-400 hover:text-white transition-colors">Calories Calculator</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
