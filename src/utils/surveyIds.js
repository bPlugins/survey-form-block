/**
 * Survey identity in the editor.
 *
 * A survey's responses are filed under its `form.id`. Duplicating a block, or
 * pasting a copy into the same post, copies that id too, so both blocks
 * silently wrote into one set of responses. These helpers decide which blocks
 * in a group sharing an id are the new copies and need an id of their own.
 *
 * The one rule they never break: an id that already exists in the post's
 * saved content keeps its block. Re-keying a published survey would split its
 * history in two.
 */

/**
 * Counts how many saved survey blocks carry `id` in a post's raw content.
 *
 * Block comments store the form attribute as JSON, so the id appears as
 * `"id":"<id>"`. Survey ids are hex and dashes (or the old pattern slugs),
 * which serialize without escaping.
 *
 * @param {string} content Raw post content.
 * @param {string} id      Survey id.
 * @return {number} Occurrences.
 */
export const countIdInContent = (content, id) => {
	if ('string' !== typeof content || !id) {
		return 0;
	}

	const needle = `"id":"${id}"`;
	let count = 0;
	let at = content.indexOf(needle);

	while (-1 !== at) {
		count++;
		at = content.indexOf(needle, at + needle.length);
	}

	return count;
};

/**
 * Picks the blocks in a same-id group that are new copies.
 *
 * Blocks mount in document order when the editor opens, and a duplicate
 * mounts later, when it is created; so among the group, the latest-mounted
 * blocks beyond the number already saved are the copies.
 *
 * @param {Object}   args
 * @param {string[]} args.group      Client ids of every block sharing the id.
 * @param {number}   args.savedCount How many blocks with this id are saved.
 * @param {Function} args.mountedAt  clientId => mount sequence number.
 * @return {string[]} Client ids that should get a new survey id.
 */
export const pickNewCopies = ({ group, savedCount, mountedAt }) => {
	const extra = group.length - Math.max(0, savedCount);

	if (group.length < 2 || extra <= 0) {
		return [];
	}

	return [...group]
		.sort((a, b) => (mountedAt(a) ?? 0) - (mountedAt(b) ?? 0))
		.slice(-extra);
};
