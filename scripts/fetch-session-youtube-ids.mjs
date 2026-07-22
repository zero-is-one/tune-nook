#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_TARGET_TUNES = 5000;
const DEFAULT_CONCURRENCY = 2;
const DEFAULT_OUTPUT_PATH = path.resolve(
  "scripts",
  "thesession-top5000-youtube-ids.json",
);
const CHECKPOINT_EVERY_TUNES = 10;
const POPULAR_API_URL =
  "https://thesession.org/tunes/popular?format=json&page=";
const TUNE_PAGE_URL = "https://thesession.org/tunes/";

function parseArgs(argv) {
  const options = {
    limit: DEFAULT_TARGET_TUNES,
    concurrency: DEFAULT_CONCURRENCY,
    outputPath: DEFAULT_OUTPUT_PATH,
    checkpointPath: "",
    resume: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--limit" && argv[i + 1]) {
      options.limit = Number.parseInt(argv[i + 1], 10);
      i += 1;
      continue;
    }

    if (arg === "--concurrency" && argv[i + 1]) {
      options.concurrency = Number.parseInt(argv[i + 1], 10);
      i += 1;
      continue;
    }

    if (arg === "--out" && argv[i + 1]) {
      options.outputPath = path.resolve(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--checkpoint" && argv[i + 1]) {
      options.checkpointPath = path.resolve(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--no-resume") {
      options.resume = false;
      continue;
    }
  }

  if (!Number.isFinite(options.limit) || options.limit <= 0) {
    throw new Error("Invalid --limit value. It must be a positive integer.");
  }

  if (!Number.isFinite(options.concurrency) || options.concurrency <= 0) {
    throw new Error(
      "Invalid --concurrency value. It must be a positive integer.",
    );
  }

  if (!options.checkpointPath) {
    options.checkpointPath = `${options.outputPath}.progress.json`;
  }

  return options;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, { parseAs = "json", retries = 3 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "tune-nook-youtube-id-crawler/1.0",
          accept: parseAs === "json" ? "application/json" : "text/html",
        },
      });

      if (!response.ok) {
        const bodySnippet = (await response.text())
          .slice(0, 300)
          .replace(/\s+/g, " ");
        throw new Error(
          `HTTP ${response.status} for ${url}. Response snippet: ${bodySnippet || "<empty>"}`,
        );
      }

      return parseAs === "json" ? response.json() : response.text();
    } catch (error) {
      lastError = error;
      const reason = error?.message || String(error);
      process.stderr.write(
        `[fetchWithRetry] Attempt ${attempt}/${retries} failed for ${url}: ${reason}\n`,
      );
      if (attempt < retries) {
        const backoffMs = 350 * attempt;
        process.stderr.write(
          `[fetchWithRetry] Retrying ${url} in ${backoffMs}ms...\n`,
        );
        await sleep(backoffMs);
      }
    }
  }

  const error = new Error(
    `Failed to fetch ${url} after ${retries} attempts. See previous logs for each retry.`,
  );
  error.cause = lastError;
  throw error;
}

function formatError(error) {
  if (!error) {
    return {
      name: "UnknownError",
      message: "Unknown error",
      stack: null,
      cause: null,
    };
  }

  const name = typeof error.name === "string" ? error.name : "Error";
  const message =
    typeof error.message === "string" ? error.message : String(error);
  const stack = typeof error.stack === "string" ? error.stack : null;

  return {
    name,
    message,
    stack,
    cause: error.cause ? formatError(error.cause) : null,
  };
}

async function loadCheckpoint(checkpointPath) {
  try {
    const raw = await readFile(checkpointPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }

    process.stderr.write(
      `Checkpoint exists but could not be read: ${checkpointPath}\n`,
    );
    const detail = formatError(error);
    process.stderr.write(`Checkpoint read error: ${detail.message}\n`);
    if (detail.stack) {
      process.stderr.write(`${detail.stack}\n`);
    }
    throw error;
  }
}

function createCheckpointState(options) {
  const now = new Date().toISOString();
  return {
    version: 1,
    createdAt: now,
    updatedAt: now,
    stage: "starting",
    options: {
      limit: options.limit,
      concurrency: options.concurrency,
      outputPath: options.outputPath,
      checkpointPath: options.checkpointPath,
    },
    topTunes: [],
    topTunesNextPage: 1,
    topTunesTotalPages: null,
    tuneEntriesById: {},
    scan: {
      completedTotal: 0,
      processedThisRun: 0,
      resumedFromCheckpoint: 0,
    },
    lastCheckpointReason: "initialized",
  };
}

async function saveCheckpoint(checkpointPath, checkpoint, reason) {
  checkpoint.updatedAt = new Date().toISOString();
  checkpoint.lastCheckpointReason = reason;
  await mkdir(path.dirname(checkpointPath), { recursive: true });
  await writeFile(
    checkpointPath,
    `${JSON.stringify(checkpoint, null, 2)}\n`,
    "utf8",
  );
}

