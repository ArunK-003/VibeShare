import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from '../lib/auth';
import { Music, Upload, Play, Pause, Volume2, Users, Settings, Copy, LogOut, PlayCircle } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  admin_id: string;
  room_code: string;
  max_songs_per_user: number;
  songs_per_round: number;
}

interface Song {
  id: string;
  file_name: string;
  file_url: string;
  user_id: string;
  display_name?: string;
  order: number;
}

interface UserProfile {
  id: string;
  display_name: string;
}

export function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [roomUsers, setRoomUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchCurrentUser();
    if (roomId) {
      fetchRoomAndSongs();
      fetchRoomUsers();

      // Set up real-time subscriptions with better error handling
      const setupRealtimeSubscriptions = () => {
        const songsChannel = supabase
          .channel(`songs-${roomId}-${Date.now()}`)
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'songs', filter: `room_id=eq.${roomId}` },
            (payload) => {
              console.log('Songs change detected:', payload);
              // Immediate update
              fetchRoomAndSongs();
              fetchRoomUsers();
              // Delayed update to ensure consistency
              setTimeout(() => {
                fetchRoomAndSongs();
                fetchRoomUsers();
              }, 1000);
            }
          )
          .subscribe((status) => {
            console.log('Songs subscription status:', status);
          });

        const profilesChannel = supabase
          .channel(`profiles-${roomId}-${Date.now()}`)
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'user_profiles' },
            (payload) => {
              console.log('Profile change detected:', payload);
              fetchRoomUsers();
              setTimeout(() => {
                fetchRoomUsers();
              }, 1000);
            }
          )
          .subscribe((status) => {
            console.log('Profiles subscription status:', status);
          });

        return { songsChannel, profilesChannel };
      };

      const { songsChannel, profilesChannel } = setupRealtimeSubscriptions();

      // Set up periodic refresh as backup
      const refreshInterval = setInterval(() => {
        fetchRoomAndSongs();
        fetchRoomUsers();
      }, 5000); // Refresh every 5 seconds

      return () => {
        clearInterval(refreshInterval);
        songsChannel.unsubscribe();
        profilesChannel.unsubscribe();
      };
    }
  }, [roomId]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUser(user);
    } else {
      navigate('/login');
    }
  };

  const fetchRoomAndSongs = async () => {
    if (!roomId) return;

    try {
      // Fetch room details
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;
      setRoom(roomData);

      // Check if current user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAdmin(user.id === roomData.admin_id);
      }

      // Fetch songs with user profiles
      const { data: songsData, error: songsError } = await supabase
        .from('songs')
        .select(`
          *,
          user_profiles(display_name)
        `)
        .eq('room_id', roomId)
        .order('order');

      if (songsError) throw songsError;

      const songsWithDisplayName = songsData?.map(song => ({
        ...song,
        display_name: song.user_profiles?.display_name || 'Unknown User'
      })) || [];

      setSongs(songsWithDisplayName);

      // Filter user's own songs
      if (user) {
        const userOwnSongs = songsWithDisplayName.filter(song => song.user_id === user.id);
        setUserSongs(userOwnSongs);
      }

    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const fetchRoomUsers = async () => {
    if (!roomId) return;

    try {
      // Get unique user IDs from songs in this room
      const { data: songsData } = await supabase
        .from('songs')
        .select('user_id')
        .eq('room_id', roomId);

      const userIds = [...new Set(songsData?.map(song => song.user_id) || [])];
      
      // Always include the room admin in the user list
      if (room?.admin_id && !userIds.includes(room.admin_id)) {
        userIds.push(room.admin_id);
      }
      
      if (userIds.length > 0) {
        const { data: usersData } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', userIds);

        setRoomUsers(usersData || []);
      }
    } catch (error) {
      console.error('Error fetching room users:', error);
    }
  };
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser || !room) return;

    // Check if user has reached the limit
    if (userSongs.length >= room.max_songs_per_user) {
      alert(`You can only upload ${room.max_songs_per_user} songs per room.`);
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `songs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('songs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('songs')
        .getPublicUrl(filePath);

      // Save song to database
      const { error: dbError } = await supabase
        .from('songs')
        .insert({
          room_id: roomId,
          user_id: currentUser.id,
          file_url: publicUrl,
          file_name: file.name,
          order: songs.length
        });

      if (dbError) throw dbError;

      // Multiple refresh attempts to ensure updates
      fetchRoomAndSongs();
      fetchRoomUsers();
      
      // Immediate refresh for all users (especially important for admin to see uploads)
      setTimeout(() => {
        fetchRoomAndSongs();
        fetchRoomUsers();
      }, 50);
      
      setTimeout(() => {
        fetchRoomAndSongs();
        fetchRoomUsers();
      }, 200);
      
      setTimeout(() => {
        fetchRoomAndSongs();
        fetchRoomUsers();
      }, 500);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const playSong = (song: Song) => {
    if (!isAdmin) return; // Only admin can play songs
    
    if (audioRef.current) {
      audioRef.current.src = song.file_url;
      audioRef.current.play();
      setCurrentSong(song);
      const songIndex = songs.findIndex(s => s.id === song.id);
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    }
  };

  const playNextSong = () => {
    if (!isAdmin || songs.length === 0) return;
    
    const nextIndex = (currentSongIndex + 1) % songs.length;
    const nextSong = songs[nextIndex];
    
    if (nextSong && audioRef.current) {
      audioRef.current.src = nextSong.file_url;
      audioRef.current.play();
      setCurrentSong(nextSong);
      setCurrentSongIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (!isAdmin) return; // Only admin can control playback
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;
      
      // Immediate refresh for all users (especially important for admin to see deletions)
      fetchRoomAndSongs();
      fetchRoomUsers();
      
      setTimeout(() => {
        fetchRoomAndSongs();
        fetchRoomUsers();
      }, 50);
      
      setTimeout(() => {
        fetchRoomAndSongs();
        fetchRoomUsers();
      }, 200);
      
      setTimeout(() => {
        fetchRoomAndSongs();
        fetchRoomUsers();
      }, 500);
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const copyRoomCode = () => {
    if (room?.room_code) {
      navigator.clipboard.writeText(room.room_code);
      alert('Room code copied to clipboard!');
    }
  };

  const leaveRoom = () => {
    navigate('/dashboard');
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Room Code: {room.room_code}</span>
              <button onClick={copyRoomCode} className="text-blue-400 hover:text-blue-300">
                <Copy size={16} />
              </button>
              <span>Max Songs: {room.max_songs_per_user}</span>
              <span>Songs per Round: {room.songs_per_round}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Room Users */}
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">
                {roomUsers.length} user{roomUsers.length !== 1 ? 's' : ''}
              </span>
              <div className="flex -space-x-2">
                {roomUsers.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-gray-800"
                    title={user.display_name}
                  >
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {roomUsers.length > 3 && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-gray-800">
                    +{roomUsers.length - 3}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={leaveRoom}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              <LogOut size={16} />
              Leave Room
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar - Upload & User Songs */}
        <div className="w-1/3 bg-gray-800 p-6 border-r border-gray-700">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Songs</h2>
            <div className="mb-4">
              <div className="bg-gray-700 rounded-lg p-2">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Your Songs</span>
                  <span>{userSongs.length}/{room.max_songs_per_user}</span>
                </div>
                <div className="bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: (userSongs.length / room.max_songs_per_user) * 100 + '%' }}
                  ></div>
                </div>
              </div>
            </div>
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
              <div className="text-center">
                <Upload className="mx-auto mb-2" size={24} />
                <span className="text-sm">
                  {uploading ? 'Uploading...' : 'Click to upload audio'}
                </span>
              </div>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={uploading || userSongs.length >= room.max_songs_per_user}
                onEnded={() => {
                  setIsPlaying(false);
                  if (isAdmin) {
                    playNextSong();
                  }
                }}
              />
            </label>
          </div>

          {/* User's Songs */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Your Playlist</h3>
            <div className="space-y-2">
              {userSongs.map((song) => (
                <div key={song.id} className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Music size={16} />
                    <span className="text-sm truncate">{song.file_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteSong(song.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {userSongs.length > 0 && !isAdmin && (
                <div className="mt-2 p-2 bg-blue-500/20 border border-blue-500/50 rounded text-xs text-blue-200">
                  ℹ️ Only the room admin can play songs
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - All Songs */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Room Playlist</h2>
            <div className="grid gap-3">
              {songs.map((song) => (
                <div key={song.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {currentSong?.id === song.id ? (
                        <div className="flex items-center">
                          <PlayCircle size={20} className="text-green-400" />
                          {!isAdmin && isPlaying && (
                            <div className="ml-2 flex items-center">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                              <span className="text-xs text-green-400 font-medium">PLAYING</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Music size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {song.file_name}
                        {!isAdmin && currentSong?.id === song.id && isPlaying && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium animate-pulse">
                            ♪ NOW PLAYING
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        by {song.display_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => playSong(song)}
                      disabled={!isAdmin}
                      className={`flex items-center gap-2 px-3 py-1 rounded ${
                        isAdmin 
                          ? 'bg-green-600 hover:bg-green-700 cursor-pointer' 
                          : 'bg-gray-600 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Play size={16} />
                      Play
                    </button>
                    {(isAdmin || song.user_id === currentUser?.id) && (
                      <button
                        onClick={() => deleteSong(song.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!isAdmin && songs.length > 0 && (
                <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    ℹ️ Only the room admin can control music playback. You can upload songs to add them to the playlist.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Audio Player */}
          {currentSong && (
            <>
              <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlayPause}
                      disabled={!isAdmin}
                      className="flex items-center justify-center w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <div>
                      <div className="font-medium">{currentSong.file_name}</div>
                      <div className="text-sm text-gray-400">
                        by {currentSong.display_name}
                        {!isAdmin && isPlaying && (
                          <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            ♪ {currentSong.display_name}'s song
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Volume2 size={20} />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: duration ? (currentTime / duration) * 100 + '%' : '0%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300 mt-2">
                    <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                    <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
              {!isAdmin && (
                <div className="fixed bottom-20 left-4 right-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg z-50">
                  <p className="text-blue-200 text-sm">
                    ℹ️ Only the room admin can control music playback. Currently playing: {currentSong.display_name}'s song
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => {
          setIsPlaying(false);
          if (isAdmin) {
            playNextSong();
          }
        }}
      />
    </div>
  );
}