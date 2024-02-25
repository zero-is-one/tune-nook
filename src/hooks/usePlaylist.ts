import { Playlist } from "@/types";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";

import { ref as playlistsRef } from "@/hooks/usePlaylists";

export const usePlaylist = (playlist?: Playlist) => {
  let { playlistId } = useParams();
  playlistId = playlist?.id || playlistId;
  const [snapshot, loading, error] = useDocument(
    playlistId ? doc(playlistsRef, playlistId) : null,
  );

  return [
    !snapshot
      ? undefined
      : ({ ...snapshot?.data(), id: snapshot?.id } as Playlist),
    loading,
    error,
  ] as const;
};

export const useUpdatePlaylist = (playlist?: Playlist) => {
  const [currentPlaylist] = usePlaylist();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (data: Partial<Playlist>) => {
    setLoading(true);
    setError(null);

    const playlistId = playlist?.id || currentPlaylist?.id;

    return setDoc(doc(playlistsRef, playlistId), data, { merge: true })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  return [update, loading, error] as const;
};
