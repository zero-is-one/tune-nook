import { auth, firestore } from "@/firebase";
import { Playlist } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

export const collectionRef = collection(firestore, "playlists");

export const create = async (playlist: Partial<Playlist> = {}) => {
  if (!auth.currentUser) {
    throw new Error("You must be logged in to create a playlist");
  }

  return await addDoc(collectionRef, {
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser.uid,
    tunes: [],
    name: "Untitled Playlist",
    ...playlist,
  } satisfies Omit<Playlist, "id">);
};

export const remove = async (id: string) => {
  return await deleteDoc(doc(collectionRef, id));
};

export const clone = async (id: string) => {
  const playlist = await getDoc(doc(collectionRef, id));

  if (!playlist.exists()) throw new Error("Playlist does not exist");

  return await addDoc(collectionRef, {
    ...playlist.data(),
    name: playlist.data().name + " (copy)",
    createdAt: serverTimestamp(),
  });
};

export const usePlaylists = () => {
  const [user] = useAuthState(auth);
  const playlistsQuery = query(
    collectionRef,
    where("createdBy", "==", user?.uid || ""),
  );
  const [playlists, loading, error] = useCollection(playlistsQuery);

  return {
    playlists: playlists?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Playlist[],
    loading,
    error,
  };
};
