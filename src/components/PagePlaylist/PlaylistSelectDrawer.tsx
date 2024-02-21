import { playlistsAtom, tuneCloneToAtom, tuneMoveToAtom } from "@/atoms";
import { Playlist } from "@/types";
import { Button, Drawer, Select, Stack } from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";

export const PlaylistSelectDrawer = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<
    Playlist | undefined
  >();
  const [tuneCloneTo, setCloneTo] = useAtom(tuneCloneToAtom);
  const [tuneMoveTo, setMoveTo] = useAtom(tuneMoveToAtom);
  const [playlists, setPlaylists] = useAtom(playlistsAtom);

  const onSelected = () => {
    if (tuneCloneTo) {
      const newTune = { ...tuneCloneTo, id: Math.random().toString() };
      const newPlaylists = playlists.map((p) => {
        if (p.id === selectedPlaylist?.id) {
          return { ...p, tunes: [...p.tunes, newTune] };
        }
        return p;
      });
      setPlaylists(newPlaylists);
    } else if (tuneMoveTo) {
      const newPlaylists = playlists.map((p) => {
        if (p.id === selectedPlaylist?.id) {
          return { ...p, tunes: [...p.tunes, tuneMoveTo] };
        }
        return { ...p, tunes: p.tunes.filter((t) => t.id !== tuneMoveTo.id) };
      });
      setPlaylists(newPlaylists);
    }

    setCloneTo(undefined);
    setMoveTo(undefined);
  };

  return (
    <Drawer
      opened={!!(tuneCloneTo || tuneMoveTo)}
      onClose={() => {
        setCloneTo(undefined);
        setMoveTo(undefined);
      }}
      position="bottom"
      title={"Select Playlist"}
      offset={8}
      radius={8}
      size={240}
    >
      <Stack>
        <Select
          value={selectedPlaylist?.id}
          onChange={(value) => {
            setSelectedPlaylist(playlists.find((p) => p.id === value));
          }}
          size="lg"
          label="Playlists"
          placeholder="Pick a playlist"
          data={playlists.map((p) => ({ value: p.id, label: p.title }))}
        />
        <Button onClick={onSelected} size="lg">
          {tuneCloneTo ? "Clone" : "Move"} to Playlist
        </Button>
      </Stack>
    </Drawer>
  );
};
