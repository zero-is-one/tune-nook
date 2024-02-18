import { playlistAtom } from "@/atoms";
import { EditableTitle } from "@/components/EditableTitle/EditableTitle";
import { LayoutPage } from "@/components/LayoutPage/LayoutPage";
import { useUpdatePlaylistAtom } from "@/hooks/useUpdatePlaylistAtom";
import { Box, Button, Container, Group, Stack } from "@mantine/core";
import { Timestamp } from "firebase/firestore";
import { useAtom } from "jotai";
import { useState } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../BackButton/BackButton";
import { TuneCard } from "./TuneCard";

export const PagePlaylist = () => {
  useUpdatePlaylistAtom();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useAtom(playlistAtom);
  const [editableTitleMode, setEditableTitleMode] = useState<"view" | "edit">(
    "view",
  );

  if (!playlist) return "Loading playlist...";

  const isCreatingTune = false;

  return (
    <LayoutPage leftSection={<BackButton />}>
      <Group
        bg={"gray.2"}
        justify="space-between"
        p={"md"}
        align="center"
        mb={"sm"}
      >
        <Box style={{ flex: 1 }}>
          <EditableTitle
            value={playlist?.title || ""}
            onChange={async (title) => {
              setPlaylist({ title });
            }}
            onModeChange={setEditableTitleMode}
          />
        </Box>

        <Button
          my={3}
          loading={isCreatingTune}
          onClick={async () => {
            setPlaylist({
              tunes: [
                ...(playlist?.tunes || []),
                {
                  id: Math.random().toString(36).substring(7),
                  title: "New Tune",
                  tracks: [],
                  createdAt: Timestamp.now(),
                  isFavorited: false,
                },
              ],
            });
          }}
          leftSection={<MdOutlinePlaylistAdd size={24} />}
          disabled={editableTitleMode === "edit"}
        >
          New Tune
        </Button>
      </Group>
      <Container size="lg">
        <Stack>
          {(playlist?.tunes || []).map((tune) => (
            <TuneCard key={tune.id} tune={tune} />
          ))}
        </Stack>
      </Container>
    </LayoutPage>
  );
};
