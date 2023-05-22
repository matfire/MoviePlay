import type { Models } from "appwrite";

export type PlaylistDocument = {
  name: string;
  author: string;
  private: boolean;
  views: number;
  description?: string;
} & Models.Document;

export type MovieDocument = {
  tmdb_id: string;
  playlist_id: string;
} & Models.Document;

export type LoaderPlaylist = {
  playlists: {
    playlist: PlaylistDocument;
    movies: MovieDocument[];
  }[];
};
