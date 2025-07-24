import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Users, Play, Headphones } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background with floating music elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20">
        {/* Floating music icons */}
        <div className="absolute top-20 left-20 animate-bounce">
          <Music className="w-8 h-8 text-purple-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-32 animate-pulse">
          <div className="w-12 h-12 rounded-full border-2 border-pink-400 opacity-40"></div>
        </div>
        <div className="absolute bottom-32 left-16 animate-bounce delay-300">
          <div className="w-6 h-6 bg-blue-400 rounded-full opacity-50"></div>
        </div>
        <div className="absolute top-60 left-1/3 animate-pulse delay-500">
          <Headphones className="w-10 h-10 text-cyan-400 opacity-50" />
        </div>
        <div className="absolute bottom-40 right-20 animate-bounce delay-700">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-32 right-1/4 animate-pulse delay-1000">
          <div className="w-4 h-4 bg-cyan-400 rounded-full opacity-70"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">VibeShare</h1>
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 text-white hover:text-gray-300 transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Music Made Social Badge */}
            <div className="flex items-center space-x-2 text-purple-400">
              <Music className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide uppercase">MUSIC MADE SOCIAL</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-6xl lg:text-7xl font-bold leading-tight">
                Share Music,
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Create Vibes
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                Join friends in virtual music rooms, upload your favorite tracks, and 
                enjoy round-robin playlists together. Music is better when shared.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-lg font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5" />
                <span>Create Room</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 px-8 py-4 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition-all"
              >
                <Users className="w-5 h-5" />
                <span>Join Room</span>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Live Listening</h3>
                <p className="text-gray-400 text-sm">Real-time sync</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Social Rooms</h3>
                <p className="text-gray-400 text-sm">Up to 20 friends</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Any Genre</h3>
                <p className="text-gray-400 text-sm">Upload MP3s</p>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration Area */}
          <div className="relative">
            {/* Main gradient background */}
            <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl relative overflow-hidden">
              {/* Cloud-like shapes */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-800 to-transparent rounded-b-3xl"></div>
              <div className="absolute bottom-8 left-8 w-24 h-12 bg-purple-700/60 rounded-full blur-sm"></div>
              <div className="absolute bottom-12 right-12 w-32 h-16 bg-blue-700/60 rounded-full blur-sm"></div>
              <div className="absolute bottom-20 left-1/3 w-20 h-10 bg-cyan-700/60 rounded-full blur-sm"></div>

              {/* Floating music elements */}
              <div className="absolute top-16 left-16 animate-float">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute top-32 right-20 animate-float delay-300">
                <div className="w-8 h-8 bg-pink-400/60 rounded-full"></div>
              </div>
              <div className="absolute top-48 left-1/4 animate-float delay-500">
                <Headphones className="w-10 h-10 text-white/80" />
              </div>
              <div className="absolute top-20 right-1/3 animate-float delay-700">
                <div className="w-6 h-6 bg-cyan-400/60 rounded-full"></div>
              </div>
              <div className="absolute bottom-32 right-16 animate-float delay-1000">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Central headphones icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Headphones className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Bottom floating icon */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Floating music note in corner */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <Music className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
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