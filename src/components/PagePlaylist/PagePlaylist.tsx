import { EditableTitle } from "@/components/EditableTitle/EditableTitle";
import { Header } from "@/components/Header/Header";
import { LayoutFullScreen } from "@/components/LayoutFullScreen/LayoutFullScreen";
import { usePlaylist, useUpdatePlaylist } from "@/hooks/usePlaylist";
import { useUpdateTune } from "@/hooks/useTune";
import { useCreateTune, useRemoveTune, useTunes } from "@/hooks/useTunes";
import { Route } from "@/router";
import { Playlist } from "@/types";
import {
  ActionIcon,
  Box,
  Group,
  Menu,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { Timestamp } from "firebase/firestore/lite";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";
import { PiMusicNotesPlusFill } from "react-icons/pi";
import { RiCalendarFill, RiEyeFill } from "react-icons/ri";
import { TbDragDrop2, TbEdit, TbLayersSubtract, TbTrash } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { ActionCard } from "../ActionCard/ActionCard";
import { Player } from "./Player";
import {
  Context as SelectPlaylistContext,
  SelectPlaylistDrawer,
} from "./SelectPlaylistDrawer";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
const TuneFilterOptions = [
  "Last Played",
  "Alphabetical",
  "Created, newest",
  "Created, oldest",
] as const;
type TuneFilterOption = (typeof TuneFilterOptions)[number];

export const PagePlaylist = () => {
  const navigate = useNavigate();
  const [playlist] = usePlaylist();
  const [tunes] = useTunes();
  const [createTune] = useCreateTune();
  const [updateTune] = useUpdateTune();
  const [removeTune] = useRemoveTune();
  const [updatePlaylist] = useUpdatePlaylist();
  const [selectPlaylistContext, setSelectPlaylistContext] =
    useState<SelectPlaylistContext>();
  const [activeTuneId, setActiveTuneId] = useState<string | undefined>();
  const activeTune = tunes?.find((tune) => tune.id === activeTuneId);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<TuneFilterOption>(
    TuneFilterOptions[0],
  );

  let filteredTunes = [...(tunes || [])];
  if (searchText) {
    filteredTunes = filteredTunes.filter((tune) =>
      tune.title.toLowerCase().includes(searchText.toLowerCase()),
    );
  }
  if (selectedFilter === "Last Played") {
    filteredTunes.sort((a, b) =>
      (b.lastPlayedAt || Timestamp.fromMillis(0)).toDate() >
      (a.lastPlayedAt || Timestamp.fromMillis(0)).toDate()
        ? -1
        : 1,
    );
  }
  if (selectedFilter === "Alphabetical") {
    filteredTunes.sort((a, b) => (a.title > b.title ? 1 : -1));
  }
  if (selectedFilter.includes("Created")) {
    filteredTunes.sort((a, b) =>
      a.createdAt.toDate() > b.createdAt.toDate() ? -1 : 1,
    );
  }
  if (selectedFilter === "Created, oldest") {
    filteredTunes.reverse();
  }

  const onSelectedPlaylistFromDrawer = async (
    playlist: Playlist | undefined,
    context: SelectPlaylistContext,
  ) => {
    if (!playlist) throw new Error("Playlist is not selected");
    if (!context) throw new Error("Context is not selected");

    if (context.action === "clone") {
      await createTune({ ...context.tune, playlistId: playlist.id });
    }

    if (context.action === "move") {
      await updateTune({ id: context.tune.id, playlistId: playlist.id });
    }

    setSelectPlaylistContext(undefined);
  };

  const onNext = () => {
    const index = tunes?.findIndex((t) => t.id === activeTuneId) ?? 0;
    const nextTune = tunes?.[index + 1];
    setActiveTuneId(nextTune?.id);
  };

  return (
    <>
      <LayoutFullScreen
        header={
          <Header
            leftSection={
              <ActionIcon
                variant="transparent"
                component={Link}
                to={Route.Playlists}
              >
                <IoArrowBack size={"100%"} />
              </ActionIcon>
            }
            centerSection={
              <Box w={250} {...(!playlist && { display: "none" })}>
                <EditableTitle
                  onChange={async (title) => {
                    await updatePlaylist({ title });
                  }}
                  value={playlist?.title || ""}
                />
              </Box>
            }
            rightSection={
              <>
                <ActionIcon
                  component={Link}
                  to={Route.NewTune.replace(":playlistId", playlist?.id || "")}
                  disabled={!playlist}
                  size={"lg"}
                >
                  <PiMusicNotesPlusFill size={"70%"} />
                </ActionIcon>
              </>
            }
          />
        }
      >
        <Stack h={"100%"} gap={0}>
          <Group justify="space-between" p={"xs"} bg={"gray.3"}>
            <TextInput
              flex={1}
              leftSectionPointerEvents="none"
              leftSection={<BiSearch />}
              placeholder="Search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.currentTarget.value);
                setActiveTuneId(undefined);
              }}
            />
            <Select
              w={160}
              data={TuneFilterOptions}
              value={selectedFilter}
              onChange={(value) => {
                if (!value) return;
                setSelectedFilter(value as TuneFilterOption);
              }}
            />
          </Group>
          <Stack gap={4} p={"xs"} flex={1} style={{ overflow: "auto" }}>
            {filteredTunes?.map((tune) => (
              <ActionCard
                style={{
                  cursor: "pointer",
                  ...{
                    borderColor:
                      activeTune?.id === tune?.id
                        ? "var(--mantine-color-blue-8)"
                        : "",
                  },
                }}
                key={tune.id}
                title={tune.title}
                subtitle={
                  <Group component={"span"}>
                    <Group component={"span"} gap={4}>
                      <RiEyeFill size={14} />
                      <span>{tune.playCount}</span>
                    </Group>
                    <Group component={"span"} gap={4}>
                      <RiCalendarFill size={14} />
                      <span>
                        {!tune.lastPlayedAt
                          ? "--"
                          : timeAgo.format(
                              tune.lastPlayedAt.toDate(),
                              "mini-minute-now",
                            )}
                      </span>
                    </Group>
                  </Group>
                }
                onClick={() => {
                  setActiveTuneId(tune.id);
                }}
                rightSection={
                  <Menu shadow="md" width={120} position="right">
                    <Menu.Target>
                      <ActionIcon
                        size={"md"}
                        color="dimmed"
                        variant="transparent"
                      >
                        <HiDotsHorizontal size={"100%"} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<TbLayersSubtract size={20} />}
                        onClick={() => {
                          setSelectPlaylistContext({ action: "clone", tune });
                        }}
                      >
                        Clone
                      </Menu.Item>

                      <Menu.Item
                        leftSection={<TbDragDrop2 size={20} />}
                        onClick={() => {
                          setSelectPlaylistContext({ action: "move", tune });
                        }}
                      >
                        Move
                      </Menu.Item>

                      <Menu.Item
                        color="blue"
                        leftSection={<TbEdit size={20} />}
                        onClick={() => {
                          navigate(
                            Route.Tune.replace(
                              ":playlistId",
                              playlist?.id || ":playlistId",
                            ).replace(":tuneId", tune.id),
                          );
                        }}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={<TbTrash size={20} />}
                        onClick={() => {
                          removeTune(tune);
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                }
              />
            ))}
          </Stack>
          <Player
            tune={activeTune}
            onClose={() => setActiveTuneId(undefined)}
            onNext={() => onNext()}
          />
        </Stack>
      </LayoutFullScreen>
      <SelectPlaylistDrawer
        context={selectPlaylistContext}
        onSelect={onSelectedPlaylistFromDrawer}
        label={"Select Playlist"}
      />
    </>
  );
};
