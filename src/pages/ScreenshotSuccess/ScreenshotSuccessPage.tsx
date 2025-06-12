import React from 'react';
import { Link } from 'react-router-dom';
import foodBg from '../../assets/food-background.jpg';

const ScreenshotSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${foodBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 text-green-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Screenshot Saved Successfully!</h1>
          
          <p className="text-gray-600 mb-8">
            Your recipe screenshot has been saved to your device. Thank you for using Smart Health Assistant!
          </p>
          
          <Link 
            to="/" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotSuccessPage;
