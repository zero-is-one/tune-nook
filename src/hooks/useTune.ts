import { Song, Track, Tune } from "@/types";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePlaylist, useUpdatePlaylist } from "./usePlaylist";

const getTuneLastPlayedAt = (tune: Tune) => {
  return tune?.tracks.reduce((lastPlayedAt: undefined | Timestamp, track) => {
    if (!lastPlayedAt) return track.lastPlayedAt;
    if (!track.lastPlayedAt) return lastPlayedAt;

    return track.lastPlayedAt.toDate() > lastPlayedAt.toDate()
      ? track.lastPlayedAt
      : lastPlayedAt;
  }, undefined);
};

export const useTune = (id: string | undefined = undefined) => {
  const { playlist, loading, error } = usePlaylist();
  const { tuneId } = useParams();
  const tune = playlist?.tunes?.find((tune) => tune.id === tuneId || id);

  // gets last played at or undefined if no last plays
  const lastPlayedAt = getTuneLastPlayedAt(tune!);

  return { tune, loading, error, lastPlayedAt } as const;
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
      createdAt: Timestamp.now(),
      playbackRate: 1,
      playCount: 0,
      startTime: 0,
      song,
    };

    try {
      setLoading(true);
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
