import { FieldValue, Timestamp } from "firebase/firestore";

export type Song = {
  id: string;
  name: string;
  startTime: number;
  playbackSpeed: number;
};

export type Tune = {
  id: string;
  name: string;
  createdAt: Date;
  lastPlayedAt: Date | undefined;
  selectedSongId: string | undefined;
  songs: Song[];
};

export type Playlist = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Timestamp | FieldValue;
  tunes: Tune[];
};
