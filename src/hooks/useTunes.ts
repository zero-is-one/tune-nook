import { Tune } from "@/types";
import { useState } from "react";
import { usePlaylist, useUpdatePlaylist } from "./usePlaylist";

export const useTunes = () => {
  const { playlist } = usePlaylist();
  return { tunes: playlist?.tunes || [] };
};

export const useAddTune = () => {
  const { playlist } = usePlaylist();
  const [updatePlaylist] = useUpdatePlaylist();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTune = async () => {
    if (!playlist) {
      throw new Error("No playlist found");
    }

    try {
      setLoading(true);
      const tune: Omit<Tune, "lastPlayedAt" | "selectedTrackId"> = {
        id: Math.random().toString(36).substring(2),
        name: "Untitled Tune",
        createdAt: new Date(),
        tracks: [],
        isFavorited: false,
      };

      await updatePlaylist({
        tunes: [...(playlist.tunes || []), tune] as Tune[],
      });

      return tune;
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return [addTune, loading, error] as const;
};
