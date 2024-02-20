import { atom } from "jotai";
import { Playlist, Tune } from "./types";

export const playlistsAtom = atom<Playlist[]>([]);
export const selectedPlaylistIdAtom = atom<string | undefined>(undefined);
export const selectedPlaylistAtom = atom(
  (get) => {
    const playlists = get(playlistsAtom);
    const selectedPlaylistId = get(selectedPlaylistIdAtom);
    return playlists.find((p) => p.id === selectedPlaylistId);
  },
  (_get, set, playlist: Playlist | undefined) => {
    set(selectedPlaylistIdAtom, playlist?.id);
  },
);

const selectedTuneIdAtom = atom<string | undefined>(undefined);
export const selectedTuneAtom = atom(
  (get) => {
    const playlist = get(selectedPlaylistAtom);
    const selectedTuneId = get(selectedTuneIdAtom);
    return playlist?.tunes.find((t) => t.id === selectedTuneId);
  },
  (_get, set, tune: Tune | undefined) => {
    set(selectedTuneIdAtom, tune?.id);
  },
);

export const selectedTrackAtom = atom((get) => {
  const selectedTune = get(selectedTuneAtom);
  return (
    selectedTune?.tracks.find((t) => t.id === selectedTune?.selectedTrackId) ||
    selectedTune?.tracks[0]
  );
});

// atom<Track | undefined>((get) => {
//   const selectedTune = get(selectedTuneAtom);
//   return (
//     selectedTune?.tracks.find((t) => t.id === selectedTune?.selectedTrackId) ||
//     selectedTune?.tracks[0]
//   );
// });
