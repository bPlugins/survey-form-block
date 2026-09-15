import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';

import ConfirmDialog from './ConfirmDialog';

/**
 * Submissions list.
 *
 * Search, sorting and paging used to come from DataTables (95 KB of JS plus
 * jQuery plus a 363 KB runtime Tailwind compiler for the styling). All three are
 * gone; the same behaviour is a few dozen lines of React over data we already
 * have in memory.
 */

const PER_PAGE_CHOICES = [10, 25, 50, 100];

/** Renders one answer, which may be a string, a number or a multi-select array. */
const formatAnswer = (value) => {
	if (Array.isArray(value)) {
		return value.join(', ');
	}

	// Responses stored before 1.1 kept switch answers as raw booleans.
	if ('boolean' === typeof value) {
		return value ? __('Yes', 'survey-form-block') : __('No', 'survey-form-block');
	}

	if (null === value || undefined === value || '' === value) {
		return '';
	}

	return String(value);
};

const formatDate = (value) => {
	if (!value) {
		return '';
	}

	// Stored as "Y-m-d H:i:s" in site time; shown as-is rather than letting the
	// browser reinterpret it in the viewer's timezone.
	const [day, time] = value.slice(0, 19).split(' ');

	return { day, time: time || '' };
};

/** The same timestamp as one string, for searching and sorting. */
const dateText = (value) => (value ? value.slice(0, 19) : '');

/**
 * Inline icons.
 *
 * Small enough that a sprite or an icon package would cost more than it saves,
 * and inlining keeps them tintable with currentColor.
 */
const Icon = ({ d, size = 15 }) => (
	<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
		<path fill="currentColor" d={d} />
	</svg>
);

const PATHS = {
	refresh: 'M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
	search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
	edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
	trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
	check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
	close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
	left: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
	right: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
	info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
	tick: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
	alert: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
	inbox: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 12h-4a3 3 0 0 1-6 0H5V5h14v10z'
};

const SortIcon = ({ dir }) => (
	<span className={`svbSort ${'asc' === dir ? 'isAsc' : ''} ${'desc' === dir ? 'isDesc' : ''}`} aria-hidden="true">
		<svg viewBox="0 0 8 13" width="8" height="13">
			<path className="svbSortUp" fill="currentColor" d="M4 0l3.5 4.5h-7z" />
			<path className="svbSortDown" fill="currentColor" d="M4 13L.5 8.5h7z" />
		</svg>
	</span>
);

const post = (action, body) => {
	const fd = new FormData();
	fd.append('action', action);
	fd.append('nonce', window.svbData?.nonce || '');

	Object.keys(body).forEach(key => {
		const value = body[key];

		if (Array.isArray(value)) {
			value.forEach(v => fd.append(`${key}[]`, v));
		} else {
			fd.append(key, value);
		}
	});

	return fetch(window.svbData?.ajaxUrl, { method: 'POST', credentials: 'same-origin', body: fd })
		.then(r => r.json());
};

