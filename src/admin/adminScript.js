import { createRoot } from 'react-dom/client';

import './admin.scss';
import Table from './Components/Table';

document.addEventListener('DOMContentLoaded', () => {
	const ele = document.querySelector('#svbAdminContainer');

	if (!ele) {
		return;
	}

	createRoot(ele).render(<Table />);
});
