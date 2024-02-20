import { selectedTuneAtom } from "@/atoms";
import { useUpdatePlaylist } from "@/hooks/useStore";
import { RoutePaths } from "@/router";
import { Tune } from "@/types";
import { ActionIcon, Group, Menu, Paper, Stack, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { BiTrash } from "react-icons/bi";
import { HiDotsHorizontal } from "react-icons/hi";
import { PiPencilBold } from "react-icons/pi";
import { TbStar, TbStarFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export const TuneCard = ({ tune }: { tune: Tune }) => {
  const navigate = useNavigate();
  const { update: updatedPlaylist, playlist } = useUpdatePlaylist();
  const [selectedTune, setSelectedTune] = useAtom(selectedTuneAtom);
  const lastPlayedAt = undefined;
  const daysAgoPlayed = 1;

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
              : `Played ${daysAgoPlayed} days ago`}
          </Text>
        </Stack>
        <Group gap={0} justify="center" align="center">
          <ActionIcon
            size={50}
            color={tune.isFavorited ? "blue" : "dimmed"}
            variant="transparent"
            onClick={() => {
              updatedPlaylist({
                tunes: playlist?.tunes?.map((t) =>
                  t.id === tune?.id ? { ...t, isFavorited: !t.isFavorited } : t,
                ),
              });
            }}
          >
            {!tune.isFavorited && <TbStar size={"60%"} />}
            {tune.isFavorited && <TbStarFilled size={"60%"} />}
          </ActionIcon>

          <Menu shadow="md" width={100} position="right">
            <Menu.Target>
              <ActionIcon size={50} color="dimmed" variant="transparent">
                <HiDotsHorizontal size={"60%"} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
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
