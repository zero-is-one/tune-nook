import { usePlaylists } from "@/hooks/usePlaylists";
import { RoutePaths } from "@/router";
import { Button, Drawer, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useFocusTrap } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export const NewPlaylistDrawer = ({
  disclosure,
}: {
  disclosure: ReturnType<typeof useDisclosure>;
}) => {
  const navigate = useNavigate();
  const { create: createPlaylist } = usePlaylists();
  const [opened, { close }] = disclosure;
  const form = useForm({
    initialValues: {
      title: "",
    },
  });
  const focusTrapRef = useFocusTrap();

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="bottom"
      size={224}
      title="Create New Playlist"
      offset={8}
      radius="md"
    >
      <form
        onSubmit={form.onSubmit((values) => {
          const playlist = createPlaylist({ ...values, tunes: [] });
          navigate(RoutePaths.Playlist.replace(":playlistId", playlist.id));
        })}
        ref={focusTrapRef}
      >
        <Stack>
          <TextInput
            data-autofocus
            size="lg"
            required
            label="Playlist Name"
            placeholder="My Playlist"
            {...form.getInputProps("title")}
          />
          <Button size="lg" type="submit">
            Create
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};
