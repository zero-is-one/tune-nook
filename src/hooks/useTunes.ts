import { auth, firestore } from "@/firebase";
import { Playlist, Tune } from "@/types";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { usePlaylist } from "./usePlaylist";

export const ref = collection(firestore, "tunes");

const usePlaylistId = (playlist?: Playlist) => {
  const [currentPlaylist] = usePlaylist();
  return playlist?.id || currentPlaylist?.id;
};

export const useTunes = (playlist?: Playlist) => {
  const playlistId = usePlaylistId(playlist);
  const q = query(ref, where("playlistId", "==", playlistId || "none"));
  const [snapshot, loading, error] = useCollection(playlistId ? q : null);

  return [
    snapshot
      ? snapshot?.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Tune)
      : undefined,
    loading,
    error,
  ] as const;
};

export const useCreateTune = (playlist?: Playlist) => {
  const playlistId = usePlaylistId(playlist);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = (tune: Partial<Tune>) => {
    if (!user) throw new Error("User is not authenticated");
    if (!playlistId) throw new Error("Playlist is not selected");

    setLoading(true);
    setError(null);

    return addDoc(ref, {
      ...tune,
      playlistId: tune?.playlistId || playlistId,
      creatorId: user?.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastPlayedAt: null,
      playCount: 0,
      selectedTrackId: tune.tracks?.[0]?.id || "selectedTrackId error",
    } satisfies Omit<Tune, "id" | "tracks" | "title">)
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  return [create, loading, error] as const;
};

export const useRemoveTune = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (tune: Tune) => {
    setLoading(true);
    setError(null);

    return deleteDoc(doc(ref, tune.id))
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  return [remove, loading, error] as const;
};

export const useCloneTune = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [create] = useCreateTune();

  const clone = async (tune: Tune) => {
    setLoading(true);
    setError(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...newTune } = tune;

    return create(newTune);
  };

  return [clone, loading, error] as const;
};
