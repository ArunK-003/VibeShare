import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Music, Trash2 } from 'lucide-react';

export default function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [userSongs, setUserSongs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRoomAndSongs();
    fetchCurrentUser();
  }, []);

  const fetchRoomAndSongs = async () => {
    const { data: roomData } = await supabase.from('rooms').select('*').eq('id', roomId).single();
    const { data: songData } = await supabase.from('songs').select('*').eq('room_id', roomId);

    setRoom(roomData);
    setUserSongs(songData || []);
  };

  const fetchCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUser(user);

    if (user?.id === room?.created_by) {
      setIsAdmin(true);
    }
  };

  const uploadSong = async (event: any) => {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `songs/${fileName}`;

    let { error: uploadError } = await supabase.storage.from('songs').upload(filePath, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      setUploading(false);
      return;
    }

    const { error: insertError } = await supabase.from('songs').insert([
      {
        file_name: file.name,
        room_id: roomId,
        uploaded_by: currentUser.id,
        path: filePath,
      },
    ]);

    if (insertError) {
      console.error('Insert Error:', insertError);
    } else {
      fetchRoomAndSongs();
    }

    setUploading(false);
  };

  const deleteSong = async (songId: string) => {
    try {
      const { error } = await supabase.from('songs').delete().eq('id', songId);
      if (error) throw error;

      setUserSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
      fetchRoomAndSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">{room?.name || 'Room'}</h1>

      <div className="mb-4">
        <input type="file" onChange={uploadSong} disabled={uploading} />
      </div>

      <div className="space-y-3">
        {userSongs.map((song) => (
          <div key={song.id} className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music size={16} />
              <span className="text-sm truncate">{song.file_name}</span>
            </div>
            <div className="flex gap-2">
              {(isAdmin || song.uploaded_by === currentUser?.id) && (
                <button
                  onClick={() => deleteSong(song.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
