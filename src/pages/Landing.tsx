import React from 'react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen text-white overflow-x-hidden">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left content */}
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Welcome to <span className="text-purple-500">VibeShare</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Share your music, join rooms, and vibe with friends in real time. A unique way to enjoy music together.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 w-full sm:w-auto text-center"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-purple-600 hover:bg-purple-700 hover:text-white text-purple-400 font-semibold py-3 px-6 rounded-lg transition duration-300 w-full sm:w-auto text-center"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right illustration */}
          <div className="lg:w-1/2 w-full mt-10 lg:mt-0 flex justify-center">
            <img
              src="https://illustrations.popsy.co/white/music-band.png"
              alt="Music Sharing"
              className="w-full max-w-md"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8">Why VibeShare?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-500 transition duration-300">
              <h4 className="text-xl font-semibold mb-2">Real-time Sync</h4>
              <p className="text-gray-400 text-sm">Listen to songs together in sync with friends around the globe.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-500 transition duration-300">
              <h4 className="text-xl font-semibold mb-2">Room-Based Sharing</h4>
              <p className="text-gray-400 text-sm">Create or join custom rooms to share your music vibes.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-purple-500 transition duration-300">
              <h4 className="text-xl font-semibold mb-2">Admin Control</h4>
              <p className="text-gray-400 text-sm">Manage playlists, limit uploads, and guide the vibe your way.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