function extractYoutubeIdsFromHtml(html) {
  const ids = [];
  const seen = new Set();
  const embedTagRegex = /<embed-player\b[^>]*>/gi;

  for (const match of html.matchAll(embedTagRegex)) {
    const tag = match[0];
    const providerMatch = tag.match(/data-provider=["']([^"']+)["']/i);
    if (!providerMatch || providerMatch[1].toLowerCase() !== "youtube") {
      continue;
    }

    const idMatch = tag.match(/data-id=["']([^"']+)["']/i);
    const youtubeId = idMatch?.[1]?.trim();

    if (!youtubeId || seen.has(youtubeId)) {
      continue;
    }

    seen.add(youtubeId);
    ids.push(youtubeId);
  }

  return ids;
}

async function getTopTunes(limit, checkpoint, checkpointPath) {
  const tunesOut = Array.isArray(checkpoint.topTunes)
    ? [...checkpoint.topTunes]
    : [];
  const seenTuneIds = new Set(tunesOut.map((tune) => tune.id));

  let page = Number.isFinite(checkpoint.topTunesNextPage)
    ? checkpoint.topTunesNextPage
    : 1;
  let totalPages = Number.isFinite(checkpoint.topTunesTotalPages)
    ? checkpoint.topTunesTotalPages
    : Number.POSITIVE_INFINITY;

  while (tunesOut.length < limit && page <= totalPages) {
    const pageUrl = `${POPULAR_API_URL}${page}`;
    const payload = await fetchWithRetry(pageUrl, { parseAs: "json" });

    totalPages = Number(payload.pages) || totalPages;
    const tunes = Array.isArray(payload.tunes) ? payload.tunes : [];

    if (tunes.length === 0) {
      break;
    }

    for (const tune of tunes) {
      const tuneId = tune?.id;
      if (!Number.isFinite(tuneId) || seenTuneIds.has(tuneId)) {
        continue;
      }

      seenTuneIds.add(tuneId);
      tunesOut.push({
        id: tuneId,
        name: typeof tune?.name === "string" ? tune.name : null,
        type: typeof tune?.type === "string" ? tune.type : null,
      });

      if (tunesOut.length >= limit) {
        break;
      }
    }

    process.stdout.write(
      `Collected tune IDs: ${tunesOut.length}/${limit} (page ${page})\n`,
    );

    checkpoint.stage = "collecting-top-tunes";
    checkpoint.topTunes = tunesOut;
    checkpoint.topTunesNextPage = page + 1;
    checkpoint.topTunesTotalPages = Number.isFinite(totalPages)
      ? totalPages
      : null;
    await saveCheckpoint(
      checkpointPath,
      checkpoint,
      `Collected top tunes page ${page}`,
    );

    page += 1;
  }

  return tunesOut.slice(0, limit);
}

async function getTuneYoutubeEntriesProgressive(
  tunes,
  concurrency,
  checkpoint,
  checkpointPath,
) {
  const tuneEntriesById =
    checkpoint.tuneEntriesById && typeof checkpoint.tuneEntriesById === "object"
      ? checkpoint.tuneEntriesById
      : {};

  let resumedFromCheckpoint = 0;
  for (const tune of tunes) {
    if (tuneEntriesById[tune.id]) {
      resumedFromCheckpoint += 1;
    }
  }

  let processedThisRun = 0;
  let completedTotal = resumedFromCheckpoint;
  let savedAtProcessedCount = 0;
  let cursor = 0;

  if (resumedFromCheckpoint > 0) {
    process.stdout.write(
      `Resuming with ${resumedFromCheckpoint} already scanned tunes from checkpoint.\n`,
    );
  }

  async function maybeSaveProgress(reason, force = false) {
    const shouldSave =
      force ||
      processedThisRun - savedAtProcessedCount >= CHECKPOINT_EVERY_TUNES;

    if (!shouldSave) {
      return;
    }

    checkpoint.stage = "scanning-tunes";
    checkpoint.tuneEntriesById = tuneEntriesById;
    checkpoint.scan = {
      completedTotal,
      processedThisRun,
      resumedFromCheckpoint,
    };

    await saveCheckpoint(checkpointPath, checkpoint, reason);
    savedAtProcessedCount = processedThisRun;
  }

  async function runWorker(workerId) {
    while (true) {
      const index = cursor;
      cursor += 1;

      if (index >= tunes.length) {
        return;
      }

      const tune = tunes[index];
      if (tuneEntriesById[tune.id]) {
        continue;
      }

      try {
        const html = await fetchWithRetry(`${TUNE_PAGE_URL}${tune.id}`, {
          parseAs: "text",
        });
        const youtubeIds = extractYoutubeIdsFromHtml(html);

        tuneEntriesById[tune.id] = {
          tuneId: tune.id,
          name: tune.name,
          type: tune.type,
          youtubeIds,
        };
      } catch (error) {
        const detail = formatError(error);
        tuneEntriesById[tune.id] = {
          tuneId: tune.id,
          name: tune.name,
          type: tune.type,
          youtubeIds: [],
          error: detail,
        };

        process.stderr.write(
          `[worker ${workerId}] Failed tune ${tune.id} (${tune.name || "unknown"})\n`,
        );
        process.stderr.write(
          `[worker ${workerId}] ${detail.name}: ${detail.message}\n`,
        );
        if (detail.stack) {
          process.stderr.write(`${detail.stack}\n`);
        }
        if (detail.cause?.message) {
          process.stderr.write(`Cause: ${detail.cause.message}\n`);
        }
      }

      processedThisRun += 1;
      completedTotal += 1;

      if (completedTotal % 25 === 0 || completedTotal === tunes.length) {
        process.stdout.write(
          `Scanned tune pages: ${completedTotal}/${tunes.length} (new this run: ${processedThisRun})\n`,
        );
      }

      await maybeSaveProgress(
        `Processed tune ${tune.id} (${completedTotal}/${tunes.length})`,
      );
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tunes.length || 1) },
    (_, idx) => runWorker(idx + 1),
  );

  await Promise.all(workers);
  await maybeSaveProgress("Finished scanning tunes", true);

  return tunes.map((tune) => tuneEntriesById[tune.id]).filter(Boolean);
}

