import { useAtomValue } from "jotai";
import { MovieDocument, PlaylistDocument } from "../utils/types";
import userAtom from "../atoms/userAtom";
import { Link } from "react-router-dom";


export default function PlaylistCard({playlist, handlePlaylistDelete}: {playlist: {playlist: PlaylistDocument, movies: MovieDocument[]}, handlePlaylistDelete?: (id:string) => void}) {
    const user = useAtomValue(userAtom);
    return (
        <div
        key={playlist.playlist.$id}
        className="card w-96 bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="card-title">{playlist.playlist.name}</h2>
          <p>{playlist.movies.length} movies</p>
          <p>{playlist.playlist.likes} like{playlist.playlist.likes > 1 ? "s" : ""}</p>
          <div className="card-actions justify-end">
            <Link
              to={`/playlist/${playlist.playlist.$id}`}
              className="btn btn-primary"
            >
              Details
            </Link>
            {user && user.$id === playlist.playlist.author && handlePlaylistDelete && (
              <button
                className="btn btn-error"
                onClick={() => handlePlaylistDelete(playlist.playlist.$id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    )
}