import { useParams } from "react-router-dom";
import { usePlaylist } from "./usePlaylist";

export const useTune = () => {
  const { playlist, loading, error } = usePlaylist();
  const { tuneId } = useParams();
  const tune = playlist?.tunes?.find((tune) => tune.id === tuneId);

  return { tune, loading, error };
};
