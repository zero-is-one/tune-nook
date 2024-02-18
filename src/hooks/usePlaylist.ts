import { playlistsRef } from "@/components/AtomStoreProvider/AtomStoreProvider";
import { Playlist } from "@/types";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";

export const usePlaylist = () => {
  const { playlistId } = useParams();
  const [snapshot, loading, error] = useDocument(doc(playlistsRef, playlistId));

  return {
    playlist: !snapshot
      ? undefined
      : ({ ...snapshot?.data(), id: snapshot?.id } as Playlist),
    loading,
    error,
  };
};

export const useUpdatePlaylist = () => {
  const { playlist } = usePlaylist();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePlaylist = async (data: Partial<Playlist>) => {
    try {
      setLoading(true);
      await setDoc(doc(playlistsRef, playlist?.id), data, { merge: true });
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return [updatePlaylist, loading, error] as const;
};
