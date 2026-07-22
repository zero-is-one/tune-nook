#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_LIBRARY_PATH = path.resolve("src", "assets", "library.json");
const DEFAULT_NAMES_PATH = path.resolve("src", "assets", "names.json");

function parseArgs(argv) {
  const options = {
    libraryPath: DEFAULT_LIBRARY_PATH,
    namesPath: DEFAULT_NAMES_PATH,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--library" && argv[i + 1]) {
      options.libraryPath = path.resolve(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--names" && argv[i + 1]) {
      options.namesPath = path.resolve(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  process.stdout.write(
    [
      "Usage:",
      "  node scripts/sync-library-names.mjs [options]",
      "",
      "Options:",
      "  --library <path>  Path to library JSON file",
      "  --names <path>    Path to names JSON file",
      "  --dry-run         Report changes without writing files",
      "  --help, -h        Show this help",
    ].join("\n") + "\n",
  );
}

async function readJson(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    const reason = error?.message || String(error);
    throw new Error(`Failed to read JSON file: ${filePath}. Reason: ${reason}`);
  }
}

function normalizeName(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function collectMissingNames(libraryEntries, existingNames) {
  const existing = new Set(
    existingNames.map((name) => normalizeName(name)).filter(Boolean),
  );
  const pending = new Set();
  const missing = [];

  let invalidTitles = 0;

  for (const entry of libraryEntries) {
    const normalizedTitle = normalizeName(entry?.title);

    if (!normalizedTitle) {
      invalidTitles += 1;
      continue;
    }

    if (existing.has(normalizedTitle) || pending.has(normalizedTitle)) {
      continue;
    }

    pending.add(normalizedTitle);
    missing.push(normalizedTitle);
  }

  return { missing, invalidTitles };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  process.stdout.write(`Reading library: ${options.libraryPath}\n`);
  process.stdout.write(`Reading names: ${options.namesPath}\n`);

  const library = await readJson(options.libraryPath);
  const names = await readJson(options.namesPath);

  if (!Array.isArray(library)) {
    throw new Error(`Library file is not a JSON array: ${options.libraryPath}`);
  }

  if (!Array.isArray(names)) {
    throw new Error(`Names file is not a JSON array: ${options.namesPath}`);
  }

  const existingNames = names.filter((item) => typeof item === "string");
  const { missing, invalidTitles } = collectMissingNames(
    library,
    existingNames,
  );

  process.stdout.write(`Existing names: ${existingNames.length}\n`);
  process.stdout.write(`Library entries scanned: ${library.length}\n`);
  process.stdout.write(
    `Invalid/empty library titles skipped: ${invalidTitles}\n`,
  );
  process.stdout.write(`Missing names to append: ${missing.length}\n`);

  if (missing.length === 0) {
    process.stdout.write("No names to append. names.json is unchanged.\n");
    return;
  }

  if (options.dryRun) {
    process.stdout.write(
      "Dry run enabled. No files were changed. Remove --dry-run to write updates.\n",
    );
    return;
  }

  const updatedNames = [...existingNames, ...missing];
  await writeFile(
    options.namesPath,
    `${JSON.stringify(updatedNames, null, 2)}\n`,
    "utf8",
  );

  process.stdout.write(
    `Appended ${missing.length} names to ${options.namesPath}\n`,
  );
}

main().catch((error) => {
  process.stderr.write("Failed to sync names from library.\n");
  process.stderr.write(
    `${error?.name || "Error"}: ${error?.message || String(error)}\n`,
  );
  if (error?.stack) {
    process.stderr.write(`${error.stack}\n`);
  }
  process.exitCode = 1;
});
