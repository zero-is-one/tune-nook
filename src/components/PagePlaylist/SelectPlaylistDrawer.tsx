import { usePlaylists } from "@/hooks/usePlaylists";
import { Playlist, Tune } from "@/types";
import { Button, Drawer, Select, Stack } from "@mantine/core";
import { useState } from "react";

export type Context =
  | {
      action: "clone" | "move" | undefined;
      tune: Tune;
    }
  | undefined;

export const SelectPlaylistDrawer = ({
  context,
  onSelect,
  label,
}: {
  context: Context;
  onSelect: (playlist: Playlist | undefined, context: Context) => void;
  label: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [playlists] = usePlaylists();
  const [selectedPlaylist, setSelectedPlaylist] = useState<
    Playlist | undefined
  >();

  return (
    <Drawer
      opened={!!context}
      onClose={() => {}}
      position="bottom"
      title={"Select Playlist"}
      offset={8}
      radius={8}
      size={240}
    >
      {playlists && (
        <Stack>
          <Select
            value={selectedPlaylist?.id}
            onChange={async (value) => {
              setSelectedPlaylist(playlists.find((p) => p.id === value)!);
            }}
            size="lg"
            label="Playlists"
            data={playlists.map((p) => ({ value: p.id, label: p.title }))}
          />
          <Button
            onClick={async () => {
              setLoading(true);
              await onSelect(selectedPlaylist, context);
              setSelectedPlaylist(undefined);
              setLoading(false);
            }}
            size="lg"
            loading={loading}
          >
            {label}
          </Button>
        </Stack>
      )}
    </Drawer>
  );
};
