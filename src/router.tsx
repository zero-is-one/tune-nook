import { PagePlaylist } from "@/components/PagePlaylist/PagePlaylist";
import { PagePlaylists } from "@/components/PagePlaylists/PagePlaylists";
import { PageTune } from "@/components/PageTune/PageTune";
import { createBrowserRouter } from "react-router-dom";

export const RoutePaths = {
  Home: "/",
  Playlist: "/playlists/:playlistId",
  Tune: "/playlists/:playlistId/tunes/:tuneId",
} as const;

export const router = createBrowserRouter([
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
    element: <PageTune />,
  },
  {
    path: "/*",
    element: <div>Page Not Found</div>,
  },
]);
