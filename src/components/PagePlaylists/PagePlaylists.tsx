import { usePlaylists } from "@/hooks/usePlaylists";
import { RoutePaths } from "@/router";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiTrash } from "react-icons/bi";
import { FaClone } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { TbPlaylistAdd } from "react-icons/tb";
import { Link } from "react-router-dom";
import { LayoutPage } from "../LayoutPage/LayoutPage";
import { NewPlaylistDrawer } from "./NewPlaylistDrawer";

export const PagePlaylists = () => {
  const {
    playlists,
    remove: removePlaylist,
    clone: clonePlaylist,
  } = usePlaylists();
  const drawerDisclosure = useDisclosure();
  return (
    <>
      <LayoutPage>
        <Container>
          <Group py={"md"} justify="space-between">
            <Title order={3}>Playlists</Title>

            <Button
              leftSection={<TbPlaylistAdd size={22} />}
              onClick={() => {
                drawerDisclosure[1].open();
              }}
            >
              New Playlist
            </Button>
          </Group>

          {playlists
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((playlist) => (
              <Paper key={playlist.id} withBorder mb="sm">
                <Group justify="space-between">
                  <Anchor
                    flex={1}
                    component={Link}
                    to={RoutePaths.Playlist.replace(":playlistId", playlist.id)}
                    p="md"
                    underline="never"
                    c={"black"}
                  >
                    <Stack gap={0} maw="calc(100% - 20px)">
                      <Text fz="sm" fw={700} truncate="end">
                        {playlist.title}
                      </Text>
                      <Text size="xs" truncate="end">
                        {playlist.tunes.length} Tunes, Created{" "}
                        {playlist.createdAt.toDate().toLocaleDateString()}
                      </Text>
                    </Stack>
                  </Anchor>

                  <Menu shadow="md" width={100} position="right">
                    <Menu.Target>
                      <Box px="md" py={"md"}>
                        <ActionIcon color="dimmed" variant="transparent">
                          <HiDotsHorizontal size={"100%"} />
                        </ActionIcon>
                      </Box>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<FaClone size={20} />}
                        onClick={() => {
                          clonePlaylist(playlist);
                        }}
                      >
                        Clone
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={<BiTrash size={20} />}
                        onClick={() => {
                          removePlaylist(playlist);
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Paper>
            ))}
        </Container>
      </LayoutPage>
      <NewPlaylistDrawer disclosure={drawerDisclosure} />
    </>
  );
};
