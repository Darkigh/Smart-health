import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Home/HomePage';
import RecipeFinderPage from './pages/RecipeFinder/RecipeFinderPage';
import CaloriesCalculatorPage from './pages/CaloriesCalculator/CaloriesCalculatorPage';
import ScreenshotSuccessPage from './pages/ScreenshotSuccess/ScreenshotSuccessPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe-finder" element={<RecipeFinderPage />} />
            <Route path="/calories-calculator" element={<CaloriesCalculatorPage />} />
            <Route path="/screenshot-success" element={<ScreenshotSuccessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
