
import { createRoot } from 'react-dom/client';
import Table from './Components/Table';

document.addEventListener('DOMContentLoaded', () => {
    const ele = document.querySelector('#svbAdminContainer');

    createRoot(ele).render(<>
        <Table />
    </>);

});

