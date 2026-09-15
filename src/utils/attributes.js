/**
 * Attribute normalisation.
 *
 * WordPress fills in a *top-level* attribute default when a saved block omits
 * it, but it never merges into one. A block that stored
 *
 *     form: { bgColor: '#fff', title: 'Hi' }
 *
 * keeps exactly those two keys - `padding`, `titleMargin` and the rest simply do
 * not exist at render time. `Style.js` then hands `undefined` to helpers such as
 * `getBoxValue()`, which calls `Object.values()` on it and throws, taking the
 * whole survey down with a blank space where the form should be.
 *
 * Nothing guards against that today, which makes adding any sub-key to `form`,
 * `input`, `button` or `labelS` a breaking change for every survey saved before
 * that key existed. Normalising at render time removes the hazard without
 * rewriting anyone's stored content.
 */

import metadata from '../block.json';

const isPlainObject = value => Boolean(value) && 'object' === typeof value && !Array.isArray(value);

/** Recursively fills gaps in `saved` from `base`, preferring saved values. */
const mergeDeep = (base, saved) => {
	if (undefined === saved || null === saved) {
		return base;
	}

	if (!isPlainObject(base) || !isPlainObject(saved)) {
		return saved;
	}

	const out = { ...base };

	Object.keys(saved).forEach(key => {
		out[key] = isPlainObject(base[key]) && isPlainObject(saved[key])
			? mergeDeep(base[key], saved[key])
			: saved[key];
	});

	return out;
};

/** The default value of every attribute declared in block.json. */
const DEFAULTS = Object.keys(metadata.attributes).reduce((acc, key) => {
	acc[key] = metadata.attributes[key].default;
	return acc;
}, {});

/** Shape of a field, taken from the block's own default field. */
const FIELD_DEFAULT = (DEFAULTS.fields && DEFAULTS.fields[0]) || {};

/**
 * Returns a render-safe copy of the block attributes.
 *
 * Read-only: nothing is written back to the post, so a survey saved years ago
 * renders correctly without its stored content being touched.
 *
 * @param {Object} attributes Attributes as saved (possibly partial).
 * @return {Object} Attributes with every declared key present.
 */
export const withAttributeDefaults = (attributes) => {
	const saved = isPlainObject(attributes) ? attributes : {};
	const safe = { ...saved };

	Object.keys(DEFAULTS).forEach(key => {
		const base = DEFAULTS[key];

		if (isPlainObject(base)) {
			safe[key] = mergeDeep(base, saved[key]);
			return;
		}

		if (undefined === saved[key] || null === saved[key]) {
			safe[key] = base;
		}
	});

	// Fields are the one array that gets read key-by-key while rendering.
	safe.fields = Array.isArray(saved.fields)
		? saved.fields.map(field => mergeDeep(FIELD_DEFAULT, field))
		: (DEFAULTS.fields || []);

	return safe;
};

export default withAttributeDefaults;
