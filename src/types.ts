import { Timestamp } from "firebase/firestore";

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
  lastPlayedAt?: Timestamp;
  playCount: number;
  createdAt: Timestamp;
};

export type Tune = {
  id: string;
  title: string;
  createdAt: Timestamp;
  selectedTrackId?: string;
  tracks: Track[];
};

export type Playlist = {
  id: string;
  title: string;
  creatorId: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  tunes: Tune[];
};
