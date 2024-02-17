import { EditableTitle } from "@/components/EditableTitle/EditableTitle";
import { LayoutPage } from "@/components/LayoutPage/LayoutPage";
import { usePlaylist, useUpdatePlaylist } from "@/hooks/usePlaylist";
import { useAddTune } from "@/hooks/useTunes";
import { RoutePaths } from "@/router";
import { Box, Button, Container, Group, Stack } from "@mantine/core";
import { useState } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

export const PagePlaylist = () => {
  const navigate = useNavigate();
  const { playlist, loading, error } = usePlaylist();
  const [updatePlaylist] = useUpdatePlaylist();
  const [addTune, isCreatingTune] = useAddTune();
  const [editableTitleMode, setEditableTitleMode] = useState<"view" | "edit">(
    "view",
  );

  if (loading) return <LayoutPage>Loading...</LayoutPage>;
  if (error) return <LayoutPage>Error: {error.message}</LayoutPage>;
  if (!playlist) return <LayoutPage>No Playlist Found</LayoutPage>;

  return (
    <LayoutPage>
      <Group
        bg={"gray.2"}
        justify="space-between"
        p={"md"}
        align="center"
        mb={"sm"}
      >
        <Box style={{ flex: 1 }}>
          <EditableTitle
            value={playlist.name}
            onChange={async (name) => {
              await updatePlaylist({ name });
            }}
            onModeChange={setEditableTitleMode}
          />
        </Box>

        <Button
          my={3}
          loading={isCreatingTune}
          onClick={async () => {
            const tune = await addTune();
            navigate(`tunes/${tune?.id}`);
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
            <Button
              variant="outline"
              component={Link}
              to={RoutePaths.Tune.replace(":tuneId", tune.id).replace(
                ":playlistId",
                playlist?.id,
              )}
              key={tune.id}
            >
              {tune.name}
            </Button>
          ))}
        </Stack>
      </Container>
    </LayoutPage>
  );
};
