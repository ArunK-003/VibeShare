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
          <Music className="w-6 h-6 md:w-8 md:h-8 text-purple-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-32 animate-pulse">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-pink-400 opacity-40"></div>
        </div>
        <div className="absolute bottom-32 left-16 animate-bounce delay-300">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-blue-400 rounded-full opacity-50"></div>
        </div>
        <div className="absolute top-60 left-1/3 animate-pulse delay-500">
          <Headphones className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 opacity-50" />
        </div>
        <div className="absolute bottom-40 right-20 animate-bounce delay-700">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-32 right-1/4 animate-pulse delay-1000">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-cyan-400 rounded-full opacity-70"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-wrap justify-between items-center px-4 py-4 md:px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold">VibeShare</h1>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Link
            to="/login"
            className="px-4 md:px-6 py-2 text-white hover:text-gray-300 transition-colors font-medium text-sm md:text-base"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 font-medium text-sm md:text-base"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Music Made Social Badge */}
            <div className="flex items-center space-x-2 text-purple-400">
              <Music className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium tracking-wide uppercase">MUSIC MADE SOCIAL</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Share Music,
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Create Vibes
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-lg leading-relaxed">
                Join friends in virtual music rooms, upload your favorite tracks, and enjoy round-robin playlists together.
                Music is better when shared.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-base font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5" />
                <span>Create Room</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg text-base font-semibold hover:bg-purple-700 transition-all"
              >
                <Users className="w-5 h-5" />
                <span>Join Room</span>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 md:pt-8">
              {[
                {
                  icon: <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                  title: 'Live Listening',
                  desc: 'Real-time sync',
                  bg: 'from-cyan-400 to-blue-500',
                },
                {
                  icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                  title: 'Social Rooms',
                  desc: 'Up to 20 friends',
                  bg: 'from-purple-400 to-pink-500',
                },
                {
                  icon: <Music className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                  title: 'Any Genre',
                  desc: 'Upload MP3s',
                  bg: 'from-blue-400 to-cyan-400',
                },
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.bg} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative">
            <div className="w-full h-72 sm:h-96 lg:h-[500px] bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl relative overflow-hidden">
              {/* Cloud-like shapes */}
              <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-purple-800 to-transparent rounded-b-3xl"></div>
              <div className="absolute bottom-8 left-8 w-16 h-8 sm:w-24 sm:h-12 bg-purple-700/60 rounded-full blur-sm"></div>
              <div className="absolute bottom-12 right-12 w-20 h-10 sm:w-32 sm:h-16 bg-blue-700/60 rounded-full blur-sm"></div>
              <div className="absolute bottom-20 left-1/3 w-16 h-8 sm:w-20 sm:h-10 bg-cyan-700/60 rounded-full blur-sm"></div>

              {/* Floating music elements */}
              <div className="absolute top-12 left-12 animate-float">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="absolute top-28 right-16 animate-float delay-300">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-400/60 rounded-full"></div>
              </div>
              <div className="absolute top-40 left-1/4 animate-float delay-500">
                <Headphones className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
              </div>
              <div className="absolute top-20 right-1/3 animate-float delay-700">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-cyan-400/60 rounded-full"></div>
              </div>
              <div className="absolute bottom-28 right-12 animate-float delay-1000">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>

              {/* Central icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Headphones className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>

              {/* Bottom icon */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Corner floating icon */}
            <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <Music className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
