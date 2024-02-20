import { selectedTrackAtom, selectedTuneAtom } from "@/atoms";
import { useUpdateTrack, useUpdateTune } from "@/hooks/useStore";
import { Box, Button, Group, Menu, Text } from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaPause, FaPlay } from "react-icons/fa";
import { IoPlaySkipForward } from "react-icons/io5";
import { MdOutlineStart } from "react-icons/md";
import ReactPlayer from "react-player";

export const Player = () => {
  const { update: updateTune } = useUpdateTune();
  const { update: updateTrack } = useUpdateTrack();
  const [hidden, setHidden] = useState(true);
  const selectedTune = useAtomValue(selectedTuneAtom);
  const selectedTrack = useAtomValue(selectedTrackAtom);
  const previousSelectedTune = usePrevious(selectedTune);
  const playerWidth = 310 / 1.5;
  const playerHeight = 174 / 1.5;
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    //console.log({ selectedTune, previousSelectedTune });
    if (previousSelectedTune === null && selectedTune !== null)
      setHidden(false);

    if (previousSelectedTune?.id !== selectedTune?.id) setHidden(false);
  }, [selectedTune, previousSelectedTune, setHidden]);

  if (!selectedTrack) return "No track found.";

  return (
    <Box
      hidden={hidden}
      bg={"blue.1"}
      style={{ boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.15)" }}
    >
      <Group gap={0} style={{ alignItems: "stretch" }}>
        <Box flex={1} p="xs">
          <Menu position={"top"} shadow="lg" withArrow arrowPosition="center">
            <Menu.Target>
              <Button w={"100%"} h={"100%"} fz={16}>
                {selectedTrack.playbackRate} 𝑥
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                <Menu.Item
                  key={speed}
                  onClick={() => {
                    updateTrack({ playbackRate: speed || 1 });
                  }}
                >
                  <Text ta={"center"} truncate="end">
                    {speed} 𝑥{" "}
                  </Text>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Box>
        <Box w={playerWidth} py="xs">
          <Menu position={"top"} shadow="lg" withArrow arrowPosition="center">
            <Menu.Target>
              <Button w={"100%"} h={"100%"} fz={16}>
                {selectedTrack.song.author + "- " + selectedTrack.song.title}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {selectedTune?.tracks.map((t) => (
                <Menu.Item
                  key={t.id}
                  w={"90vw"}
                  onClick={() => {
                    updateTune({ selectedTrackId: t.id });
                  }}
                >
                  <Text truncate="end">
                    {t.song.author + " - " + t.song.title}{" "}
                  </Text>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Box>
        <Box flex={1} p="xs">
          <Button
            w={"100%"}
            h={"100%"}
            pos="relative"
            top={-10}
            style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            onClick={() => setHidden(true)}
          >
            <FaAngleDown size={23} />
          </Button>
        </Box>
      </Group>

      <Group gap={0} style={{ alignItems: "stretch" }}>
        <Box flex={1} px="xs">
          <Button
            w={"100%"}
            h={"100%"}
            onClick={() => {
              setIsPlaying(!isPlaying);
            }}
          >
            {!isPlaying ? <FaPlay size={23} /> : <FaPause size={23} />}
          </Button>
        </Box>
        <ReactPlayer
          ref={playerRef}
          width={playerWidth}
          height={playerHeight}
          url={selectedTrack.song.url}
          playing={isPlaying}
          playbackRate={selectedTrack.playbackRate}
          key={selectedTrack.song.url + selectedTrack.playbackRate}
        />
        <Box flex={1} px="xs">
          <Button w={"100%"} h={"100%"}>
            <IoPlaySkipForward size={23} />
          </Button>
        </Box>
      </Group>

      <Group gap={0} style={{ alignItems: "stretch" }}>
        <Box flex={1} p="xs">
          <Button w={"100%"} h={"100%"}>
            <MdOutlineStart size={23} />
          </Button>
        </Box>
        <Box w={playerWidth} py="xs">
          <Group gap={0} align={"center"} style={{ alignItems: "stretch" }}>
            <Box>
              <Button w={"100%"} h={"100%"}>
                -1
              </Button>
            </Box>
            <Text ta={"center"} flex={1} size="sm">
              000:{duration.toFixed(0).padStart(3, "0")}
            </Text>
            <Box>
              <Button w={"100%"} h={"100%"}>
                +1
              </Button>
            </Box>
          </Group>
        </Box>
        <Box flex={1} p="xs">
          <Button w={"100%"} h={"100%"}>
            Hi
          </Button>
        </Box>
      </Group>
    </Box>
  );
};
