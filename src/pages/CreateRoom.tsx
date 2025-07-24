import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from '../lib/auth';
import { ArrowLeft, Users, Hash } from 'lucide-react';

export const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [maxSongsPerUser, setMaxSongsPerUser] = useState(10);
  const [songsPerRound, setSongsPerRound] = useState(1);
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

      // Generate a unique 6-character room code
      const generateRoomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const roomCode = generateRoomCode();

      const { data, error } = await supabase
        .from('rooms')
        .insert([
          {
            name: roomName,
            admin_id: user.id,
            password: password,
            max_songs_per_user: maxSongsPerUser,
            songs_per_round: songsPerRound,
            room_code: roomCode,
          },
        ])
        .select()
        .single();

      if (error) {
        setError(error.message);
      } else {
        // Create user profile
        await supabase
          .from('user_profiles')
          .upsert([
            {
              id: user.id,
              display_name: displayName,
            },
          ]);

        navigate(`/room/${data.id}`);
      }
    } catch (err) {
      setError('Failed to create room');
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
          <h1 className="text-3xl font-bold text-white">Create Music Room</h1>
        </div>

        {/* Create Room Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create Your Music Room</h2>
            <p className="text-gray-300">Give your room a name and start sharing music with friends</p>
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all mb-4"
                placeholder="Enter your name (e.g., John)"
                required
                maxLength={30}
              />
              <p className="text-xs text-gray-400 mb-4">This name will be visible to other participants</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Name
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter room name (e.g., Friday Night Vibes)"
                  required
                  maxLength={50}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Choose a memorable name for your music room</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Set a password for your room"
                required
                minLength={4}
              />
              <p className="text-xs text-gray-400 mt-1">Password required for others to join (minimum 4 characters)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Songs Per User
                </label>
                <select
                  value={maxSongsPerUser}
                  onChange={(e) => setMaxSongsPerUser(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value={5} className="bg-gray-800">5 songs</option>
                  <option value={10} className="bg-gray-800">10 songs</option>
                  <option value={15} className="bg-gray-800">15 songs</option>
                  <option value={20} className="bg-gray-800">20 songs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Songs Per Round
                </label>
                <select
                  value={songsPerRound}
                  onChange={(e) => setSongsPerRound(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value={1} className="bg-gray-800">1 song</option>
                  <option value={2} className="bg-gray-800">2 songs</option>
                  <option value={3} className="bg-gray-800">3 songs</option>
                </select>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Room Features</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  You'll be the room admin with full control
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Share the room code and password with friends to invite them
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Upload up to {maxSongsPerUser} songs per user
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Play {songsPerRound} song{songsPerRound > 1 ? 's' : ''} per user per round
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !roomName.trim() || !displayName.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Room...' : 'Create Room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};