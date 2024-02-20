import { atom } from "jotai";
import { Playlist, Track, Tune } from "./types";

export const playlistsAtom = atom<Playlist[]>([]);
//export const selectedPlaylistAtom = atom<Playlist | undefined>(undefined);
export const selectedTuneAtom = atom<Tune | undefined>(undefined);
export const selectedTrackAtom = atom<Track | undefined>((get) => {
  const selectedTune = get(selectedTuneAtom);
  return (
    selectedTune?.tracks.find((t) => t.id === selectedTune?.selectedTrackId) ||
    selectedTune?.tracks[0]
  );
});
