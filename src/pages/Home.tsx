import { useAtomValue } from "jotai";
import { Link, useLoaderData } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { deleteDocument } from "../utils/appwrite";
import { toast } from "react-hot-toast";

export default function Home() {
  const user = useAtomValue(userAtom);
  let data = useLoaderData() as {
    playlists: {
      playlist: { $id: string; name: string; author: string };
      movies: [];
    }[];
  };

  const handlePlaylistDelete = async (id: string) => {
    try {
      await deleteDocument(
        import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
        id
      );
      await Promise.all(
        data.playlists
          .find((e) => e.playlist.$id === id)!
          .movies.map(
            (movie: { tmdb_id: string; playlist_id: string; $id: string }) =>
              deleteDocument(
                import.meta.env.VITE_APPWRITE_PLAYLIST_ITEM_COLLECTION_ID,
                movie.$id
              )
          )
      );
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-evenly flex-wrap">
      {data.playlists.map((playlist) => (
        <div
          key={playlist.playlist.$id}
          className="card w-96 bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <h2 className="card-title">{playlist.playlist.name}</h2>
            <p>{playlist.movies.length} movies</p>
            <div className="card-actions justify-end">
              <Link
                to={`/playlist/${playlist.playlist.$id}`}
                className="btn btn-primary"
              >
                Details
              </Link>
              {user && user.$id === playlist.playlist.author && (
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
      ))}
    </div>
  );
}
