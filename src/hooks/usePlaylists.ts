import { playlistsAtom } from "@/atoms";
import { playlistsRef } from "@/components/AtomStoreProvider/AtomStoreProvider";
import { auth } from "@/firebase";
import { Playlist } from "@/types";
import { Timestamp, deleteDoc, doc } from "firebase/firestore";
import { useAtom } from "jotai";
import { useAuthState } from "react-firebase-hooks/auth";

export const usePlaylists = () => {
  const [user] = useAuthState(auth);
  const [playlists, setPlaylists] = useAtom(playlistsAtom);

  const create = (
    playlist: Omit<Playlist, "id" | "createdAt" | "creatorId">,
  ) => {
    if (!user) throw new Error("User is not authenticated");
    const newPlaylist = {
      ...playlist,
      id: doc(playlistsRef).id,
      creatorId: user.uid,
      createdAt: Timestamp.now(),
    };

    setPlaylists((p) => [...p, newPlaylist]);
    return newPlaylist;
  };

  const remove = (playlist: Playlist) => {
    setPlaylists((p) => p.filter((curr) => curr.id !== playlist.id));
    deleteDoc(doc(playlistsRef, playlist.id));
  };

  const clone = (playlist: Playlist) => {
    create(playlist);
  };

  return { playlists, create, remove, clone };
};
