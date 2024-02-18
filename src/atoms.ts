import { atom } from "jotai";
import { Playlist } from "./types";

export const playlistsAtom = atom<Playlist[]>([]);

export const playlistIdAtom = atom<string | null>(null);
export const playlistAtom = atom<Playlist | null, [Partial<Playlist>], void>(
  (get) => {
    const playlists = get(playlistsAtom);
    const playlistId = get(playlistIdAtom);
    return playlists.find((p) => p.id === playlistId) || null;
  },
  (get, set, updatedPlaylist) => {
    const playlists = [...get(playlistsAtom)];
    const playlistId = get(playlistIdAtom);
    const index = playlists.findIndex((p) => p.id === playlistId);

    playlists[index] = { ...playlists[index], ...updatedPlaylist };
    set(playlistsAtom, playlists);
  },
);
