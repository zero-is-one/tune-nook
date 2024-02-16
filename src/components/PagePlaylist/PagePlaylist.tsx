import { usePlaylist, useUpdatePlaylist } from "@/hooks/usePlaylist";
import { useCreateTune } from "@/hooks/useTunes";
import { RoutePaths } from "@/router";
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdEdit, MdOutlinePlaylistAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { LayoutPage } from "../LayoutPage/LayoutPage";

export const PagePlaylist = () => {
  const { playlist, loading, error } = usePlaylist();
  const [updatePlaylist, isUpdatingPlaylist] = useUpdatePlaylist();
  const [createTune, isCreatingTune] = useCreateTune();
  //const [createTune, creating] = useCreateTune();
  const [playlistEditName, setPlaylistEditName] = useState<undefined | string>(
    undefined,
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
        {playlistEditName === undefined && (
          <Group align="center" gap={"xs"} w="calc(100% - 150px)">
            <Text size={"md"} maw="calc(100% - 38px)" truncate="end">
              {playlist.name}
            </Text>
            <ActionIcon
              c={"dimmed"}
              variant="transparent"
              aria-label="Edit Name"
              onClick={() => {
                setPlaylistEditName(playlist.name);
              }}
            >
              <MdEdit size={24} />
            </ActionIcon>
          </Group>
        )}
        {playlistEditName !== undefined && (
          <TextInput
            size="md"
            placeholder="Playlist Name"
            value={playlistEditName}
            onChange={(event) => setPlaylistEditName(event.currentTarget.value)}
            w="calc(100% - 150px)"
            rightSection={
              <ActionIcon
                aria-label="Edit Name"
                onClick={async (event) => {
                  await updatePlaylist({ name: playlistEditName });
                  setPlaylistEditName(undefined);
                }}
                color="green"
                loading={isUpdatingPlaylist}
              >
                <FaCheck size={14} />
              </ActionIcon>
            }
          />
        )}

        <Button
          my={3}
          loading={isCreatingTune}
          onClick={() => {
            createTune();
          }}
          leftSection={<MdOutlinePlaylistAdd size={24} />}
          disabled={playlistEditName !== undefined}
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
