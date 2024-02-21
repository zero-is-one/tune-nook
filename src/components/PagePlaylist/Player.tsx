import { selectedTrackAtom, selectedTuneAtom } from "@/atoms";
import { useUpdateTrack, useUpdateTune } from "@/hooks/useStore";
import { Playlist } from "@/types";
import { Box, Button, Group, Menu, Stack, Text } from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import { Timestamp } from "firebase/firestore";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaPause, FaPlay } from "react-icons/fa";
import { IoPlaySkipForward } from "react-icons/io5";
import { MdOutlineStart } from "react-icons/md";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";
import ReactPlayer from "react-player";

export const Player = ({ playlist }: { playlist: Playlist }) => {
  const { update: updateTune } = useUpdateTune();
  const { update: updateTrack } = useUpdateTrack();
  const [hidden, setHidden] = useState(true);
  const [loop, setLoop] = useState<{
    start: undefined | number;
    end: undefined | number;
  }>({ start: undefined, end: undefined });
  const [selectedTune, setSelectedTune] = useAtom(selectedTuneAtom);
  const selectedTrack = useAtomValue(selectedTrackAtom);
  const previousSelectedTune = usePrevious(selectedTune);
  const playerWidth = 310 / 1.5;
  const playerHeight = 174 / 1.5;
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    //console.log({ selectedTune, previousSelectedTune });
    if (previousSelectedTune === null && selectedTune !== null)
      setHidden(false);

    if (previousSelectedTune?.id !== selectedTune?.id) setHidden(false);
  }, [selectedTune, previousSelectedTune, setHidden]);

  useEffect(() => {
    if (!selectedTrack) return;
    if (!playerRef.current) return;
    if (!isPlaying) return;

    if (playedSeconds < selectedTrack.startTime + 0.01)
      playerRef.current.seekTo(selectedTrack.startTime);
  }, [selectedTrack, selectedTrack?.startTime, playedSeconds, isPlaying]);

  useEffect(() => {
    if (loop.start === undefined || loop.end === undefined) return;

    if (playedSeconds < loop.start || playedSeconds > loop.end)
      playerRef.current?.seekTo(loop.start);
  }, [loop, playedSeconds]);

  useEffect(() => {
    if (!selectedTrack) return;
    if (playedSeconds - selectedTrack.startTime < 6) return;
    if (playedSeconds - selectedTrack.startTime > 7) return;
    if (
      selectedTrack?.lastPlayedAt &&
      Math.abs(selectedTrack?.lastPlayedAt?.seconds - Timestamp.now().seconds) <
        8
    )
      return;

    updateTrack({
      lastPlayedAt: Timestamp.now(),
      playCount: selectedTrack.playCount + 1,
    });

    console.log("Track Played");
  }, [playedSeconds, selectedTrack, selectedTrack?.startTime, updateTrack]);

  if (!selectedTrack) return "No track found.";

  if (hidden) return <></>;

  return (
    <Box
      bg={"blue.1"}
      style={{ boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.15)" }}
    >
      <Group gap={0} style={{ alignItems: "stretch" }} h={64}>
        <Box flex={1} p="xs">
          <Menu position={"top"} shadow="lg" withArrow arrowPosition="center">
            <Menu.Target>
              <Button w={"100%"} h={"100%"} fz={16}>
                {selectedTrack.playbackRate} 𝑥
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Playback Speed</Menu.Label>
              {[0.5, 0.75, 0.9, 1, 1.25, 1.5, 2].map((speed) => (
                <Menu.Item
                  key={speed}
                  onClick={() => {
                    updateTrack({ playbackRate: speed || 1 });
                  }}
                >
                  <Text ta={"right"} truncate="end">
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
                  <Text truncate="end" w={"80vw"}>
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
          controls={false}
          onPlay={() => {
            setIsPlaying(true);
          }}
          onPause={() => {
            setIsPlaying(false);
          }}
          onDuration={(d) => {
            setDuration(d);
          }}
          progressInterval={100}
          onProgress={(d) => {
            setPlayedSeconds(d.playedSeconds);
          }}
        />
        <Box flex={1} px="xs">
          <Button
            w={"100%"}
            h={"100%"}
            onClick={() => {
              const index = playlist.tunes.findIndex(
                (t) => t.id === selectedTune?.id,
              );

              setSelectedTune(playlist.tunes[index + 1]);
            }}
          >
            <IoPlaySkipForward size={20} />
          </Button>
        </Box>
      </Group>

      <Group gap={0} style={{ alignItems: "stretch" }} h={64}>
        <Box flex={1} p="xs" h={"100%"}>
          <Button
            w={"100%"}
            h={"100%"}
            onClick={() => {
              updateTrack({
                startTime: selectedTrack.startTime === 0 ? playedSeconds : 0,
              });
            }}
          >
            <Text size="xs" mr={3}>
              {Math.round(selectedTrack.startTime)}
            </Text>
            <MdOutlineStart size={16} />
          </Button>
        </Box>
        <Box w={playerWidth} py="xs" h={"100%"}>
          <Group
            gap={0}
            align={"center"}
            style={{ alignItems: "stretch" }}
            h={"100%"}
          >
            <Box h={"100%"}>
              <Button
                w={"100%"}
                h={"100%"}
                onClick={() => {
                  playerRef.current?.seekTo(playedSeconds - 1);
                }}
              >
                -1
              </Button>
            </Box>
            <Stack gap={2} h={"100%"} flex={1} justify="center" align="center">
              <Text ta={"center"} size="sm">
                {secondsToMinSecPadded(Math.floor(playedSeconds))} /{" "}
                {secondsToMinSecPadded(Math.round(duration))}
              </Text>
              <Text ta={"center"} size="sm">
                {loop.start !== undefined &&
                  secondsToMinSecPadded(Math.floor(loop.start)) + " / "}

                {loop.end !== undefined &&
                  secondsToMinSecPadded(Math.round(loop.end))}
              </Text>
            </Stack>

            <Box h={"100%"}>
              <Button
                w={"100%"}
                h={"100%"}
                onClick={() => {
                  playerRef.current?.seekTo(playedSeconds + 1);
                }}
              >
                +1
              </Button>
            </Box>
          </Group>
        </Box>
        <Box flex={1} p="xs" h={"100%"}>
          <Button
            w={"100%"}
            h={"100%"}
            onClick={() => {
              if (loop.start === undefined)
                return setLoop({ start: playedSeconds, end: undefined });

              if (loop.end === undefined)
                return setLoop({ start: loop.start, end: playedSeconds });

              setLoop({ start: undefined, end: undefined });
            }}
          >
            {loop.start === undefined && loop.end === undefined && (
              <TbRepeat size={32} />
            )}
            {loop.start !== undefined && loop.end === undefined && (
              <Text size="xs">Set End</Text>
            )}
            {loop.start !== undefined && loop.end !== undefined && (
              <TbRepeatOff size={32} />
            )}
          </Button>
        </Box>
      </Group>
    </Box>
  );
};

const secondsToMinSecPadded = (time: number) => {
  const minutes = `${Math.floor(time / 60)}`.padStart(2, "0");
  const seconds = `${time - Number(minutes) * 60}`.padStart(2, "0");
  return `${minutes}:${seconds}`;
};
