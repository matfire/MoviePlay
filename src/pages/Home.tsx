import { useLoaderData } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { deleteDocument } from "../utils/appwrite";
import { LoaderPlaylist } from "../utils/types";
import PlaylistCard from "../components/PlaylistCard";
import { Helmet } from "react-helmet";

export default function Home() {
  const data = useLoaderData() as LoaderPlaylist;
  const [playlists, setPlaylists] = useState<LoaderPlaylist>(data);

  const handlePlaylistDelete = async (id: string) => {
    try {
      toast.loading("Deleting playlist...", { id: "delete" });
      await deleteDocument(
        import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
        id
      );
      await Promise.all(
        data.playlists
          .find((e) => e.playlist.$id === id)?.movies.map((movie) =>
            deleteDocument(
              import.meta.env.VITE_APPWRITE_PLAYLIST_ITEM_COLLECTION_ID,
              movie.$id
            )
          ) || []
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
      <Helmet>
        <title>Home | MoviePlay</title>
      </Helmet>
      {playlists.playlists.map((playlist) => (
        <PlaylistCard playlist={playlist} handlePlaylistDelete={handlePlaylistDelete} />
      ))}
    </div>
  );
}
