import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../components/UserContext';
import { SongUpload } from '../components/SongUpload';
import { SongPlayer } from '../components/SongPlayer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Room() {
  const { roomId } = useParams();
  const { user } = useUser();
  const [room, setRoom] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).single();
      if (data) {
        setRoom(data);
        setIsAdmin(user?.id === data.created_by);
      }
    };

    fetchRoom();
  }, [roomId, user]);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data } = await supabase
        .from('songs')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at');

      if (data) {
        setSongs(data);
      }
    };

    fetchSongs();

    const songListener = supabase
      .channel('room-songs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, () => fetchSongs())
      .subscribe();

    return () => {
      supabase.removeChannel(songListener);
    };
  }, [roomId]);

  const deleteSong = async (id) => {
    await supabase.from('songs').delete().eq('id', id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2e2e3e] text-white p-4 md:p-8">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Room: {room?.name}</h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <p className="text-sm md:text-base">Room ID: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{roomId}</span></p>
          <span className="text-sm md:text-base text-green-400">{isAdmin ? 'You are the Admin' : 'You are a Participant'}</span>
        </div>

        <SongUpload roomId={roomId} />

        <ScrollArea className="mt-6 max-h-96 border rounded-lg p-4 bg-white/10">
          {songs.length === 0 ? (
            <p className="text-center text-gray-300">No songs uploaded yet.</p>
          ) : (
            <ul className="space-y-4">
              {songs.map((song, index) => (
                <li
                  key={song.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/5 p-4 rounded-md shadow hover:bg-white/10 transition"
                >
                  <div className="mb-2 md:mb-0">
                    <p className="font-semibold">{song.title}</p>
                    <p className="text-xs text-gray-400">Uploaded by: {song.username}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <SongPlayer url={song.url} />
                    {isAdmin && (
                      <Button variant="destructive" onClick={() => deleteSong(song.id)} size="sm">
                        Delete
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