const Table = () => {
	const [response, setResponse] = useState(null);
	const [error, setError] = useState('');
	const [notice, setNotice] = useState(null);
	const [busy, setBusy] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [currentForm, setCurrentForm] = useState('');
	const [query, setQuery] = useState('');
	const [sort, setSort] = useState({ key: '__date', dir: 'desc' });
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(25);
	const [selected, setSelected] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [draft, setDraft] = useState({});
	const [pendingDelete, setPendingDelete] = useState(null);

	// A refresh can still be in flight when the screen goes away. A ref rather
	// than a per-effect flag lets every caller of loadResponses share one check.
	const alive = useRef(true);

	useEffect(() => {
		alive.current = true;

		return () => { alive.current = false; };
	}, []);

	/**
	 * Fetches every submission.
	 *
	 * `isRefresh` separates the two failure modes. On first load there is nothing
	 * on screen yet, so a failure replaces the whole view; on a manual refresh the
	 * table already shown is still valid, so the failure becomes a notice and the
	 * existing data stays put.
	 */
	const loadResponses = useCallback((isRefresh = false) => {
		if (isRefresh) {
			setRefreshing(true);
			setNotice(null);
		}

		return fetch(`${window.svbData?.ajaxUrl}?action=svb_get_all_data&nonce=${window.svbData?.nonce}`, {
			credentials: 'same-origin'
		})
			.then(res => res.json())
			.then(res => {
				if (!alive.current) {
					return;
				}

				if (!res?.success) {
					if (isRefresh) {
						setNotice({ type: 'error', text: __('Could not refresh the responses. Please try again.', 'survey-form-block') });
					} else {
						setError(__('Could not load submissions. Please reload the page.', 'survey-form-block'));
					}

					return;
				}

				const list = res.data?.columns || [];

				setResponse(res.data);

				// Stay on the survey being viewed. Falling back to the first form
				// would move the operator somewhere else on every refresh.
				setCurrentForm(prev => (list.some(item => item.form_id === prev) ? prev : (list[0]?.form_id || '')));

				// Rows deleted elsewhere must not stay selected, or a later bulk
				// delete would name a count that includes them.
				const ids = new Set((res.data?.data || []).map(item => String(item.id)));
				setSelected(prev => prev.filter(id => ids.has(id)));

				if (isRefresh) {
					setNotice({ type: 'ok', text: __('Responses refreshed.', 'survey-form-block') });
				}
			})
			.catch(() => {
				if (!alive.current) {
					return;
				}

				if (isRefresh) {
					setNotice({ type: 'error', text: __('Could not reach the server. Please try again.', 'survey-form-block') });
				} else {
					setError(__('Could not reach the server. Please reload the page.', 'survey-form-block'));
				}
			})
			.finally(() => {
				if (alive.current && isRefresh) {
					setRefreshing(false);
				}
			});
	}, []);

	useEffect(() => { loadResponses(); }, [loadResponses]);

	// Reset paging and any in-progress selection whenever the view changes.
	useEffect(() => {
		setPage(1);
		setSelected([]);
		setEditingId(null);
	}, [currentForm, query, perPage]);

	const forms = response?.columns || [];
	const columns = useMemo(
		() => forms.find(item => item.form_id === currentForm)?.columns || {},
		[forms, currentForm]
	);

	const rows = useMemo(() => {
		const all = (response?.data || []).filter(item => item.form_id === currentForm);

		return all.map(item => ({
			__date: item.created_at,
			__id: String(item.id),
			answers: item.data || {}
		}));
	}, [response, currentForm]);

	const filtered = useMemo(() => {
		const needle = query.trim().toLowerCase();

		if (!needle) {
			return rows;
		}

		return rows.filter(row =>
			Object.keys(columns).some(key => formatAnswer(row.answers[key]).toLowerCase().includes(needle))
			|| dateText(row.__date).toLowerCase().includes(needle)
		);
	}, [rows, columns, query]);

	const sorted = useMemo(() => {
		const out = [...filtered];
		const { key, dir } = sort;

		out.sort((a, b) => {
			const av = '__date' === key ? a.__date : formatAnswer(a.answers[key]);
			const bv = '__date' === key ? b.__date : formatAnswer(b.answers[key]);

			const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });

			return 'desc' === dir ? -cmp : cmp;
		});

		return out;
	}, [filtered, sort]);

	const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
	const safePage = Math.min(page, totalPages);
	const visible = sorted.slice((safePage - 1) * perPage, safePage * perPage);

	const toggleSort = (key) => setSort(prev => ({
		key,
		dir: prev.key === key && 'asc' === prev.dir ? 'desc' : 'asc'
	}));

	/** Drops rows from local state after the server confirms the delete. */
	const forgetRows = (ids) => {
		setResponse(prev => ({
			...prev,
			data: (prev.data || []).filter(d => !ids.includes(String(d.id))),
			total: Math.max(0, (prev.total || 0) - ids.length)
		}));
		setSelected(prev => prev.filter(id => !ids.includes(id)));
	};

	/** Asks first; the work happens in confirmDelete(). */
	const requestDelete = (ids) => {
		if (!ids.length || busy) {
			return;
		}

		setPendingDelete(ids);
	};

	const confirmDelete = () => {
		const ids = pendingDelete || [];

		if (!ids.length) {
			return;
		}

		setBusy(true);
		setNotice(null);

		post('svb_delete_responses', { ids })
			.then(res => {
				if (!res?.success) {
					setNotice({ type: 'error', text: res?.data || __('The responses could not be deleted.', 'survey-form-block') });
					return;
				}

				forgetRows(ids);
				setNotice({
					type: 'ok',
					text: sprintf(
						/* translators: %d: number of responses deleted. */
						__('%d response(s) deleted.', 'survey-form-block'),
						res.data.deleted
					)
				});
			})
			.catch(() => setNotice({ type: 'error', text: __('Could not reach the server.', 'survey-form-block') }))
			.finally(() => { setBusy(false); setPendingDelete(null); });
	};

	const startEdit = (row) => {
		const next = {};
		Object.keys(columns).forEach(key => { next[key] = formatAnswer(row.answers[key]); });
		setDraft(next);
		setEditingId(row.__id);
		setNotice(null);
	};

	const saveEdit = () => {
		if (busy || !editingId) {
			return;
		}

		setBusy(true);

		post('svb_update_response', { id: editingId, answers: JSON.stringify(draft) })
			.then(res => {
				if (!res?.success) {
					setNotice({ type: 'error', text: res?.data || __('The response could not be saved.', 'survey-form-block') });
					return;
				}

				setResponse(prev => ({
					...prev,
					data: (prev.data || []).map(d => String(d.id) === editingId
						? { ...d, data: { ...d.data, ...draft } }
						: d)
				}));
				setEditingId(null);
				setNotice({ type: 'ok', text: __('Response updated.', 'survey-form-block') });
			})
			.catch(() => setNotice({ type: 'error', text: __('Could not reach the server.', 'survey-form-block') }))
			.finally(() => setBusy(false));
	};

	const allVisibleSelected = visible.length > 0 && visible.every(r => selected.includes(r.__id));

	const toggleSelectAll = () => setSelected(prev => allVisibleSelected
		? prev.filter(id => !visible.some(r => r.__id === id))
		: [...new Set([...prev, ...visible.map(r => r.__id)])]);

	if (error) {
		return <div className="svbAdmin">
			<div className="svbPanel">
				<div className="svbNotice isError">
					<Icon d={PATHS.alert} size={16} />
					{error}
				</div>
			</div>
		</div>;
	}

	if (!response) {
		return <div className="svbAdmin">
			<div className="svbPanel">
				<div className="svbLoading">
					<Icon d={PATHS.refresh} size={18} />
					{__('Loading submissions…', 'survey-form-block')}
				</div>
			</div>
		</div>;
	}

	if (!forms.length) {
		return <div className="svbAdmin">
			<div className="svbPanel">
				<div className="svbEmpty">
					<span className="svbEmptyIcon"><Icon d={PATHS.inbox} size={24} /></span>
					<h2>{__('No surveys yet', 'survey-form-block')}</h2>
					<p>{__('Add a Survey Form Block to a page and publish it. Responses will appear here.', 'survey-form-block')}</p>
				</div>
			</div>
		</div>;
	}

	const truncated = response.total > (response.data || []).length;
	const columnKeys = Object.keys(columns);

	return <div className={`svbAdmin ${busy ? 'isBusy' : ''}`}>
		<div className="svbPanel">
			<div className="svbToolbar">
				<div className="svbField">
					<label htmlFor="svbFormSelect">{__('Survey', 'survey-form-block')}</label>
					<select id="svbFormSelect" value={currentForm} onChange={e => setCurrentForm(e.target.value)}>
						{forms.map(form => (
							<option key={form.form_id} value={form.form_id}>
								{form.form_name || form.form_id}
							</option>
						))}
					</select>
				</div>

				<div className="svbField">
					<label htmlFor="svbSearch">{__('Search', 'survey-form-block')}</label>
					<span className="svbSearch">
						<Icon d={PATHS.search} size={14} />
						<input
							id="svbSearch"
							type="search"
							value={query}
							placeholder={__('Filter responses…', 'survey-form-block')}
							onChange={e => setQuery(e.target.value)}
						/>
					</span>
				</div>

				<div className="svbField">
					<label htmlFor="svbPerPage">{__('Per page', 'survey-form-block')}</label>
					<select id="svbPerPage" value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
						{PER_PAGE_CHOICES.map(n => <option key={n} value={n}>{n}</option>)}
					</select>
				</div>

				<p className="svbCount">
					{sprintf(
						/* translators: %d: number of responses. */
						__('%d responses', 'survey-form-block'),
						sorted.length
					)}
				</p>

				<button
					type="button"
					className={`svbRefresh ${refreshing ? 'isBusy' : ''}`}
					onClick={() => loadResponses(true)}
					disabled={busy || refreshing}
				>
					<Icon d={PATHS.refresh} />
					{refreshing ? __('Refreshing…', 'survey-form-block') : __('Refresh', 'survey-form-block')}
				</button>
			</div>

			{selected.length > 0 && (
				<div className="svbBulkBar">
					<span>
						{sprintf(
							/* translators: %d: number selected. */
							__('%d selected', 'survey-form-block'),
							selected.length
						)}
					</span>

					<button type="button" className="svbDanger" disabled={busy} onClick={() => requestDelete(selected)}>
						<Icon d={PATHS.trash} size={14} />
						{__('Delete selected', 'survey-form-block')}
					</button>

					<button type="button" onClick={() => setSelected([])}>
						<Icon d={PATHS.close} size={14} />
						{__('Clear', 'survey-form-block')}
					</button>
				</div>
			)}

			{notice && (
				<div className={`svbNotice ${'error' === notice.type ? 'isError' : 'isOk'}`} role="status">
					<Icon d={'error' === notice.type ? PATHS.alert : PATHS.tick} size={16} />
					{notice.text}
				</div>
			)}

			{truncated && (
				<div className="svbNotice">
					<Icon d={PATHS.info} size={16} />
					{sprintf(
						/* translators: 1: rows loaded, 2: total stored. */
						__('Showing the %1$d most recent of %2$d stored responses.', 'survey-form-block'),
						(response.data || []).length,
						response.total
					)}
				</div>
			)}

			{!columnKeys.length ? (
				<div className="svbEmpty">
					<span className="svbEmptyIcon"><Icon d={PATHS.inbox} size={24} /></span>
					<h2>{__('No fields recorded', 'survey-form-block')}</h2>
					<p>{__('Open the page containing this survey and save it once so its fields are registered.', 'survey-form-block')}</p>
				</div>
			) : !visible.length ? (
				<div className="svbEmpty">
					<span className="svbEmptyIcon"><Icon d={query ? PATHS.search : PATHS.inbox} size={24} /></span>
					<h2>{query ? __('No matches', 'survey-form-block') : __('No responses yet', 'survey-form-block')}</h2>
					<p>{query
						? __('Try a different search term.', 'survey-form-block')
						: __('Responses to this survey will show up here as they come in.', 'survey-form-block')}</p>
				</div>
			) : (
				<>
					<div className="svbTableScroll">
						<table className="svbTable">
							<thead>
								<tr>
									<th scope="col" className="svbCheck">
										<input
											type="checkbox"
											checked={allVisibleSelected}
											onChange={toggleSelectAll}
											aria-label={__('Select all responses on this page', 'survey-form-block')}
										/>
									</th>

									{columnKeys.map(key => (
										<th key={key} scope="col">
											<button type="button" onClick={() => toggleSort(key)}>
												{columns[key]}
												<SortIcon dir={sort.key === key ? sort.dir : ''} />
											</button>
										</th>
									))}

									<th scope="col" className="svbDate">
										<button type="button" onClick={() => toggleSort('__date')}>
											{__('Submitted', 'survey-form-block')}
											<SortIcon dir={'__date' === sort.key ? sort.dir : ''} />
										</button>
									</th>

									<th scope="col" className="svbActions">{__('Actions', 'survey-form-block')}</th>
								</tr>
							</thead>

							<tbody>
								{visible.map((row) => {
									const isEditing = editingId === row.__id;
									const submitted = formatDate(row.__date);

									return <tr key={row.__id} className={isEditing ? 'isEditing' : ''}>
										<td className="svbCheck">
											<input
												type="checkbox"
												checked={selected.includes(row.__id)}
												onChange={() => setSelected(prev => prev.includes(row.__id)
													? prev.filter(id => id !== row.__id)
													: [...prev, row.__id])}
												aria-label={__('Select response', 'survey-form-block')}
											/>
										</td>

										{columnKeys.map(key => {
											const answer = formatAnswer(row.answers[key]);

											return <td key={key}>
												{isEditing ? (
													<textarea
														className="svbEditInput"
														rows={1}
														value={draft[key] ?? ''}
														aria-label={columns[key]}
														onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
													/>
												) : (
													// A dash reads as "asked, not answered"; an empty
													// cell reads as a rendering fault.
													answer || <span className="svbDash" aria-hidden="true">&mdash;</span>
												)}
											</td>;
										})}

										<td className="svbDate">
											<span className="svbDay">{submitted.day}</span>
											<span className="svbTime">{submitted.time}</span>
										</td>

										<td className="svbActions">
											{isEditing ? (
												<>
													<button type="button" className="svbPrimary" disabled={busy} onClick={saveEdit}>
														<Icon d={PATHS.check} size={14} />
														{__('Save', 'survey-form-block')}
													</button>
													<button type="button" disabled={busy} onClick={() => setEditingId(null)}>
														<Icon d={PATHS.close} size={14} />
														{__('Cancel', 'survey-form-block')}
													</button>
												</>
											) : (
												<>
													<button type="button" disabled={busy} onClick={() => startEdit(row)}>
														<Icon d={PATHS.edit} size={13} />
														{__('Edit', 'survey-form-block')}
													</button>
													<button type="button" className="svbLinkDanger" disabled={busy} onClick={() => requestDelete([row.__id])}>
														<Icon d={PATHS.trash} size={13} />
														{__('Delete', 'survey-form-block')}
													</button>
												</>
											)}
										</td>
									</tr>;
								})}
							</tbody>
						</table>
					</div>

					{totalPages > 1 && (
						<div className="svbPager">
							<button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}>
								<Icon d={PATHS.left} size={14} />
								{__('Previous', 'survey-form-block')}
							</button>

							<span>
								{sprintf(
									/* translators: 1: current page, 2: total pages. */
									__('Page %1$d of %2$d', 'survey-form-block'),
									safePage,
									totalPages
								)}
							</span>

							<button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>
								{__('Next', 'survey-form-block')}
								<Icon d={PATHS.right} size={14} />
							</button>
						</div>
					)}
				</>
			)}
		</div>

		<ConfirmDialog
			open={Boolean(pendingDelete)}
			title={1 === pendingDelete?.length
				? __('Delete response', 'survey-form-block')
				: __('Delete responses', 'survey-form-block')}
			message={1 === pendingDelete?.length
				? __('This response will be permanently removed. This cannot be undone.', 'survey-form-block')
				: sprintf(
					/* translators: %d: number of responses. */
					__('%d responses will be permanently removed. This cannot be undone.', 'survey-form-block'),
					pendingDelete?.length || 0
				)}
			confirmLabel={__('Delete', 'survey-form-block')}
			busy={busy}
			onConfirm={confirmDelete}
			onCancel={() => setPendingDelete(null)}
		/>
	</div>;
};

export default Table;
