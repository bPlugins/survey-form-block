import { countIdInContent, pickNewCopies } from '../surveyIds';

const saved = (...ids) => ids.map((id) => `<!-- wp:svb/survey-block {"form":{"bgColor":"#fff","id":"${id}","title":"T"},"fields":[{"id":"cvTd"}]} /-->`).join('\n');

describe('countIdInContent', () => {
	test('counts saved survey blocks carrying an id', () => {
		expect(countIdInContent(saved('3f2a9c1e-5b7d-', 'a1b2c3d4-e5f6-'), '3f2a9c1e-5b7d-')).toBe(1);
		expect(countIdInContent(saved('svb-form-csat-nps', 'svb-form-csat-nps'), 'svb-form-csat-nps')).toBe(2);
	});

	test('does not confuse a field id with the survey id', () => {
		expect(countIdInContent(saved('3f2a9c1e-5b7d-'), 'cvTd')).toBe(1);
		expect(countIdInContent(saved('3f2a9c1e-5b7d-'), 'nope')).toBe(0);
	});

	test('handles missing content or id', () => {
		expect(countIdInContent(null, 'x')).toBe(0);
		expect(countIdInContent('', 'x')).toBe(0);
		expect(countIdInContent(saved('x'), '')).toBe(0);
	});
});

describe('pickNewCopies', () => {
	const order = { original: 1, other: 2, copy: 7, copy2: 8 };
	const mountedAt = (clientId) => order[clientId];

	test('a block alone is never re-keyed', () => {
		expect(pickNewCopies({ group: ['original'], savedCount: 0, mountedAt })).toEqual([]);
	});

	test('a duplicate of a saved survey is re-keyed, the original is not', () => {
		expect(pickNewCopies({ group: ['original', 'copy'], savedCount: 1, mountedAt })).toEqual(['copy']);
		expect(pickNewCopies({ group: ['copy', 'original'], savedCount: 1, mountedAt })).toEqual(['copy']);
	});

	test('two blocks already saved with one id (built from one pattern) are both kept', () => {
		expect(pickNewCopies({ group: ['original', 'other'], savedCount: 2, mountedAt })).toEqual([]);
	});

	test('two fresh duplicates of one saved survey are both re-keyed', () => {
		expect(pickNewCopies({ group: ['original', 'copy', 'copy2'], savedCount: 1, mountedAt })).toEqual(['copy', 'copy2']);
	});

	test('in a post never saved, every block sharing the id gets a new one', () => {
		expect(pickNewCopies({ group: ['original', 'copy'], savedCount: 0, mountedAt }).sort()).toEqual(['copy', 'original']);
	});
});
