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
};

export type Tune = {
  id: string;
  creatorId: string;
  playlistId: string;
  title: string;
  selectedTrackId: string;
  tracks: Track[];
  playCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastPlayedAt: Timestamp | null;
};

export type Playlist = {
  id: string;
  title: string;
  creatorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
};
