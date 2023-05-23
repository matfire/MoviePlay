import type { Models } from "appwrite";

export type PlaylistDocument = {
  name: string;
  author: string;
  private: boolean;
  views: number;
  description?: string;
  likes: number;
  liked_by: string[];
} & Models.Document;

export type MovieDocument = {
  tmdb_id: number;
  playlist_id: string;
} & Models.Document;

export type LoaderPlaylist = {
  playlists: {
    playlist: PlaylistDocument;
    movies: MovieDocument[];
  }[];
};
