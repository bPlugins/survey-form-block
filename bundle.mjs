/**
 * Builds the distributable zip.
 *
 * `wp-scripts plugin-zip` is not used because its file list is a fixed glob of
 * admin/, build/, includes/, languages/, public/ and a few root files - it has
 * no vendor/, so the zip it produces ships with no Freemius SDK at all. The
 * plugin then has no licensing and, on the free build, no opt-in screen.
 *
 * This walks the plugin instead and drops only what should not ship, so
 * anything added later is included by default rather than silently missed.
 *
 * The premium SDK is deliberately kept in: Freemius builds the free version
 * from this zip by stripping the @fs_premium_only paths declared in the plugin
 * header (/vendor/freemius and /includes/LicenseActivation.php).
 *
 * Run with `npm run zip`, or `npm run bundle` to build first.
 */
import AdmZip from 'adm-zip';
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import { join, relative, sep } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const SLUG = 'survey-form-block';
const OUT = join(ROOT, `${SLUG}.zip`);

/**
 * Directories never shipped, matched on the path's first segment. Any
 * top-level dot-directory goes too - .git, .github, .vscode, .claude and
 * whatever tooling adds next - rather than naming them one at a time.
 */
const SKIP_DIRS = new Set(['node_modules', 'src', 'assets', 'scratchpad']);
const isHidden = (segment) => segment.startsWith('.');

/** Exact root-level files never shipped. */
const SKIP_FILES = new Set([
	'package.json', 'package-lock.json', 'webpack.config.js', 'bundle.mjs',
	'.gitignore', '.distignore', '.eslintrc.js', '.editorconfig',
	'readme.md', 'mess.txt', 'features.txt', 'todo.txt', 'commitmessage.md'
]);

/** Anything matching these is dropped wherever it sits. */
const SKIP_ANY = [/\.map$/, /\.DS_Store$/, /^\.zip$/, /\.zip$/];

/** Must be present, or the zip is not worth shipping. See the header note. */
const REQUIRED = [
	`${SLUG}.php`,
	'readme.txt',
	'build/index.js',
	'build/view.js',
	'includes/PostType.php',
	'vendor/freemius/start.php',
	'vendor/freemius-lite/start.php',
	// The Lite SDK draws its opt-in screen from this; without it the screen is
	// blank on every free install.
	'vendor/freemius-lite/build/opt-in-form.js'
];

const collect = (dir, acc = []) => {
	for (const name of readdirSync(dir)) {
		const abs = join(dir, name);
		const rel = relative(ROOT, abs).split(sep).join('/');
		const [head] = rel.split('/');

		if (SKIP_DIRS.has(head) || isHidden(head)) { continue; }
		if (SKIP_ANY.some((re) => re.test(name))) { continue; }

		if (statSync(abs).isDirectory()) {
			collect(abs, acc);
			continue;
		}

		if (!rel.includes('/') && SKIP_FILES.has(name)) { continue; }

		acc.push(rel);
	}

	return acc;
};

const files = collect(ROOT).sort();

const missing = REQUIRED.filter((f) => !files.includes(f));
if (missing.length) {
	console.error('\nRefusing to build the zip - these are missing:');
	missing.forEach((f) => console.error('  ' + f));
	process.exit(1);
}

// The version the zip claims, read back from the header rather than assumed.
const header = readFileSync(join(ROOT, `${SLUG}.php`), 'utf8');
const version = (header.match(/^\s*\*\s*Version:\s*(.+)$/m) || [])[1]?.trim() ?? 'unknown';
const stable = (readFileSync(join(ROOT, 'readme.txt'), 'utf8').match(/^Stable tag:\s*(.+)$/m) || [])[1]?.trim();

if (stable && stable !== version) {
	console.warn(`\n  ! Version mismatch: plugin header ${version}, readme Stable tag ${stable}`);
}

if (existsSync(OUT)) { rmSync(OUT); }

const zip = new AdmZip();
// Everything sits under a folder named for the slug, which is what WordPress
// and Freemius expect to find inside a plugin zip.
files.forEach((rel) => zip.addLocalFile(join(ROOT, rel), `${SLUG}/${rel.split('/').slice(0, -1).join('/')}`));
writeFileSync(OUT, zip.toBuffer());

const byTop = {};
files.forEach((f) => {
	const k = f.includes('/') ? f.split('/')[0] + '/' : '(root)';
	byTop[k] = (byTop[k] || 0) + 1;
});

console.log(`\n  ${SLUG}.zip  v${version}  ${files.length} files  ${Math.round(statSync(OUT).size / 1024)} KB\n`);
Object.entries(byTop).sort().forEach(([k, n]) => console.log(`    ${String(n).padStart(4)}  ${k}`));
console.log('');
