import { LayoutPage } from "../LayoutPage/LayoutPage";

import library from "@/assets/library.json";
import { useTune } from "@/hooks/useTune";
import { TextInput } from "@mantine/core";
import { useState } from "react";

console.log(library);

export const PageTune = () => {
  const [value, setValue] = useState("");
  const { tune } = useTune();

  if (!tune) return <LayoutPage>Loading...</LayoutPage>;

  return (
    <LayoutPage>
      Name: {tune.name} - {tune.id}{" "}
      <TextInput
        label="Song Name"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      {value.length > 2 &&
        library
          .filter((song) =>
            song.title.toLowerCase().includes(value.toLowerCase()),
          )
          .map((song) => (
            <div key={song.author + song.title + song.url}>
              {song.author} - {song.title} - {song.url}
            </div>
          ))}
    </LayoutPage>
  );
};
