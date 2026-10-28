import { useEffect, useState } from 'react';
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Results summary for one survey.
 *
 * The numbers come from the server (includes/Reports.php), computed over every
 * stored response rather than the newest few hundred the Responses view loads,
 * so an NPS here is the survey's NPS and not a sample of it. Bars are plain
 * CSS: a chart library would outweigh the rest of this screen.
 */

const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });

const percent = (count, of) => (of ? Math.round(count / of * 100) : 0);

/** NPS reads -100 to +100; the sign is part of the number. */
const signed = (score) => (null === score ? '—' : `${score > 0 ? '+' : ''}${score}`);

const day = (value) => (value ? value.slice(0, 10) : '');

/** Horizontal bars, one per option or rating. */
const Bars = ({ items, of }) => <ul className="svbBars">
	{items.map((item, i) => {
		const share = percent(item.count, of);

		return <li key={i}>
			<span className="svbBarLabel" title={item.label}>{item.label}</span>
			<span className="svbBarTrack" aria-hidden="true">
				<span className="svbBarFill" style={{ width: `${share}%` }} />
			</span>
			<span className="svbBarValue">{`${number.format(item.count)} · ${share}%`}</span>
		</li>;
	})}
</ul>;

/** Vertical columns for a fixed numeric scale (NPS 0-10, opinion 1-10). */
const Columns = ({ items, label }) => {
	const peak = Math.max(1, ...items.map(item => item.count));

	return <ul className="svbColumns" aria-label={label}>
		{items.map(item => (
			<li key={item.value} title={sprintf(
				/* translators: 1: scale point, 2: number of answers. */
				_n('%1$s: %2$d answer', '%1$s: %2$d answers', item.count, 'survey-form-block'),
				item.value,
				item.count
			)}>
				<span className="svbColumnTrack" aria-hidden="true">
					<span className="svbColumnFill" style={{ height: `${item.count / peak * 100}%` }} />
				</span>
				<span className="svbColumnValue" aria-hidden="true">{item.value}</span>
				<span className="screen-reader-text">
					{sprintf(
						/* translators: 1: scale point, 2: number of answers. */
						_n('%1$s: %2$d answer', '%1$s: %2$d answers', item.count, 'survey-form-block'),
						item.value,
						item.count
					)}
				</span>
			</li>
		))}
	</ul>;
};

const Stat = ({ value, label, className = '' }) => <div className={`svbStat ${className}`}>
	<strong>{value}</strong>
	<span>{label}</span>
</div>;

const NpsBody = ({ q }) => {
	const parts = [
		{ key: 'Promoters', label: __('Promoters (9–10)', 'survey-form-block'), count: q.promoters },
		{ key: 'Passives', label: __('Passives (7–8)', 'survey-form-block'), count: q.passives },
		{ key: 'Detractors', label: __('Detractors (0–6)', 'survey-form-block'), count: q.detractors }
	];

	return <>
		<div className="svbStats">
			<Stat value={signed(q.score)} label={__('Net Promoter Score', 'survey-form-block')} />
		</div>

		<div className="svbStack" aria-hidden="true">
			{parts.map(part => (
				<span key={part.key} className={`is${part.key}`} style={{ width: `${percent(part.count, q.answered)}%` }} />
			))}
		</div>

		<ul className="svbLegend">
			{parts.map(part => (
				<li key={part.key} className={`is${part.key}`}>
					<i aria-hidden="true" />
					{part.label}
					<b>{`${percent(part.count, q.answered)}%`}</b>
					<span>{`(${number.format(part.count)})`}</span>
				</li>
			))}
		</ul>

		<Columns items={q.distribution} label={__('Scores', 'survey-form-block')} />
	</>;
};

const StarsBody = ({ q }) => <>
	<div className="svbStats">
		<Stat
			value={null === q.average ? '—' : `${number.format(q.average)} / ${q.max}`}
			label={__('Average rating', 'survey-form-block')}
		/>
		<Stat
			value={null === q.csat ? '—' : `${q.csat}%`}
			label={sprintf(
				/* translators: 1: second-highest rating, 2: highest rating. */
				__('CSAT (%1$d–%2$d stars)', 'survey-form-block'),
				Math.max(1, q.max - 1),
				q.max
			)}
		/>
	</div>

	<Bars
		of={q.answered}
		items={[...q.distribution].reverse().map(item => ({
			label: sprintf(
				/* translators: %d: number of stars. */
				_n('%d star', '%d stars', item.value, 'survey-form-block'),
				item.value
			),
			count: item.count
		}))}
	/>
</>;

const ScaleBody = ({ q }) => <>
	<div className="svbStats">
		<Stat value={null === q.average ? '—' : `${number.format(q.average)} / 10`} label={__('Average', 'survey-form-block')} />
	</div>

	<Columns items={q.distribution} label={__('Answers per point', 'survey-form-block')} />
</>;

const NumbersBody = ({ q }) => <div className="svbStats">
	<Stat value={null === q.average ? '—' : number.format(q.average)} label={__('Average', 'survey-form-block')} />
	<Stat value={null === q.min ? '—' : number.format(q.min)} label={__('Lowest', 'survey-form-block')} />
	<Stat value={null === q.max ? '—' : number.format(q.max)} label={__('Highest', 'survey-form-block')} />
