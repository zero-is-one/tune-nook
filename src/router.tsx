import { PageEditTune } from "@/components/PageEditTune/PageEditTune";
import { PagePlaylist } from "@/components/PagePlaylist/PagePlaylist";
import { PagePlaylists } from "@/components/PagePlaylists/PagePlaylists";
import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth/RequireAuth";

export const RoutePaths = {
  Home: "/",
  Playlist: "/playlists/:playlistId",
  Tune: "/playlists/:playlistId/tunes/:tuneId",
} as const;

export const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    path: "/",
    children: [
      {
        path: RoutePaths.Home,
        element: <PagePlaylists />,
      },
      {
        path: RoutePaths.Playlist,
        element: <PagePlaylist />,
      },
      {
        path: RoutePaths.Tune,
        element: <PageEditTune />,
      },
      {
        path: "*",
        element: <div>Page Not Found</div>,
      },
    ],
  },
]);
