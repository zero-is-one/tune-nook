import { selectedTuneAtom, tuneCloneToAtom, tuneMoveToAtom } from "@/atoms";
import { useUpdatePlaylist } from "@/hooks/useStore";
import { RoutePaths } from "@/router";
import { Tune } from "@/types";
import { ActionIcon, Group, Menu, Paper, Stack, Text } from "@mantine/core";
import { useAtom, useSetAtom } from "jotai";
import { BiTrash } from "react-icons/bi";
import { FaRegClone } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoEnterOutline } from "react-icons/io5";
import { PiPencilBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export const TuneCard = ({ tune }: { tune: Tune }) => {
  const navigate = useNavigate();
  const { update: updatedPlaylist, playlist } = useUpdatePlaylist();
  const [selectedTune, setSelectedTune] = useAtom(selectedTuneAtom);
  const setCloneTo = useSetAtom(tuneCloneToAtom);
  const setMoveTo = useSetAtom(tuneMoveToAtom);
  const track =
    tune.tracks.find((t) => t.id === tune.selectedTrackId) || tune.tracks[0];
  const lastPlayedAt = track?.lastPlayedAt?.toDate();
  const daysSinceLastPlayed = lastPlayedAt
    ? Math.floor(
        (new Date().getTime() - lastPlayedAt.getTime()) / (1000 * 60 * 60 * 24),
      )
    : 0;

  return (
    <Paper
      withBorder
      key={tune.id}
      bg={selectedTune?.id === tune.id ? "green.1" : "white"}
      style={{
        boxShadow:
          selectedTune?.id === tune.id
            ? "0 0 0 2px var(--mantine-color-green-5)"
            : "none",
      }}
    >
      <Group justify="space-between" gap={0}>
        <Stack
          gap={3}
          flex={1}
          p={"xs"}
          onClick={() => {
            setSelectedTune(tune);
          }}
        >
          <Text size={"sm"}>{tune.title}</Text>
          <Text size={"xs"}>
            {!lastPlayedAt
              ? "Never played before."
              : daysSinceLastPlayed === 0
                ? "Last played today."
                : `Played ${daysSinceLastPlayed} days ago`}{" "}
            - {track?.playCount} plays
          </Text>
        </Stack>
        <Group gap={0} justify="center" align="center">
          <Menu shadow="md" width={120} position="right">
            <Menu.Target>
              <ActionIcon size={50} color="dimmed" variant="transparent">
                <HiDotsHorizontal size={"60%"} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<FaRegClone size={20} />}
                onClick={() => {
                  setCloneTo(tune);
                }}
              >
                Clone To
              </Menu.Item>

              <Menu.Item
                leftSection={<IoEnterOutline size={20} />}
                onClick={() => {
                  setMoveTo(tune);
                }}
              >
                Move To
              </Menu.Item>

              <Menu.Item
                color="blue"
                leftSection={<PiPencilBold size={20} />}
                onClick={() => {
                  navigate(
                    RoutePaths.Tune.replace(
                      ":playlistId",
                      playlist?.id || "",
                    ).replace(":tuneId", tune.id),
                  );
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<BiTrash size={20} />}
                onClick={() => {
                  updatedPlaylist({
                    tunes: playlist?.tunes?.filter((t) => t.id !== tune.id),
                  });
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Paper>
  );
};
