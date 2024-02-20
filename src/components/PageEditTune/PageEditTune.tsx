import library from "@/assets/library.json";
import { LayoutPage } from "@/components/LayoutPage/LayoutPage";
import { useUpdatePlaylist } from "@/hooks/useStore";
import { RoutePaths } from "@/router";
import { Song, Tune } from "@/types";
import {
  ActionIcon,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Timestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { IoPlayCircleOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import stringSimilarity from "string-similarity-js";
import { NewSongDrawer } from "./NewSongDrawer";
import { SongPreviewDrawer } from "./SongPreviewDrawer";

export const PageEditTune = () => {
  const navigate = useNavigate();
  const { update: updatePlaylist, playlist: selectedPlaylist } =
    useUpdatePlaylist();
  const { tuneId } = useParams<{ tuneId: string }>();
  const newSongDisclosure = useDisclosure(false);
  const previewDisclosure = useDisclosure(false);
  const [previewSong, setPreviewSong] = useState<Song | undefined>();

  const tune: Tune = (
    !tuneId || tuneId === "new" || !selectedPlaylist?.tunes
      ? ({
          id: Math.random().toString().substring(2),
          title: "",
          isFavorited: false,
          tracks: [],
          createdAt: Timestamp.now(),
        } satisfies Tune)
      : selectedPlaylist.tunes.find((tune) => tune.id === tuneId)
  ) as Tune;

  const form = useForm({
    initialValues: tune,
  });

  const openPreview = (song: Song) => {
    previewDisclosure[1].open();
    setPreviewSong(song);
  };

  const handleSubmit = (tune: Tune) => {
    if (!selectedPlaylist) return;
    if (!tune.tracks.length) return alert("Add at least one song to the tune");

    const tunes =
      tuneId === "new"
        ? [...selectedPlaylist.tunes, tune]
        : selectedPlaylist.tunes.map((t) =>
            t.id === tune.id ? form.values : t,
          );

    updatePlaylist({
      tunes,
    });

    navigate(RoutePaths.Playlist.replace(":playlistId", playlist.id));
  };

  const recomendedSongs = useMemo(() => {
    return form.values.title.length < 4
      ? []
      : library
          .filter(
            (song) =>
              stringSimilarity(clean(song.title), clean(form.values.title)) >
                0.53 ||
              clean(song.title).includes(clean(form.values.title)) ||
              clean(form.values.title).includes(clean(song.title)),
          )
          .slice(0, 10);
  }, [form.values.title]);

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values as Tune);
        })}
      >
        <LayoutPage
          centerSection={"Create a Tune"}
          rightSection={<Button type="submit">Save</Button>}
        >
          <Container py={"md"}>
            <Stack>
              <TextInput
                data-autofocus
                size="lg"
                required
                label="Tune Name"
                placeholder="Enter tune name..."
                {...form.getInputProps("title")}
              />

              <Divider />

              <Group justify="space-between">
                <Text size="lg" fw="bold">
                  Songs
                </Text>
                <Button onClick={() => newSongDisclosure[1].open()}>
                  Add Song
                </Button>
              </Group>

              {form.values.tracks.length === 0 && (
                <Text c="dimmed">No songs added</Text>
              )}
              <Stack gap={"xs"}>
                {form.values.tracks.map((track) => (
                  <Card withBorder p={"sm"} key={track.id}>
                    <Group>
                      <ActionIcon
                        variant="transparent"
                        color="gray"
                        size={36}
                        onClick={() => openPreview(track.song)}
                      >
                        <IoPlayCircleOutline size={"100%"} />
                      </ActionIcon>

                      <Stack
                        maw={"calc(100% - 100px)"}
                        gap={0}
                        style={{ flex: 1 }}
                      >
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
                          form.setValues({
                            ...form.values,
                            tracks: form.values.tracks.filter(
                              (t) => t.id !== track.id,
                            ),
                          });
                        }}
                      >
                        <IoMdCloseCircle
                          color="rgba(237, 74, 74, 1)"
                          size={"100%"}
                        />
                      </ActionIcon>
                    </Group>
                  </Card>
                ))}
              </Stack>
              <Divider />

              <Text size="lg" fw="bold">
                Recomended Songs
              </Text>

              {form.values.title.length > 4 && recomendedSongs.length === 0 && (
                <Text c="dimmed">No songs found</Text>
              )}
              <Stack gap={"xs"}>
                {recomendedSongs
                  .filter((s) =>
                    form.values.tracks.every((t) => t.song.url !== s.url),
                  )
                  .map((song) => (
                    <Group key={song.url}>
                      <ActionIcon
                        variant="transparent"
                        color="gray"
                        size={36}
                        onClick={() => openPreview(song)}
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
                          form.setValues({
                            ...form.values,
                            tracks: [
                              ...form.values.tracks,
                              {
                                id: Math.random().toString().substring(2),
                                song,
                                startTime: 0,
                                playbackRate: 1,
                                playCount: 0,
                                createdAt: Timestamp.now(),
                              },
                            ],
                          });
                        }}
                      >
                        <FaPlusCircle size={"100%"} />
                      </ActionIcon>
                    </Group>
                  ))}
              </Stack>
            </Stack>
          </Container>
        </LayoutPage>
      </form>
      <SongPreviewDrawer
        disclosure={previewDisclosure}
        song={previewSong as Song}
      />
      <NewSongDrawer
        disclosure={newSongDisclosure}
        onComplete={(song) => {
          form.setValues({
            ...form.values,
            tracks: [
              ...form.values.tracks,
              {
                id: Math.random().toString().substring(2),
                song,
                startTime: 0,
                playbackRate: 1,
                playCount: 0,
                createdAt: Timestamp.now(),
              },
            ],
          });
        }}
      />
    </>
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
