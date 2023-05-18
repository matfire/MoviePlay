import Client from "@matfire/the_movie_wrapper";
const client = new Client(import.meta.env.VITE_TMDB_KEY);

export default client;
