import { Tune } from "@/types";
import { useState } from "react";
import { usePlaylist, useUpdatePlaylist } from "./usePlaylist";

export const useTunes = () => {
  const { playlist } = usePlaylist();
  return { tunes: playlist.tunes || [] };
};

export const useCreateTune = () => {
  const { playlist } = usePlaylist();
  const [updatePlaylist] = useUpdatePlaylist();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  console.log(playlist);
  const createTune = async () => {
    try {
      setLoading(true);
      const tune: Omit<Tune, "lastPlayedAt" | "selectedSongId"> = {
        id: Math.random().toString(36).substring(2),
        name: "Untitled Tune",
        createdAt: new Date(),
        //lastPlayedAt: undefined,
        //selectedSongId: undefined,
        songs: [],
      };

      await updatePlaylist({
        tunes: [...(playlist.tunes || []), tune] as Tune[],
      });
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return [createTune, loading, error] as const;
};
