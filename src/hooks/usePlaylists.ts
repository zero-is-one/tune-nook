import { auth, firestore } from "@/firebase";
import { Playlist } from "@/types";
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

export const ref = collection(firestore, "playlists");

export const usePlaylists = () => {
  const [user] = useAuthState(auth);
  const q = query(
    ref,
    where("creatorId", "==", user?.uid || "none"),
    where("isDeleted", "==", false),
  );
  const [snapshot, loading, error] = useCollection(user ? q : null);
  const playlists = snapshot
    ? (snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Playlist[])
    : undefined;

  return [playlists, loading, error] as const;
};

export const useCreatePlaylist = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = (playlist: Partial<Playlist>) => {
    if (!user) throw new Error("User is not authenticated");
    setLoading(true);
    setError(null);

    return addDoc(ref, {
      ...playlist,
      creatorId: user?.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isDeleted: false,
    } as Partial<Playlist>)
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  return [create, loading, error] as const;
};

export const useRemovePlaylist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (playlist: Playlist) => {
    setLoading(true);
    setError(null);

    return deleteDoc(doc(ref, playlist.id))
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  return [remove, loading, error] as const;
};

export const useClonePlaylist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clone = async (playlist: Playlist) => {
    setLoading(true);
    setError(null);

    const newPlaylist: Playlist = {
      ...playlist,
      title: playlist.title + " (copy)",
    };
    delete (newPlaylist as Partial<Playlist>).id;

    return addDoc(ref, newPlaylist)
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  return [clone, loading, error] as const;
};
