import { LayoutPage } from "../LayoutPage/LayoutPage";

import library from "@/assets/library.json";
import {
  useAddSong,
  useRemoveTrack,
  useTune,
  useUpdateTune,
} from "@/hooks/useTune";
import { Song } from "@/types";
import {
  ActionIcon,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { IoPlayCircleOutline } from "react-icons/io5";
import { stringSimilarity } from "string-similarity-js";
import { EditableTitle } from "../EditableTitle/EditableTitle";
import { NewSongPane } from "./NewSongPane";
import { SongPreview } from "./SongPreview";

export const PageTune = () => {
  const { tune } = useTune();
  const [updateTune] = useUpdateTune();
  const [addSong] = useAddSong();
  const [removeTrack] = useRemoveTrack();
  const previewDisclosure = useDisclosure(false);
  const newSongDisclosure = useDisclosure(false);
  const [previewSong, setPreviewSong] = useState<Song>();

  if (!tune) return <LayoutPage>Loading...</LayoutPage>;

  const recomended =
    tune.name === "Untitled Tune"
      ? []
      : library.filter(
          (song) =>
            stringSimilarity(clean(song.title), clean(tune.name)) > 0.53 ||
            clean(song.title).includes(clean(tune.name)) ||
            clean(tune.name).includes(clean(song.title)),
        );

  return (
    <LayoutPage>
      <Group p={"md"} bg={"gray.2"}>
        <EditableTitle
          value={tune.name}
          onChange={async (e) => {
            updateTune({ name: e });
          }}
        />
      </Group>

      <Container size="lg">
        <Group align="center" justify="space-between" py={"sm"}>
          <Text size="xl">Songs</Text>
          <Button
            onClick={() => {
              newSongDisclosure[1].open();
            }}
          >
            New Song
          </Button>
        </Group>

        {tune.tracks.map((track) => (
          <Card withBorder mb={"xs"} key={track.id} p={"sm"}>
            <Group>
              <ActionIcon
                variant="transparent"
                color="gray"
                size={36}
                onClick={() => {
                  previewDisclosure[1].open();
                  setPreviewSong(track.song);
                }}
              >
                <IoPlayCircleOutline size={"100%"} />
              </ActionIcon>

              <Stack maw={"calc(100% - 100px)"} gap={0} style={{ flex: 1 }}>
                <Text fz="sm" fw={700} truncate="end">
                  {track.song.author}
                </Text>
                <Text fz="xs" c="dimmed" truncate="end">
                  {track.song.title} — {track.playCount} plays
                </Text>
              </Stack>
              <ActionIcon
                size={32}
                variant="transparent"
                onClick={() => {
                  removeTrack(track);
                }}
              >
                <FaMinusCircle color="rgba(237, 74, 74, 1)" size={"100%"} />
              </ActionIcon>
            </Group>
          </Card>
        ))}

        <Divider />

        {tune.name.length > 2 && recomended.length > 0 && (
          <>
            <Text size="xl" my={"sm"}>
              Recomended
            </Text>

            {recomended
              .filter((s) => tune.tracks.every((t) => t.song.url !== s.url))
              .map((song) => (
                <Card
                  withBorder
                  mb={"xs"}
                  key={song.author + song.title + song.url}
                  p={"sm"}
                >
                  <Group>
                    <ActionIcon
                      variant="transparent"
                      color="gray"
                      size={36}
                      onClick={() => {
                        previewDisclosure[1].open();
                        setPreviewSong(song);
                      }}
                    >
                      <IoPlayCircleOutline size={"100%"} />
                    </ActionIcon>
                    <Stack
                      maw={"calc(100% - 100px)"}
                      gap={0}
                      style={{ flex: 1 }}
                    >
                      <Text fz="sm" fw={700} truncate="end">
                        {song.author}
                      </Text>
                      <Text fz="xs" c="dimmed" truncate="end">
                        {song.title}
                      </Text>
                    </Stack>

                    <ActionIcon
                      size={32}
                      variant="transparent"
                      onClick={() => {
                        addSong(song);
                      }}
                    >
                      <FaPlusCircle size={"100%"} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
          </>
        )}
      </Container>
      <SongPreview disclosure={previewDisclosure} song={previewSong as Song} />
      <NewSongPane
        disclosure={newSongDisclosure}
        onComplete={(song) => {
          addSong(song);
        }}
      />
    </LayoutPage>
  );
};

const clean = (s: string) => {
  return s
    .toLowerCase()
    .replace("slip jig", "")
    .replace("the", "")
    .replace(", ", " ")
    .replace(", the", " ")
    .replace("jig", "")
    .replace("reel", "")
    .replace("hornpipe", "")
    .replace("polka", "")
    .replace("set dance", "")
    .replace("setdance", "")
    .replace("set", "")
    .replace("dance", "")
    .replace("slow air", "")
    .replace("slow", "")
    .replace("air", "")
    .replace("barndance", "")
    .replace("march", "")
    .replace("waltz", "")
    .replace("slide", "")
    .replace(")", "")
    .replace("(", "");
};
