import library from "@/assets/library.json";
import names from "@/assets/names.json";
import { OptionsFilter } from "@mantine/core";
import stringSimilarity from "string-similarity-js";

export const searchSongs = (title: string) => {
  return title.length < 4
    ? []
    : library
        .filter(
          (song) =>
            stringSimilarity(clean(song.title), clean(title)) > 0.53 ||
            clean(song.title).includes(clean(title)) ||
            clean(title).includes(clean(song.title)),
        )
        .slice(0, 20)
        .sort(
          (a, b) =>
            stringSimilarity(clean(b.title), clean(title)) -
            stringSimilarity(clean(a.title), clean(title)),
        );
};

export const searchNames = (name: string) => {
  return name.length < 4
    ? []
    : names
        .filter(
          (songName) =>
            stringSimilarity(clean(songName), clean(name)) > 0.53 ||
            clean(songName).includes(clean(name)) ||
            clean(name).includes(clean(songName)),
        )
        .slice(0, 20)
        .sort(
          (a, b) =>
            stringSimilarity(clean(b), clean(name)) -
            stringSimilarity(clean(a), clean(name)),
        );
};

export const searchNamesFilter: OptionsFilter = ({ search }) => {
  const names = searchNames(search).slice(0, 10);
  return names.map((name) => ({ value: name, label: name }));
};

const clean = (s: string) => {
  return encodeURIComponent(s.toLowerCase().replace(/[^a-z0-9 _-]+/gi, " "))
    .replace(/%20/g, " ")
    .replace("%20", " ")
    .replace("-", " ")
    .replace("slip jig", "")
    .replace(", the", " ")
    .replace("the", "")
    .replace(", ", " ")
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
    .replace("(", "")
    .replace("-", "");
};
