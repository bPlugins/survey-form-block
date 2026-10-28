/**
 * Answer helpers shared by the form, the field components and their tests.
 *
 * Kept free of React and WordPress imports so the rules can be unit tested
 * on their own.
 */

/**
 * Whether a field holds an answer that satisfies "required".
 *
 * The old check was `!formData[id]`, which treated a legitimate 0 as
 * unanswered - so a required NPS question rejected the harshest detractors -
 * and treated an emptied checkbox group (`[]`) as answered.
 *
 * @param {Object} field Field definition (needs `type`).
 * @param {*}      value Current answer.
 * @return {boolean} True when the answer counts.
 */
export const isAnswered = (field, value) => {
	switch (field?.type) {
		// A required switch means "must be switched on".
		case 'toggle':
			return true === value;

		// Clicking the selected star again clears the rating back to 0.
		case 'star_rating':
			return Number(value) > 0;

		default:
			if (undefined === value || null === value) {
				return false;
			}

			if (Array.isArray(value)) {
				return value.length > 0;
			}

			if ('string' === typeof value) {
				return '' !== value.trim();
			}

			// Numbers (0 included) and booleans are real answers.
			return true;
	}
};

/**
 * The year range every date question shipped with until 1.2.0.
 *
 * It was a default, not a choice: new questions got it automatically, and it
 * stopped at 2023, so visitors could not pick a current or future date. A
 * question still carrying exactly this pair is treated as unbounded.
 */
const LEGACY_YEAR_RANGE = ['1990', '2023'];

/**
 * Turns a date question's First Year / Last Year settings into the `min` and
 * `max` of a native date input.
 *
 * @param {string|number} start First allowed year, or empty for no limit.
 * @param {string|number} end   Last allowed year, or empty for no limit.
 * @return {{min: string, max: string}} ISO dates, or empty strings.
 */
export const dateBounds = (start, end) => {
	const first = String(start ?? '').trim();
	const last = String(end ?? '').trim();

	if (LEGACY_YEAR_RANGE[0] === first && LEGACY_YEAR_RANGE[1] === last) {
		return { min: '', max: '' };
	}

	const isYear = (year) => /^\d{4}$/.test(year);

	return {
		min: isYear(first) ? `${first}-01-01` : '',
		max: isYear(last) ? `${last}-12-31` : ''
	};
};

/**
 * Keeps only a well-formed ISO date (YYYY-MM-DD) for a date input's value.
 *
 * Answers stored before 1.2.0 read like "12 March, 2024"; a native date input
 * cannot show those, so they start empty rather than throwing.
 *
 * @param {*} value Current answer.
 * @return {string} The ISO date, or an empty string.
 */
export const isoDateOrEmpty = (value) => ('string' === typeof value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '');
