import { useAtomValue } from "jotai";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import userAtom from "../atoms/userAtom";
import MovieSearch from "../components/MovieSearch";
import { Movie } from "@matfire/the_movie_wrapper/dist/types/movie";
import { useState } from "react";
import { createDocument } from "../utils/appwrite";
import { Permission, Role } from "appwrite";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useNavigate } from "react-router-dom";

export default function NewPlaylist() {
  const { register, handleSubmit } = useForm();
  const [animationParent] = useAutoAnimate();
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const createPlaylist: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    const permissions = [
      Permission.delete(Role.user(user!.$id)),
      Permission.update(Role.user(user!.$id)),
    ];
    if (data.private) {
      permissions.push(Permission.read(Role.user(user!.$id)));
    } else {
      permissions.push(Permission.read(Role.any()));
    }
    const playlist = await createDocument(
      import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
      {
        name: data.name,
        private: data.private,
        author: user?.$id,
      },
      permissions
    );
    console.log(playlist);
    await Promise.all(
      movieOrder.map(async (movie) => {
        return await createDocument(
          import.meta.env.VITE_APPWRITE_PLAYLIST_ITEM_COLLECTION_ID,
          {
            playlist_id: playlist.$id,
            tmdb_id: movie.id,
            order: movie.order,
          },
          permissions
        );
      })
    );
    navigate(`/playlist/${playlist.$id}`);
  };
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieOrder, setMovieOrder] = useState<{ id: number; order: number }[]>(
    []
  );
  const selectMovie = (movie: Movie) => {
    setMovies([...movies, movie]);
    setMovieOrder([...movieOrder, { id: movie.id, order: movieOrder.length }]);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(createPlaylist)}>
        <div className="form-control">
          <label htmlFor="name" className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            placeholder="playlist title here"
            type="text"
            className="input"
            {...register("name", { required: true })}
          />
        </div>
        <div className="form-control">
          <label htmlFor="private" className="label cursor-pointer">
            <span className="label-text">Keep Playlist Private</span>
            <input
              type="checkbox"
              className="checkbox"
              {...register("private")}
            />
          </label>
        </div>
        <button className="btn btn-primary" type="submit">
          Create
        </button>
      </form>
      <div className="border border-black" ref={animationParent}>
        {movies.map((movie, idx) => (
          <div className="flex" key={`selected_movie_${movie.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-1/4"
            />
            <div className="flex flex-col justify-between w-full">
              <h2 className="font-bold">{movie.title}</h2>
              <p>{movie.overview}</p>
              <button
                className="btn btn-error"
                onClick={() => {
                  setMovies(movies.filter((_, index) => index !== idx));
                  setMovieOrder(movieOrder.filter((_, index) => index !== idx));
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <MovieSearch selectMovie={selectMovie} />
    </div>
  );
}
