import { playlistsAtom } from "@/atoms";
import { firestore } from "@/firebase";
import { Playlist } from "@/types";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { Provider as JotaiProvider, createStore } from "jotai";
import { useEffect, useState } from "react";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

export const playlistsRef = collection(firestore, "playlists");

export const AtomStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store] = useState(() => createStore());
  const [playlists, playlistsLoading, playlistsError] =
    useCollectionDataOnce(playlistsRef);

  useEffect(() => {
    if (playlistsLoading) return;
    if (playlistsError) return;
    if (!playlists) return;

    store.set(playlistsAtom, playlists as Playlist[]);
  }, [playlists, playlistsLoading, playlistsError, store]);

  useEffect(() => {
    const unsubscribe = store.sub(playlistsAtom, () => {
      store.get(playlistsAtom).forEach(async (playlist) => {
        const docData: Playlist = {
          ...playlist,
          updatedAt: Timestamp.now(),
        };

        await setDoc(doc(playlistsRef, docData.id), docData, { merge: true });
      });
    });
    return () => {
      unsubscribe();
    };
  }, [store]);

  if (playlistsLoading) return <div>Loading Playlists...</div>;
  if (playlistsError)
    return <div>Playlists Error: {playlistsError.message} </div>;

  return <JotaiProvider store={store}>{children}</JotaiProvider>;
};
