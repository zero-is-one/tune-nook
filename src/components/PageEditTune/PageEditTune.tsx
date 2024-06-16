import names from "@/assets/names.json";
import { ActionCard } from "@/components/ActionCard/ActionCard";
import { Header } from "@/components/Header/Header";
import { LayoutFullScreen } from "@/components/LayoutFullScreen/LayoutFullScreen";
import { usePlaylist } from "@/hooks/usePlaylist";
import { useTune, useUpdateTune } from "@/hooks/useTune";
import { useCreateTune } from "@/hooks/useTunes";
import { Route } from "@/router";
import { Song, Track, Tune } from "@/types";
import { searchNamesFilter, searchSongs } from "@/utils/search";
import {
  ActionIcon,
  Autocomplete,
  Button,
  Card,
  Container,
  Input,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure, usePrevious } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import { CiBookmarkRemove, CiCirclePlus } from "react-icons/ci";
import { IoArrowBack, IoPlayCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { CreateSongDrawer } from "./CreateSongDrawer";
import { SongPreviewDrawer } from "./SongPreviewDrawer";

export const PageEditTune = () => {
  const navigate = useNavigate();
  const [previewSong, setPreviewSong] = useState<Song | null>(null);
  const createSongDisclosure = useDisclosure();
  const [playlist] = usePlaylist();
  const [currentTune, loading] = useTune();
  const [create, createLoading] = useCreateTune();
  const [update, updateLoading] = useUpdateTune();
  const previouCurrentTune = usePrevious(currentTune);
  const isSavingTune = createLoading || updateLoading;

  const emptyTune: Partial<Tune> = {
    title: "",
    tracks: [],
  };

  const form = useForm({
    initialValues: emptyTune,
  });
  const tracks = form.values.tracks || [];
  const [debouncedTitle] = useDebouncedValue(form.values.title, 200);

  useEffect(() => {
    if (!currentTune) return;
    if (currentTune && previouCurrentTune?.id !== currentTune.id) {
      form.setValues(currentTune);
    }
  }, [currentTune, form, previouCurrentTune?.id]);

  const handleSubmit = async (tune: Tune) => {
    if (!tune.tracks.length) return alert("Add at least one song to the tune");

    if (!currentTune) {
      await create(tune);
    } else {
      await update(tune);
    }

    navigate(Route.Playlist.replace(":playlistId", playlist?.id || ""));
  };

  const addSongToTracks = (song: Song) => {
    form.setValues({
      ...form.values,
      tracks: [
        ...tracks,
        {
          id: Math.random().toString().substring(2),
          song,
          startTime: 0,
          playbackRate: 1,
        } satisfies Track,
      ],
    });
  };

  const removeTrack = (track: Track) => {
    form.setValues({
      ...form.values,
      tracks: tracks.filter((t) => t.id !== track.id),
    });
  };

  const recomendedSongs = useMemo(
    () => searchSongs(debouncedTitle || ""),
    [debouncedTitle],
  );

  return (
    <>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values as Tune))}>
        <LayoutFullScreen
          header={
            <Header
              leftSection={
                <ActionIcon
                  variant="transparent"
                  component={Link}
                  to={Route.Playlist.replace(":playlistId", playlist?.id || "")}
                >
                  <IoArrowBack size={"100%"} />
                </ActionIcon>
              }
              rightSection={
                <Button loading={isSavingTune} type="submit">
                  Save
                </Button>
              }
            />
          }
        >
          <Container py={"md"} {...(loading ? { display: "none" } : null)}>
            <Stack>
              <Autocomplete
                data-autofocus
                required
                label="Tune Name"
                placeholder="Enter tune name..."
                filter={searchNamesFilter}
                data={names}
                {...form.getInputProps("title")}
              />

              <Stack gap={4}>
                <Input.Label>Songs</Input.Label>
                <Card withBorder padding="sm" radius="md">
                  <Stack gap={"4"}>
                    <Stack
                      gap={"4"}
                      {...(tracks.length <= 0 && { display: "none" })}
                    >
                      {tracks.map((track) => (
                        <ActionCard
                          key={track.id}
                          bg={"transparent"}
                          title={track.song.author}
                          subtitle={track.song.title}
                          rightSection={
                            <CiBookmarkRemove
                              onClick={() => removeTrack(track)}
                              size={32}
                            />
                          }
                          leftSection={
                            <IoPlayCircleOutline
                              onClick={() => setPreviewSong(track.song)}
                              size={36}
                            />
                          }
                          onClick={() => setPreviewSong(track.song)}
                        />
                      ))}
                    </Stack>
                    <Button onClick={() => createSongDisclosure[1].open()}>
                      Add Song
                    </Button>
                  </Stack>
                </Card>
              </Stack>

              <Stack
                gap={"4"}
                {...(recomendedSongs.length <= 0 &&
                  debouncedTitle !== form.values.title && { display: "none" })}
              >
                <Input.Label>Reccomended Songs</Input.Label>
                {recomendedSongs
                  .filter((song) => {
                    return !tracks.find((track) => track.song.url === song.url);
                  })
                  .map((song) => (
                    <ActionCard
                      key={song.url}
                      bg={"transparent"}
                      title={song.author}
                      subtitle={song.title}
                      rightSection={
                        <CiCirclePlus
                          onClick={() => addSongToTracks(song)}
                          size={32}
                        />
                      }
                      leftSection={
                        <IoPlayCircleOutline
                          onClick={() => setPreviewSong(song)}
                          size={36}
                        />
                      }
                      onClick={() => setPreviewSong(song)}
                    />
                  ))}
              </Stack>
            </Stack>
          </Container>
        </LayoutFullScreen>
      </form>
      <SongPreviewDrawer
        song={previewSong}
        onClose={() => setPreviewSong(null)}
      />
      <CreateSongDrawer
        title={currentTune?.title}
        disclosure={createSongDisclosure}
        onComplete={(song) => {
          addSongToTracks(song);
        }}
      />
    </>
  );
};
