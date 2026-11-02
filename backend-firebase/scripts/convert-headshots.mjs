/**
 * Converts headshots in a directory to web-sized WebP, ready for
 * `push-roster.mjs --avatars`.
 *
 * Each JPEG or PNG becomes `<same name>.webp` next to it, replacing an
 * existing WebP of that name, and the original is moved out of the directory
 * so `--avatars` sees one file per member. Images are rotated per EXIF,
 * converted to sRGB, stripped of metadata (GPS, camera), and scaled so their
 * short side is at most 640px: twice the largest card the site shows (288px),
 * for high-density screens. Smaller images are not enlarged.
 *
 * Usage:
 *   node convert-headshots.mjs [dir] [--originals <dir>]
 *
 * Defaults to data/headshots-board, moving originals to data/headshots.
 */
import { createRequire } from 'node:module';
import { access, mkdir, readdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SHORT_SIDE = 640;
const QUALITY = 80;
const SOURCE_TYPES = new Set(['.jpg', '.jpeg', '.png']);

/** sharp is not a dependency here; it is installed for the frontend's image pipeline. */
const loadSharp = () => {
  const require = createRequire(path.join(REPO_ROOT, 'frontend/package.json'));
  try {
    return require('sharp');
  } catch {
    throw new Error('sharp not found: run `npm --prefix frontend ci` first');
  }
};

const exists = (file) => access(file).then(() => true, () => false);

/** Never overwrite an original that was moved aside earlier. */
const freePath = async (dir, name) => {
  const { name: stem, ext } = path.parse(name);
  let candidate = path.join(dir, name);
  for (let n = 1; await exists(candidate); n += 1) candidate = path.join(dir, `${stem} (${n})${ext}`);
  return candidate;
};

const argValue = (flag) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? null : process.argv[index + 1] ?? null;
};

const main = async () => {
  const sharp = loadSharp();
  const positional = process.argv.slice(2).filter((arg, i, args) => !arg.startsWith('--') && args[i - 1] !== '--originals');
  const dir = path.resolve(positional[0] ?? path.join(REPO_ROOT, 'data/headshots-board'));
  const originalsDir = path.resolve(argValue('--originals') ?? path.join(REPO_ROOT, 'data/headshots'));

  const sources = (await readdir(dir)).filter((name) => SOURCE_TYPES.has(path.extname(name).toLowerCase())).sort();
  if (sources.length === 0) {
    console.log(`No JPEG or PNG headshots to convert in ${dir}`);
    return;
  }
  await mkdir(originalsDir, { recursive: true });

  for (const name of sources) {
    const source = path.join(dir, name);
    const target = path.join(dir, `${path.parse(name).name}.webp`);
    const replacing = await exists(target);

    // Write beside the target first, so a failed conversion leaves the old
    // WebP in place.
    const temporary = `${target}.tmp`;
    const { width, height } = await sharp(source)
      .rotate()
      .resize({ width: SHORT_SIDE, height: SHORT_SIDE, fit: 'outside', withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(temporary);
    await rename(temporary, target);

    const original = await freePath(originalsDir, name);
    const before = (await stat(source)).size;
    await rename(source, original);

    const after = (await stat(target)).size;
    console.log(
      `${name}: ${(before / 1e6).toFixed(2)}MB -> ${Math.round(after / 1e3)}KB, ${width}x${height}` +
        `${replacing ? ' (replaced existing WebP)' : ''}; original moved to ${path.relative(REPO_ROOT, original)}`,
    );
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
