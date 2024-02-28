import { PageNotFound } from "@/components/PageNotFound/PageNotFound";
import { PagePlaylists } from "@/components/PagePlaylists/PagePlaylists";
import { Outlet, createBrowserRouter } from "react-router-dom";
import { PageEditTune } from "./components/PageEditTune/PageEditTune";
import { PagePlaylist } from "./components/PagePlaylist/PagePlaylist";
import { AppProvider } from "./context";

export const Route = {
  Playlists: "/",
  Playlist: "/playlists/:playlistId",
  Tune: "/playlists/:playlistId/tunes/:tuneId",
  NewTune: "/playlists/:playlistId/tunes/new",
} as const;

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppProvider>
        <Outlet />
      </AppProvider>
    ),
    children: [
      {
        element: <PagePlaylists />,
        path: Route.Playlists,
      },
      {
        element: <PagePlaylist />,
        path: Route.Playlist,
      },
      {
        element: <PageEditTune />,
        path: Route.Tune,
      },
    ],
  },
  {
    element: <PageNotFound />,
    path: "*",
  },
]);
