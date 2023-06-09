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
  account,
  getDocument,
  getDocuments,
  updateStatistic,
} from "./utils/appwrite.ts";
import { Query } from "appwrite";
import client from "./utils/tmdb.ts";
import Logout from "./pages/Logout.tsx";
import AuthCallback from "./pages/AuthCallback.tsx";
import { MovieDocument, PlaylistDocument } from "./utils/types.ts";
import Search from "./pages/Search.tsx";
import Profile from "./pages/Profile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async () => {
      try {
        const user = await account.get();
        return {user}
      } catch (error) {
        return null
      }
    },
    children: [
      {
        path: "/",
        element: <Home />,
        loader: async () => {
          const playlists = await getDocuments<PlaylistDocument>(
            import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
            [Query.orderDesc("likes")]
          );
          const data = await Promise.all(
            playlists.documents.map(async (playlist) => {
              const moviesDocuments = await getDocuments<MovieDocument>(
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
        path: "/profile",
        loader: async () => {
          try {
            await account.get();
            const playlists = await getDocuments<PlaylistDocument>(
              import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
              [Query.orderDesc("likes")]
            );
            const data = await Promise.all(
              playlists.documents.map(async (playlist) => {
                const moviesDocuments = await getDocuments<MovieDocument>(
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
          } catch (error) {
            return redirect(
              "/?error=You need to be logged in to view your profile"
            );
          }
        },
        element: <Profile />,
      },
      {
        path: "/playlist/new",
        loader: async () => {
          try {
            await account.get();
            return {};
          } catch (error) {
            return redirect(
              "/?error=You need to be logged in to create a playlist"
            );
          }
        },
        element: <NewPlaylist />,
      },
      {
        path: "/playlist/:id",
        element: <PlaylistDetails />,
        loader: async ({ params, request }) => {
          const { id } = params;
          if (!id) return redirect("/?error=Invalid Id");
          try {
            const url = new URL(request.url);
            if (!url.searchParams.has("fetcher")) {
              await updateStatistic(id);
            }
            const playlist = await getDocument<PlaylistDocument>(
              import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
              id
            );
            const moviesDocuments = await getDocuments<MovieDocument>(
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
      {
        path: "/search",
        element: <Search />,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get("query");
          if (!query) return redirect("/?error=Invalid search argument");
          const playlists = await getDocuments<PlaylistDocument>(
            import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
            [Query.search("searchable_field", query), Query.orderDesc("likes")]
          );
          const data = await Promise.all(
            playlists.documents.map(async (playlist) => {
              const moviesDocuments = await getDocuments<MovieDocument>(
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
