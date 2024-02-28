import { ReactNode, createContext, useContext } from "react";
import { usePlaylist } from "./hooks/usePlaylist";
import { usePlaylists } from "./hooks/usePlaylists";
import { useTunes } from "./hooks/useTunes";

interface ContextValue {
  playlists: ReturnType<typeof usePlaylists>;
  playlist: ReturnType<typeof usePlaylist>;
  tunes: ReturnType<typeof useTunes>;
}

const Context = createContext<ContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const playlists = usePlaylists();
  const playlist = usePlaylist();
  const tunes = useTunes();

  return (
    <Context.Provider value={{ playlists, playlist, tunes }}>
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => {
  const value = useContext(Context);
  if (value === null) {
    throw new Error("useAppContext must be used within a Provider");
  }
  return value;
};
