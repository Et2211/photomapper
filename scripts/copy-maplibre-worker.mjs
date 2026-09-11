// MapLibre GL JS v6 requires bundler users to explicitly point it at its worker
// script (see the v5->v6 migration guide). Turbopack's asset hashing also breaks
// the worker's relative import of its sibling chunk (vercel/next.js#86495), so
// instead of letting a bundler touch either file, we copy both straight from
// node_modules into public/ and serve them as plain static files.
import { copyFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC_DIR = join(ROOT_DIR, "node_modules", "maplibre-gl", "dist");
const DEST_DIR = join(ROOT_DIR, "public");
const FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

for (const file of FILES) {
  copyFileSync(join(SRC_DIR, file), join(DEST_DIR, file));
}
