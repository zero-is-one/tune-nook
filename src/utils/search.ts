import library from "@/assets/library.json";
import names from "@/assets/names.json";
import { OptionsFilter } from "@mantine/core";
import stringSimilarity from "string-similarity-js";

export const searchSongs = (title: string) => {
  if (title.length < 4) return [];

  const query = normalizeTitle(title);
  if (!query.normalized) return [];

  return library
    .map((song) => {
      const candidate = normalizeTitle(song.title);
      const score = scoreSongMatch(query, candidate);

      return { song, score, lengthDelta: Math.abs(candidate.normalized.length - query.normalized.length) };
    })
    .filter((result) => result.score > 85)
    .sort((a, b) => b.score - a.score || a.lengthDelta - b.lengthDelta)
    .slice(0, 20)
    .map((result) => result.song);
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

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "jig",
  "reel",
  "hornpipe",
  "polka",
  "set",
  "dance",
  "setdance",
  "slow",
  "air",
  "barndance",
  "march",
  "waltz",
  "slide",
]);

const normalizeTitle = (s: string) => {
  const normalized = s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = normalized.split(" ").filter(Boolean);
  const coreTokens = tokens.filter((token) => !STOP_WORDS.has(token));

  return {
    normalized,
    core: coreTokens.join(" "),
    tokens,
    coreTokens,
  };
};

const hasOrderedSubsequence = (candidateTokens: string[], queryTokens: string[]) => {
  let queryIndex = 0;

  for (const token of candidateTokens) {
    if (token === queryTokens[queryIndex]) {
      queryIndex += 1;
      if (queryIndex === queryTokens.length) return true;
    }
  }

  return false;
};

const scoreSongMatch = (
  query: ReturnType<typeof normalizeTitle>,
  candidate: ReturnType<typeof normalizeTitle>,
) => {
  const queryText = query.core || query.normalized;
  const candidateText = candidate.core || candidate.normalized;

  if (!queryText || !candidateText) return 0;

  const fuzzy = stringSimilarity(candidateText, queryText);
  const queryTokenSet = new Set(query.coreTokens.length ? query.coreTokens : query.tokens);
  const candidateTokenSet = new Set(
    candidate.coreTokens.length ? candidate.coreTokens : candidate.tokens,
  );

  let overlapCount = 0;
  for (const token of queryTokenSet) {
    if (candidateTokenSet.has(token)) overlapCount += 1;
  }

  const coverage = overlapCount / Math.max(queryTokenSet.size, 1);
  const inOrder = hasOrderedSubsequence(
    candidate.coreTokens.length ? candidate.coreTokens : candidate.tokens,
    query.coreTokens.length ? query.coreTokens : query.tokens,
  );

  let score = fuzzy * 100;

  if (candidateText === queryText) score += 300;
  if (candidateText.startsWith(queryText)) score += 180;
  if (candidateText.includes(queryText)) score += 140;
  if (coverage === 1) score += 120;
  score += coverage * 120;
  if (inOrder) score += 80;

  return score;
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
