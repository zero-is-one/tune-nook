import { playlistIdAtom } from "@/atoms";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const useUpdatePlaylistAtom = () => {
  const params = useParams();
  const setPlaylistId = useSetAtom(playlistIdAtom);

  useEffect(() => {
    setPlaylistId(params.playlistId || null);
  }, [params, setPlaylistId]);
};
