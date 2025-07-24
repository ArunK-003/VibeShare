import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from '../lib/auth';
import { ArrowLeft, Users, Hash } from 'lucide-react';

export const JoinRoom: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Verify room password first
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode)
        .limit(1);

      if (error || !data || data.length === 0) {
        setError('Room not found. Please check the room code and try again.');
        setLoading(false);
        return;
      }

      const room = data[0];

      // Verify password
      if (room.password !== password) {
        setError('Invalid password. Please check and try again.');
        setLoading(false);
        return;
      } else {
        // Create or update user profile
        await supabase
          .from('user_profiles')
          .upsert([
            {
              id: user.id,
              display_name: displayName,
            },
          ]);

        navigate(`/room/${room.id}`);
      }
    } catch (err) {
      setError('Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-white">Join Vibe Share</h1>
        </div>

        {/* Join Room Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Join Existing Room</h2>
            <p className="text-gray-300">Enter the room ID to join the music session</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-4"
                placeholder="Enter your name (e.g., John)"
                required
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Code
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.trim().toUpperCase())}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter room code (e.g., ABC123)"
                  required
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Get the room code from the room creator</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter room password"
                required
              />
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  You'll be added to the room\'s participant list
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  Upload your songs to add them to the queue
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  Listen to music in round-robin order with other participants
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  Enjoy synchronized playback with everyone
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !roomCode.trim() || !displayName.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Joining Room...' : 'Join Room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};