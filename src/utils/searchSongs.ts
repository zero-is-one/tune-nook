import library from "@/assets/library.json";
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
        .slice(0, 10);
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
