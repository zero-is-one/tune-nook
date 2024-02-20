import { playlistsAtom, selectedTrackAtom, selectedTuneAtom } from "@/atoms";
import { Playlist, Track, Tune } from "@/types";
import { useAtom, useAtomValue } from "jotai";
import { useParams } from "react-router-dom";

export const useUpdatePlaylist = (playlist?: Playlist) => {
  const { playlistId: playlistIdParams } = useParams();
  const playlistId = playlist?.id || playlistIdParams;
  const [playlists, setPlaylists] = useAtom(playlistsAtom);

  if (!playlistId) throw new Error("No playlist id found.");

  const update = (updates: Partial<Playlist>) => {
    console.log({ updates, playlists });
    setPlaylists(
      playlists.map((p) => (p.id === playlistId ? { ...p, ...updates } : p)),
    );
  };

  return { update, playlist: playlists.find((p) => p.id === playlistId) };
};

export const useUpdateTune = (tune?: Tune) => {
  const { update: updatePlaylist, playlist } = useUpdatePlaylist();

  const selectedTune = useAtomValue(selectedTuneAtom);
  const tuneId = tune?.id || selectedTune?.id;

  const update = (updates: Partial<Tune>) => {
    updatePlaylist({
      tunes:
        playlist?.tunes.map((t) =>
          t.id === tuneId ? { ...t, ...updates } : t,
        ) || [],
    });
  };
  return { update, tune: playlist?.tunes.find((t) => t.id === tuneId) };
};

export const useUpdateTrack = (track?: Track) => {
  const { update: updateTune, tune } = useUpdateTune();

  const selectedTrack = useAtomValue(selectedTrackAtom);
  const trackId = track?.id || selectedTrack?.id;

  const update = (updates: Partial<Track>) => {
    updateTune({
      tracks: tune?.tracks.map((t) =>
        t.id === trackId ? { ...t, ...updates } : t,
      ),
    });
  };
  return { update, track: tune?.tracks.find((t) => t.id === trackId) };
};