</div>;

const TextBody = ({ q, onShowResponses }) => {
	if (!q.latest.length) {
		return null;
	}

	return <>
		<ul className="svbQuotes">
			{q.latest.map((text, i) => <li key={i}>{text}</li>)}
		</ul>

		{q.answered > q.latest.length && (
			<p className="svbCardNote">
				{sprintf(
					/* translators: 1: answers shown, 2: answers in total. */
					__('The %1$d newest of %2$d answers.', 'survey-form-block'),
					q.latest.length,
					q.answered
				)}
				{' '}
				<button type="button" className="svbLinkButton" onClick={onShowResponses}>
					{__('See them all', 'survey-form-block')}
				</button>
			</p>
		)}
	</>;
};

const QuestionCard = ({ q, total, onShowResponses }) => {
	const body = (() => {
		switch (q.kind) {
			case 'nps':
				return <NpsBody q={q} />;
			case 'stars':
				return <StarsBody q={q} />;
			case 'scale':
				return <ScaleBody q={q} />;
			case 'numbers':
				return <NumbersBody q={q} />;
			case 'choice':
				return <Bars items={q.options} of={q.answered} />;
			case 'multi':
				return <>
					<Bars items={q.options} of={q.answered} />
					<p className="svbCardNote">{__('People could pick more than one, so shares can add up to more than 100%.', 'survey-form-block')}</p>
				</>;
			case 'text':
				return <TextBody q={q} onShowResponses={onShowResponses} />;
			default:
				return null;
		}
	})();

	return <section className={`svbCard is-${q.kind}`}>
		<header>
			<h3>{q.label}</h3>
			<p>
				{sprintf(
					/* translators: 1: people who answered, 2: responses in total. */
					__('%1$d of %2$d answered', 'survey-form-block'),
					q.answered,
					total
				)}
			</p>
		</header>

		{q.answered > 0 && body}
	</section>;
};

const Summary = ({ formId, token, onShowResponses }) => {
	const [state, setState] = useState({ status: 'loading', data: null });

	useEffect(() => {
		if (!formId) {
			return undefined;
		}

		const controller = new AbortController();
		const params = new URLSearchParams({ action: 'svb_get_summary', nonce: window.svbData?.nonce || '', form_id: formId });

		// Keep the last summary on screen during a refresh of the same survey.
		setState(prev => ({ status: 'loading', data: prev.data?.formId === formId ? prev.data : null }));

		fetch(`${window.svbData?.ajaxUrl}?${params}`, { credentials: 'same-origin', signal: controller.signal })
			.then(res => res.json())
			.then(res => {
				if (!res?.success) {
					setState({ status: 'error', data: null, message: 'string' === typeof res?.data ? res.data : '' });
					return;
				}

				setState({ status: 'ready', data: { ...res.data, formId } });
			})
			.catch(error => {
				if ('AbortError' !== error?.name) {
					setState({ status: 'error', data: null, message: '' });
				}
			});

		return () => controller.abort();
	}, [formId, token]);

	const { status, data } = state;

	if ('error' === status) {
		return <div className="svbNotice isError" role="alert">
			{state.message || __('Could not load the summary. Please try again.', 'survey-form-block')}
		</div>;
	}

	if (!data) {
		return <div className="svbLoading">{__('Adding up the responses…', 'survey-form-block')}</div>;
	}

	if (!data.total) {
		return <div className="svbEmpty">
			<h2>{__('No responses yet', 'survey-form-block')}</h2>
			<p>{__('The summary fills in as responses arrive.', 'survey-form-block')}</p>
		</div>;
	}

	const nps = data.questions.find(q => 'nps' === q.kind && null !== q.score);
	const stars = data.questions.find(q => 'stars' === q.kind && null !== q.csat);

	return <div className={`svbSummary ${'loading' === status ? 'isRefreshing' : ''}`} aria-busy={'loading' === status}>
		<div className="svbOverview">
			<Stat
				value={number.format(data.total)}
				label={_n('Response', 'Responses', data.total, 'survey-form-block')}
			/>
			{nps && <Stat value={signed(nps.score)} label={__('NPS', 'survey-form-block')} />}
			{stars && <Stat value={`${stars.csat}%`} label={__('CSAT', 'survey-form-block')} />}
			<Stat
				className="isMeta"
				value={day(data.first) === day(data.last) ? day(data.last) : `${day(data.first)} – ${day(data.last)}`}
				label={__('Collected', 'survey-form-block')}
			/>
		</div>

		{!data.hasSchema && (
			<div className="svbNotice">
				{__('This survey is not on any page or post any more, so its question types are unknown. Only answer counts are shown.', 'survey-form-block')}
			</div>
		)}

		{!data.questions.length ? (
			<div className="svbEmpty">
				<h2>{__('No questions recorded', 'survey-form-block')}</h2>
				<p>{__('Open the page containing this survey and update it once so its questions are registered.', 'survey-form-block')}</p>
			</div>
		) : (
			<div className="svbCards">
				{data.questions.map(q => (
					<QuestionCard key={q.id} q={q} total={data.total} onShowResponses={onShowResponses} />
				))}
			</div>
		)}
	</div>;
};

export default Summary;
