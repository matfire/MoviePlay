import { Movie } from "@matfire/the_movie_wrapper/dist/types/movie";
import { useLoaderData } from "react-router-dom";

export default function PlaylistDetails() {
  const data = useLoaderData() as {
    playlist: { name: string };
    movies: Movie[];
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">{data.playlist.name}</h2>
        <p>{data.movies.length} movies</p>
      </div>
      <div className="flex flex-col mt-4 space-y-4">
        {data.movies.map((movie: Movie) => (
          <div key={movie.id} className="flex flex-col md:flex-row gap-2">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="w-full md:w-1/4"
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
