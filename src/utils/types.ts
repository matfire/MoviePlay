interface IPlaylistDocument {
  $id: string;
  name: string;
  author: string;
}

export interface IMovieDocument {
  $id: string;
  tmdb_id: string;
  playlist_id: string;
}

export interface ILoaderPlaylist {
  playlists: {
    playlist: IPlaylistDocument;
    movies: IMovieDocument[];
  }[];
}
