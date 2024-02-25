import { Header } from "@/components/Header/Header";
import { LayoutFullScreen } from "@/components/LayoutFullScreen/LayoutFullScreen";
import { RequireAuth } from "@/components/RequireAuth/RequireAuth";
import { auth } from "@/firebase";
import { usePlaylists, useRemovePlaylist } from "@/hooks/usePlaylists";
import { Route } from "@/router";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSignOut } from "react-firebase-hooks/auth";
import { BiTrash } from "react-icons/bi";
import { FaSignOutAlt } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ActionCard } from "../ActionCard/ActionCard";
import { CreateNewPlaylistDrawer } from "./CreateNewPlaylistDrawer";

export const PagePlaylists = () => {
  const navigate = useNavigate();
  const [signOut] = useSignOut(auth);
  const [playlists, loading, error] = usePlaylists();
  const [remove] = useRemovePlaylist();
  const creatNewPlaylistDrawerDisclosure = useDisclosure();

  if (error) return <div>Error Loading Playlists: {error.message}</div>;

  return (
    <RequireAuth>
      <LayoutFullScreen
        header={
          <Header
            rightSection={
              <Button
                onClick={() => {
                  creatNewPlaylistDrawerDisclosure[1].open();
                }}
              >
                New Playlist
              </Button>
            }
          />
        }
      >
        <Container
          pt={"lg"}
          h={"100%"}
          display={"flex"}
          style={{ flexDirection: "column" }}
        >
          <Stack gap={"xs"} flex={1}>
            {loading && <Text>Loading Playlists...</Text>}
            {playlists?.map((playlist) => (
              <ActionCard
                title={playlist.title}
                subtitle={`Created ${playlist.createdAt.toDate().toLocaleDateString()}`}
                key={playlist.id}
                onClick={() => {
                  navigate(Route.Playlist.replace(":playlistId", playlist.id));
                }}
                rightSection={
                  <Menu shadow="md" width={100} position="right">
                    <Menu.Target>
                      <ActionIcon
                        size={"md"}
                        color="black"
                        variant="transparent"
                      >
                        <HiDotsHorizontal size={"100%"} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        color="red"
                        leftSection={<BiTrash size={20} />}
                        onClick={() => {
                          remove(playlist);
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                }
              ></ActionCard>
            ))}
          </Stack>
          <Box py="lg">
            <ActionIcon variant="light" onClick={() => signOut()}>
              <FaSignOutAlt />
            </ActionIcon>
          </Box>
        </Container>
      </LayoutFullScreen>
      <CreateNewPlaylistDrawer disclosure={creatNewPlaylistDrawerDisclosure} />
    </RequireAuth>
  );
};
