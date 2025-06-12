import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Smart Health Assistant</Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-green-200 transition-colors">Home</Link>
            <Link to="/recipe-finder" className="hover:text-green-200 transition-colors">Recipe Finder</Link>
            <Link to="/calories-calculator" className="hover:text-green-200 transition-colors">Calories Calculator</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