async function main() {
  if (typeof fetch !== "function") {
    throw new Error(
      "Global fetch is unavailable. Use Node.js 18+ to run this script.",
    );
  }

  const options = parseArgs(process.argv.slice(2));

  let checkpoint = createCheckpointState(options);
  if (options.resume) {
    const loaded = await loadCheckpoint(options.checkpointPath);
    if (loaded) {
      checkpoint = {
        ...checkpoint,
        ...loaded,
      };

      process.stdout.write(
        `Loaded checkpoint from ${options.checkpointPath} (stage: ${checkpoint.stage || "unknown"}).\n`,
      );
    }
  } else {
    process.stdout.write(
      `Resume disabled. Starting a fresh run and overwriting checkpoint at ${options.checkpointPath}.\n`,
    );
  }

  await saveCheckpoint(options.checkpointPath, checkpoint, "Run started");

  process.stdout.write(`Starting crawl for top ${options.limit} tunes...\n`);
  const topTunes = await getTopTunes(
    options.limit,
    checkpoint,
    options.checkpointPath,
  );

  checkpoint.stage = "scanning-tunes";
  checkpoint.topTunes = topTunes;
  await saveCheckpoint(
    options.checkpointPath,
    checkpoint,
    "Top tunes collection complete",
  );

  process.stdout.write(
    `Collected ${topTunes.length} tune IDs. Fetching tune pages with concurrency ${options.concurrency}...\n`,
  );

  const tuneEntries = await getTuneYoutubeEntriesProgressive(
    topTunes,
    options.concurrency,
    checkpoint,
    options.checkpointPath,
  );

  const uniqueYoutubeIds = new Set();
  let tunesWithYoutube = 0;
  let tunesWithErrors = 0;

  for (const entry of tuneEntries) {
    if (entry.error) {
      tunesWithErrors += 1;
    }

    if (entry.youtubeIds.length > 0) {
      tunesWithYoutube += 1;
    }

    for (const id of entry.youtubeIds) {
      uniqueYoutubeIds.add(id);
    }
  }

  const output = {
    source: "thesession.org",
    generatedAt: new Date().toISOString(),
    requestedTopTunes: options.limit,
    collectedTuneIds: topTunes.length,
    tunesWithYoutube,
    tunesWithErrors,
    uniqueYoutubeIdCount: uniqueYoutubeIds.size,
    youtubeIds: [...uniqueYoutubeIds],
    tunes: tuneEntries,
  };

  await mkdir(path.dirname(options.outputPath), { recursive: true });
  await writeFile(
    options.outputPath,
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8",
  );

  checkpoint.stage = "completed";
  checkpoint.completedAt = new Date().toISOString();
  checkpoint.outputPath = options.outputPath;
  await saveCheckpoint(
    options.checkpointPath,
    checkpoint,
    "Run completed successfully",
  );

  process.stdout.write(`Done. Wrote results to ${options.outputPath}\n`);
  process.stdout.write(`Checkpoint saved at ${options.checkpointPath}\n`);
}

main().catch((error) => {
  const detail = formatError(error);
  process.stderr.write("Fatal error while running crawler.\n");
  process.stderr.write(`${detail.name}: ${detail.message}\n`);
  if (detail.stack) {
    process.stderr.write(`${detail.stack}\n`);
  }
  if (detail.cause?.message) {
    process.stderr.write(`Root cause: ${detail.cause.message}\n`);
    if (detail.cause.stack) {
      process.stderr.write(`${detail.cause.stack}\n`);
    }
  }
  process.stderr.write(
    "If a checkpoint file exists, rerun the same command to resume automatically.\n",
  );
  process.exitCode = 1;
});
