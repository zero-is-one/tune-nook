import { Song, Track, Tune } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePlaylist, useUpdatePlaylist } from "./usePlaylist";

export const useTune = () => {
  const { playlist, loading, error } = usePlaylist();
  const { tuneId } = useParams();
  const tune = playlist?.tunes?.find((tune) => tune.id === tuneId);

  return { tune, loading, error };
};

export const useUpdateTune = () => {
  const { playlist } = usePlaylist();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { tune } = useTune();
  const [updatePlaylist] = useUpdatePlaylist();

  const updateTune = async (data: Partial<Tune>) => {
    try {
      setLoading(true);
      const updatedTunes = playlist!.tunes?.map((t) =>
        t.id === tune?.id ? { ...t, ...data } : t,
      );

      await updatePlaylist({
        tunes: updatedTunes,
      });
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return [updateTune, loading, error] as const;
};

export const useAddSong = () => {
  const { tune } = useTune();
  const [updateTune] = useUpdateTune();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addSong = async (song: Song) => {
    const track: Track = {
      id: Math.random().toString(36).substring(2),
      createdAt: new Date(),
      playbackRate: 1,
      playCount: 0,
      startTime: 0,
      song,
    };

    try {
      setLoading(true);
      console.log(tune!.tracks, track);
      await updateTune({
        tracks: [...tune!.tracks, track],
      });
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return [addSong, loading, error] as const;
};

export const useRemoveTrack = () => {
  const { tune } = useTune();
  const [updateTune] = useUpdateTune();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const removeTrack = async (track: Track) => {
    try {
      setLoading(true);
      await updateTune({
        tracks: tune!.tracks.filter((t) => t.id !== track.id),
      });
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return [removeTrack, loading, error] as const;
};
