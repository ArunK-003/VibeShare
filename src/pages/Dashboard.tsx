import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, signOut } from '../lib/auth';
import { Music, Plus, Users, LogOut } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Vibe Share</h1>
              <p className="text-gray-300">Welcome back, {user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Share Music, Create Memories
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create or join music rooms to share your favorite songs with friends. 
            Take turns playing music in a collaborative listening experience.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Room Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all transform hover:scale-105 cursor-pointer group"
               onClick={() => navigate('/create-room')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Create Room</h3>
              <p className="text-gray-300 mb-6">
                Start a new music room and invite friends to share songs together. 
                As the room admin, you control the playlist flow.
              </p>
              <div className="inline-flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                <span>Create New Room</span>
                <Plus className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>

          {/* Join Room Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all transform hover:scale-105 cursor-pointer group"
               onClick={() => navigate('/join-room')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Join Room</h3>
              <p className="text-gray-300 mb-6">
                Enter a room ID to join an existing music session. 
                Add your songs to the queue and enjoy the shared experience.
              </p>
              <div className="inline-flex items-center text-purple-400 font-semibold group-hover:text-purple-300 transition-colors">
                <span>Join Existing Room</span>
                <Users className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6 text-center">
              <Music className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Audio Upload</h4>
              <p className="text-gray-400 text-sm">Upload MP3, WAV, and other audio formats</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Round-Robin Play</h4>
              <p className="text-gray-400 text-sm">Fair turn-based music sharing</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6 text-center">
              <Plus className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Real-time Sync</h4>
              <p className="text-gray-400 text-sm">Synchronized playback for all participants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};