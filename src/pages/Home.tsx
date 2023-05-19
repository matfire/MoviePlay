import { useAtomValue } from "jotai";
import { Link, useLoaderData } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { deleteDocument } from "../utils/appwrite";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { ILoaderPlaylist } from "../utils/types";

export default function Home() {
  const user = useAtomValue(userAtom);
  let data = useLoaderData() as ILoaderPlaylist;
  const [playlists, setPlaylists] = useState<ILoaderPlaylist>(data);

  const handlePlaylistDelete = async (id: string) => {
    try {
      toast.loading("Deleting playlist...", { id: "delete" });
      await deleteDocument(
        import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
        id
      );
      await Promise.all(
        data.playlists
          .find((e) => e.playlist.$id === id)!
          .movies.map((movie) =>
            deleteDocument(
              import.meta.env.VITE_APPWRITE_PLAYLIST_ITEM_COLLECTION_ID,
              movie.$id
            )
          )
      );
      setPlaylists((old) => {
        return {
          playlists: old.playlists.filter((e) => e.playlist.$id !== id),
        };
      });
      toast.success("Playlist deleted", { id: "delete" });
    } catch (error) {
      toast.error("Something went wrong", { id: "delete" });
      console.error(error);
    }
  };

  return (
    <div className="flex justify-evenly flex-wrap">
      {playlists.playlists.map((playlist) => (
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
