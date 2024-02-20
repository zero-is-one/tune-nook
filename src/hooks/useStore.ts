import {
  playlistsAtom,
  selectedPlaylistAtom,
  selectedTrackAtom,
  selectedTuneAtom,
} from "@/atoms";
import { Playlist, Track, Tune } from "@/types";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const useUpdatePlaylist = () => {
  const { playlistId } = useParams();
  const [playlists, setPlaylists] = useAtom(playlistsAtom);
  const [selectedPlaylist, setSelectedPlaylist] = useAtom(selectedPlaylistAtom);
  const playlist = playlists.find((p) => p.id === playlistId);

  useEffect(() => {
    setSelectedPlaylist(playlist);
  }, [playlist, setSelectedPlaylist]);

  if (!playlistId) throw new Error("No playlist id found.");

  const update = (updates: Partial<Playlist>) => {
    setPlaylists(
      playlists.map((p) =>
        p.id === selectedPlaylist?.id ? { ...p, ...updates } : p,
      ),
    );
  };

  return { update, playlist };
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
