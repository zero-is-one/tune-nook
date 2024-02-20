import { Song } from "@/types";
import { Button, Drawer, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

export const NewSongDrawer = ({
  disclosure,
  onComplete,
}: {
  disclosure: ReturnType<typeof useDisclosure>;
  onComplete: (song: Song) => void;
}) => {
  const [opened, { close }] = disclosure;
  const form = useForm({
    initialValues: {
      url: "",
      author: "",
      title: "",
    },
  });

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="bottom"
      size={350}
      title={"Add New Song"}
    >
      <form
        onSubmit={form.onSubmit(() => {
          onComplete(form.values as Song);
          close();
          form.reset();
        })}
      >
        {" "}
        <Stack gap={"md"}>
          <TextInput
            withAsterisk
            label="Title"
            placeholder=""
            {...form.getInputProps("title")}
          />
          <TextInput
            withAsterisk
            label="Author"
            placeholder=""
            {...form.getInputProps("author")}
          />
          <TextInput
            withAsterisk
            label="URL"
            placeholder="https://www.youtube.com/watch?v=..."
            {...form.getInputProps("url")}
          />
          <Button type="submit">Add Song</Button>{" "}
        </Stack>
      </form>
    </Drawer>
  );
};
