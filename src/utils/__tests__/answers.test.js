import { isAnswered, dateBounds, isoDateOrEmpty } from '../answers';

describe('isAnswered', () => {
	test('a 0 on an NPS question is an answer (F1)', () => {
		expect(isAnswered({ type: 'nps' }, 0)).toBe(true);
	});

	test('a 0 on a range slider or number is an answer', () => {
		expect(isAnswered({ type: 'range_slider' }, 0)).toBe(true);
		expect(isAnswered({ type: 'number' }, '0')).toBe(true);
	});

	test('an untouched or cleared field is not answered', () => {
		expect(isAnswered({ type: 'nps' }, undefined)).toBe(false);
		expect(isAnswered({ type: 'nps' }, '')).toBe(false);
		expect(isAnswered({ type: 'text' }, null)).toBe(false);
	});

	test('whitespace-only text is not an answer', () => {
		expect(isAnswered({ type: 'text' }, '   ')).toBe(false);
		expect(isAnswered({ type: 'paragraph' }, 'Fine')).toBe(true);
	});

	test('an emptied checkbox group is not answered', () => {
		expect(isAnswered({ type: 'checkbox' }, [])).toBe(false);
		expect(isAnswered({ type: 'checkbox' }, ['a'])).toBe(true);
	});

	test('a required switch must be on', () => {
		expect(isAnswered({ type: 'toggle' }, true)).toBe(true);
		expect(isAnswered({ type: 'toggle' }, false)).toBe(false);
		expect(isAnswered({ type: 'toggle' }, '')).toBe(false);
	});

	test('a cleared star rating (0) is not answered', () => {
		expect(isAnswered({ type: 'star_rating' }, 0)).toBe(false);
		expect(isAnswered({ type: 'star_rating' }, 3)).toBe(true);
	});

	test('an ISO date is an answer', () => {
		expect(isAnswered({ type: 'date' }, '2026-10-28')).toBe(true);
	});
});

describe('dateBounds', () => {
	test('the legacy 1990-2023 default means no limit (F4)', () => {
		expect(dateBounds('1990', '2023')).toEqual({ min: '', max: '' });
	});

	test('a real range becomes ISO min and max', () => {
		expect(dateBounds('2020', '2030')).toEqual({ min: '2020-01-01', max: '2030-12-31' });
		expect(dateBounds(2020, 2030)).toEqual({ min: '2020-01-01', max: '2030-12-31' });
	});

	test('blank or malformed years mean no limit on that side', () => {
		expect(dateBounds('', '')).toEqual({ min: '', max: '' });
		expect(dateBounds('19', 'next year')).toEqual({ min: '', max: '' });
		expect(dateBounds('1990', '')).toEqual({ min: '1990-01-01', max: '' });
		expect(dateBounds(undefined, null)).toEqual({ min: '', max: '' });
	});
});

describe('isoDateOrEmpty', () => {
	test('keeps a well-formed ISO date', () => {
		expect(isoDateOrEmpty('2026-10-28')).toBe('2026-10-28');
	});

	test('drops answers saved in the old format, and partial values (F3)', () => {
		expect(isoDateOrEmpty('12 March, 2024')).toBe('');
		expect(isoDateOrEmpty('undefined March, undefined')).toBe('');
		expect(isoDateOrEmpty(undefined)).toBe('');
	});
});
