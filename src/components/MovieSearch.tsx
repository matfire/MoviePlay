import { useState } from "react";
import type { Movie } from "@matfire/the_movie_wrapper/dist/types/movie";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import client from "../utils/tmdb";

export default function MovieSearch({
  selectMovie,
}: {
  selectMovie: Function;
}) {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();
  const [animationParent] = useAutoAnimate();

  const searchMovies: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    const res = await client.movies.search({ query: data.search });
    setResults(res.results);
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit(searchMovies)}>
      <div className="flex">
        <label htmlFor="movies" className="label">
          <span className="label-text">Search</span>
        </label>
        <input
          type="search"
          id="movies"
          className="input flex-1"
          placeholder="Search for a movie"
          {...register("search")}
        />
        <button className="btn btn-secondary" type="submit">
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4"
        ref={animationParent}
      >
        {results.map((movie) => (
          <div
            key={movie.id}
            className="relative bg-cover bg-center bg-no-repeat h-96 group"
            style={{
              backgroundImage: movie.poster_path
                ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`
                : "none",
            }}
          >
            <div className="absolute inset-0 bg-base-100/80 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <h2 className="font-bold">
                {movie.title} ({new Date(movie.release_date).getFullYear()})
              </h2>
              <p>{movie.overview?.slice(undefined, 150)}...</p>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => selectMovie(movie)}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
