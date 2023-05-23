import { useFetcher, useLoaderData } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Movie } from "@matfire/the_movie_wrapper/dist/types/movie";
import { PlaylistDocument } from "../utils/types";
import { useAtomValue } from "jotai";
import userAtom from "../atoms/userAtom";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { updateDocument } from "../utils/appwrite";

export default function PlaylistDetails() {
  const loaderData = useLoaderData() as {
    playlist: PlaylistDocument;
    movies: Movie[];
  };
  const [data, setData] = useState<{
    playlist: PlaylistDocument;
    movies: Movie[];
  }>(loaderData);
  const fetcher = useFetcher();
  const user = useAtomValue(userAtom);
  const liked = data.playlist.liked_by.includes(user?.$id || "");
  const [loading, setLoading] = useState(false);
  const handleLike = async () => {
    if (!user) return;
    setLoading(true);
    if (liked) {
      await updateDocument(
        import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
        data.playlist.$id,
        {
          liked_by: data.playlist.liked_by.filter((id) => id !== user.$id),
          likes: data.playlist.likes - 1,
        }
      );
    } else {
      await updateDocument(
        import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
        data.playlist.$id,
        {
          liked_by: [...data.playlist.liked_by, user.$id],
          likes: data.playlist.likes + 1,
        }
      );
    }
    fetcher.load(`/playlist/${data.playlist.$id}?fetcher`);
    setLoading(false);
  };

  useEffect(() => {
    if (fetcher.data) {
      setData(fetcher.data)
    }
  }, [fetcher.data])

  return (
    <div>
      <Helmet>
        <title>{data.playlist.name} | Movie List</title>
        <meta property="og:title" content={data.playlist.name} />
        <meta property="og:description" content="Movie List" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h2 className="font-bold text-2xl">{data.playlist.name}</h2>
          {user && (
            <button onClick={handleLike} disabled={loading}>
              <Icon
                icon={liked ? "mdi:heart" : "mdi:heart-outline"}
                className="text-2xl"
              />
            </button>
          )}
        </div>
        <div className="flex flex-col">
          <p>{data.movies.length} movies</p>
          <p>{data.playlist.views} view{data.playlist.views > 1 ? "s" : ""}</p>
          <p>{data.playlist.likes} like{data.playlist.likes > 1 ? "s" : ""}</p>
        </div>
      </div>
      <div>
        <p>{data.playlist.description}</p>
      </div>
      <div className="flex flex-col mt-4 space-y-4">
        {data.movies.map((movie: Movie) => (
          <div key={movie.id} className="flex flex-col md:flex-row gap-2">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="w-full md:w-1/4"
              alt={movie.title}
            />
            <div className="flex flex-col w-full">
              <h3 className="font-semibold text-xl">{movie.title}</h3>
              <p>{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
