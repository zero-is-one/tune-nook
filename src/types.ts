import { FieldValue, Timestamp } from "firebase/firestore";

export type Song = {
  title: string;
  url: string;
  author: string;
};

export type Track = {
  id: string;
  song: Song;
  startTime: number;
  playbackRate: number;
  lastPlayedAt?: Date;
  playCount: number;
  createdAt: Date;
};

export type Tune = {
  id: string;
  name: string;
  createdAt: Date;
  selectedTrackId?: string;
  isFavorited: boolean;
  tracks: Track[];
};

export type Playlist = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Timestamp | FieldValue;
  tunes: Tune[];
};
