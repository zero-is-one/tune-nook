import { Song } from "@/types";
import { ActionIcon, Box, Drawer, Group, Text } from "@mantine/core";
import { createRef } from "react";
import { RxCountdownTimer } from "react-icons/rx";
import ReactPlayer from "react-player";

export const SongPreviewDrawer = ({
  song,
  onClose,
}: {
  song: Song | null;
  onClose: () => void;
}) => {
  const playerRef = createRef<ReactPlayer>();

  return (
    <Drawer
      opened={!!song}
      onClose={onClose}
      position="bottom"
      size={300}
      title={
        <Text size="sm" w={"calc(100vw - 80px)"} truncate="end">
          {song?.author} - {song?.title}
        </Text>
      }
      offset={8}
      radius={8}
    >
      <Group align="center" justify="center">
        <ActionIcon
          variant="transparent"
          size={36}
          onClick={() => {
            playerRef.current?.seekTo(playerRef.current?.getCurrentTime() - 1);
          }}
        >
          <RxCountdownTimer size={"100%"} />
        </ActionIcon>
        <Box>
          <ReactPlayer
            ref={playerRef}
            playing={true}
            width={200}
            height={200}
            url={song?.url}
          />
        </Box>
        <ActionIcon
          variant="transparent"
          size={36}
          onClick={() => {
            playerRef.current?.seekTo(playerRef.current?.getCurrentTime() + 1);
          }}
        >
          <RxCountdownTimer
            size={"100%"}
            style={{
              transform: "scaleX(-1)",
            }}
          />
        </ActionIcon>
      </Group>
    </Drawer>
  );
};
