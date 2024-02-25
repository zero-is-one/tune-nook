import { Track, Tune } from "@/types";
import { useUpdateTune } from "./useTune";

export const useSelectedTrack = (tune?: Tune) => {
  return (
    tune?.tracks.find((t) => t.id === tune?.selectedTrackId) || tune?.tracks[0]
  );
};

export const useUpdateTrack = (tune?: Tune) => {
  const selectedTrack = useSelectedTrack(tune);
  const [updateTune, loading, error] = useUpdateTune(tune);

  const update = (updates: Partial<Track>) => {
    const trackId = updates.id || selectedTrack?.id;

    updateTune({
      tracks: tune?.tracks.map((t) =>
        t.id === trackId ? { ...t, ...updates } : t,
      ),
    });
  };

  return [update, loading, error] as const;
};
