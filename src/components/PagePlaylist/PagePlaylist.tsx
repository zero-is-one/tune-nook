import { selectedTuneAtom } from "@/atoms";
import { EditableTitle } from "@/components/EditableTitle/EditableTitle";
import { LayoutPage } from "@/components/LayoutPage/LayoutPage";

import { useUpdatePlaylist } from "@/hooks/useStore";
import { ActionIcon, Box, Container, Group, Stack, Text } from "@mantine/core";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { BackButton } from "../BackButton/BackButton";
import { Player } from "./Player";
import { PlaylistSelectDrawer } from "./PlaylistSelectDrawer";
import { TuneCard } from "./TuneCard";

export const PagePlaylist = () => {
  const setSelctedTune = useSetAtom(selectedTuneAtom);
  const { update: updatePlaylist, playlist: selectedPlaylist } =
    useUpdatePlaylist();

  useEffect(() => {
    setSelctedTune(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!selectedPlaylist) return "Loading Playlist...";

  return (
    <LayoutPage
      leftSection={<BackButton path="/" />}
      centerSection={
        <Group w="calc(100vw - 200px)" align="center" justify="center">
          <EditableTitle
            value={selectedPlaylist?.title || ""}
            onChange={async (title) => {
              updatePlaylist({ title });
            }}
          />
        </Group>
      }
      rightSection={
        <ActionIcon size={"lg"} component={Link} to={`tunes/new`}>
          <MdOutlinePlaylistAdd size={"60%"} />
        </ActionIcon>
      }
    >
      <Stack h={"100%"} gap={0} style={{ overflow: "hidden" }}>
        <Box flex={1} style={{ overflow: "auto" }}>
          <Container py="md">
            <Stack>
              {selectedPlaylist.tunes.map((tune) => (
                <TuneCard key={tune.id} tune={tune} />
              ))}

              {selectedPlaylist.tunes.length === 0 && (
                <Text fw={"bold"} py="md" px="xl" ta={"right"}>
                  Add a tune
                  <FaArrowTrendUp
                    size={40}
                    style={{
                      position: "relative",
                      top: -5,
                      left: 5,
                      transform: "rotate(-15deg)",
                    }}
                  />
                </Text>
              )}
            </Stack>
          </Container>
        </Box>
        <Player playlist={selectedPlaylist} />
      </Stack>
      <PlaylistSelectDrawer />
    </LayoutPage>
  );
};
