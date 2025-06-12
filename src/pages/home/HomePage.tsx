import React, { useState } from 'react';
import foodBg from '../../assets/food-background.jpg';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${foodBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Calories Calculator Card */}
            <a 
              href="/calories-calculator" 
              className="bg-black bg-opacity-60 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="p-4">
                <img 
                  src="/nutrition-label.jpg" 
                  alt="Nutrition Facts Label" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-white text-center mb-2">Calories calculator</h2>
              </div>
            </a>
            
            {/* Recipe Finder Card */}
            <a 
              href="/recipe-finder" 
              className="bg-black bg-opacity-60 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="p-4">
                <img 
                  src="/pie.jpg" 
                  alt="Apple Pie" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-white text-center mb-2">Recipe finder</h2>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
