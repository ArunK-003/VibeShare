import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Users, Play, Headphones } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background with floating music elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20">
        {/* Floating music icons */}
        <div className="absolute top-20 left-4 md:left-20 animate-bounce">
          <Music className="w-6 md:w-8 h-6 md:h-8 text-purple-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-8 md:right-32 animate-pulse">
          <div className="w-8 md:w-12 h-8 md:h-12 rounded-full border-2 border-pink-400 opacity-40"></div>
        </div>
        <div className="absolute bottom-32 left-4 md:left-16 animate-bounce delay-300">
          <div className="w-4 md:w-6 h-4 md:h-6 bg-blue-400 rounded-full opacity-50"></div>
        </div>
        <div className="absolute top-60 left-1/4 md:left-1/3 animate-pulse delay-500">
          <Headphones className="w-8 md:w-10 h-8 md:h-10 text-cyan-400 opacity-50" />
        </div>
        <div className="absolute bottom-40 right-8 md:right-20 animate-bounce delay-700">
          <div className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-32 right-1/4 animate-pulse delay-1000">
          <div className="w-3 md:w-4 h-3 md:h-4 bg-cyan-400 rounded-full opacity-70"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold">VibeShare</h1>
        </div>
        <div className="space-x-2 md:space-x-4">
          <Link to="/login" className="text-sm md:text-base px-4 md:px-6 py-2 hover:text-gray-300 transition-colors font-medium">
            Login
          </Link>
          <Link to="/register" className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 font-medium">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2 text-purple-400">
              <Music className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wide">MUSIC MADE SOCIAL</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Share Music,<br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Create Vibes
                </span>
              </h2>
              <p className="text-base md:text-xl text-gray-300 max-w-lg leading-relaxed">
                Join friends in virtual music rooms, upload your favorite tracks, and enjoy round-robin playlists together. Music is better when shared.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="flex items-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-base md:text-lg font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all transform hover:scale-105">
                <Play className="w-5 h-5" />
                <span>Create Room</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-purple-600 text-white rounded-lg text-base md:text-lg font-semibold hover:bg-purple-700 transition-all">
                <Users className="w-5 h-5" />
                <span>Join Room</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <div className="w-14 md:w-16 h-14 md:h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Headphones className="w-6 md:w-8 h-6 md:h-8 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-1">Live Listening</h3>
                <p className="text-gray-400 text-xs md:text-sm">Real-time sync</p>
              </div>
              <div className="text-center">
                <div className="w-14 md:w-16 h-14 md:h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 md:w-8 h-6 md:h-8 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-1">Social Rooms</h3>
                <p className="text-gray-400 text-xs md:text-sm">Up to 20 friends</p>
              </div>
              <div className="text-center">
                <div className="w-14 md:w-16 h-14 md:h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Music className="w-6 md:w-8 h-6 md:h-8 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-1">Any Genre</h3>
                <p className="text-gray-400 text-xs md:text-sm">Upload MP3s</p>
              </div>
            </div>
          </div>

          {/* Right Section remains unchanged for now */}
          {/* You can apply similar responsive logic if needed */}
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
