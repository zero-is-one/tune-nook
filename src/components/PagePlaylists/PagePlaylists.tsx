import {
  clone as clonePlaylist,
  create as createPlaylist,
  remove as removePlaylist,
  usePlaylists,
} from "@/hooks/usePlaylists";
import { RoutePaths } from "@/router";
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Menu,
  Text,
  Title,
} from "@mantine/core";
import { BiTrash } from "react-icons/bi";
import { FaClone } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
import { LayoutPage } from "../LayoutPage/LayoutPage";
import { RequireAuth } from "../RequireAuth/RequireAuth";

export const PagePlaylists = () => {
  const { playlists, loading, error } = usePlaylists();

  if (loading) return <div>Loading Playlists...</div>;
  if (error) return <div>Error Loading Playlists: {error.message}</div>;

  return (
    <RequireAuth>
      <LayoutPage bg="gray.1">
        <Container>
          <Group py={"md"}>
            <Title order={2}>Playlists</Title>

            <Button
              onClick={() => {
                createPlaylist();
              }}
            >
              Create Playlist
            </Button>
          </Group>

          {playlists
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((playlist) => (
              <Card key={playlist.id} withBorder mb="sm">
                <Group justify="space-between">
                  <Text
                    flex={1}
                    component={Link}
                    to={RoutePaths.Playlist.replace(":playlistId", playlist.id)}
                  >
                    {playlist.name} - {playlist.id}
                  </Text>

                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <Box>
                        <HiDotsHorizontal size={20} />
                      </Box>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<FaClone size={20} />}
                        onClick={() => {
                          clonePlaylist(playlist.id);
                        }}
                      >
                        Clone
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={<BiTrash size={20} />}
                        onClick={() => {
                          removePlaylist(playlist.id);
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card>
            ))}
        </Container>
      </LayoutPage>
    </RequireAuth>
  );
};
