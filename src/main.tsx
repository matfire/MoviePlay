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
import {
  getDocument,
  getDocuments,
  updateStatistic,
} from "./utils/appwrite.ts";
import { Query } from "appwrite";
import client from "./utils/tmdb.ts";
import Logout from "./pages/Logout.tsx";
import AuthCallback from "./pages/AuthCallback.tsx";

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
            import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
            []
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
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/auth/callback",
        element: <AuthCallback />,
      },
      {
        path: "/playlist/new",
        element: <NewPlaylist />,
      },
      {
        path: "/playlist/:id",
        element: <PlaylistDetails />,
        loader: async ({ params }) => {
          const { id } = params;
          if (!id) return redirect("/?error=Invalid Id");
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
            await updateStatistic(id);
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
