import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import NewPlaylist from "./pages/NewPlaylist.tsx";
import PlaylistDetails from "./pages/PlaylistDetails.tsx";
import { getDocument, getDocuments } from "./utils/appwrite.ts";
import { Query } from "appwrite";
import client from "./utils/tmdb.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: async () => {
          const playlists = await getDocuments(
            import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID
          );
          const data = await Promise.all(
            playlists.documents.map(async (playlist) => {
              const moviesDocuments = await getDocuments(
                import.meta.env.VITE_APPWRITE_PLAYLIST_ITEM_COLLECTION_ID,
                [Query.equal("playlist_id", playlist.$id)]
              );
              return {
                playlist,
                movies: moviesDocuments.documents,
              };
            })
          );
          return {
            playlists: data,
          };
        },
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/playlist/new",
        element: <NewPlaylist />,
      },
      {
        path: "/playlist/:id",
        element: <PlaylistDetails />,
        loader: async ({ params, request }) => {
          const { id } = params;
          try {
            const playlist = await getDocument(
              import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
              id
            );
            const moviesDocuments = await getDocuments(
              import.meta.env.VITE_APPWRITE_PLAYLIST_ITEM_COLLECTION_ID,
              [
                Query.equal("playlist_id", playlist.$id),
                Query.orderAsc("order"),
              ]
            );
            const movies = await Promise.all(
              moviesDocuments.documents.map(async (movie) => {
                const res = await client.movies.getMovie(movie.tmdb_id);
                return res;
              })
            );
            return {
              playlist,
              movies,
            };
          } catch (error) {
            return redirect("/?error=Playlist not found");
          }
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
