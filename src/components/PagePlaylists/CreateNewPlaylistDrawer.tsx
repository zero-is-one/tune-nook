import { useCreatePlaylist } from "@/hooks/usePlaylists";
import { Route } from "@/router";
import { Button, Drawer, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useFocusTrap } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

export const CreateNewPlaylistDrawer = ({
  disclosure,
}: {
  disclosure: ReturnType<typeof useDisclosure>;
}) => {
  const navigate = useNavigate();
  const [create, loading] = useCreatePlaylist();
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
        onSubmit={form.onSubmit(async (values) => {
          if (loading) return;
          const playlist = await create({ ...values });
          if (!playlist) return;
          navigate(Route.Playlist.replace(":playlistId", playlist.id));
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
          <Button size="lg" type="submit" loading={loading}>
            Create
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};
