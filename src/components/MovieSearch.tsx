import { useState } from "react";
import type { Movie } from "@matfire/the_movie_wrapper/dist/types/movie";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import client from "../utils/tmdb";

type SelectMovieFunction = (movie: Movie) => void;

export default function MovieSearch({
  selectMovie,
}: {
  selectMovie: SelectMovieFunction;
}) {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { register, handleSubmit } = useForm();
  const [animationParent] = useAutoAnimate();

  const loadNextPage = async () => {
    setLoading(true)
    const res = await client.movies.search({ query: search, page: page + 1 });
    if (res.results.length === 0) return;
    setPage(page + 1)
    setResults((old) => [...old, ...res.results]);
    setLoading(false)
  }

  const searchMovies: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    setPage(1)
    const res = await client.movies.search({ query: data.search, page });
    setSearch(data.search);
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
          disabled={loading}
          type="search"
          id="movies"
          className="input flex-1 input-bordered"
          placeholder="Search for a movie"
          {...register("search")}
        />
        <button className="btn btn-secondary" type="submit" disabled={loading}>
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
        {results.length > 0 && <button className="btn btn-primary" onClick={loadNextPage}>Load More</button>}
      </div>
    </form>
  );
}
