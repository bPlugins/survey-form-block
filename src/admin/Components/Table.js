
import { useEffect, useState } from 'react'
const $ = jQuery;

const Table = () => {

    const [data, setData] = useState(null);
    const [currentForm, setCurrentForm] = useState(null);
    const [columns, setColumns] = useState();
    const [currentData, setCurrentData] = useState([]);
    const [table, setTable] = useState(null);

    useEffect(() => {
        fetch(`${window.svbData?.ajaxUrl}?action=svb_get_all_data&nonce=${window.svbData?.nonce}`).then(res => res.json()).then(res => setData(res.data))
    }, []);

    useEffect(() => {
        // First set Form Id 
        if (data) {
            setCurrentForm(data.columns[0]?.form_id);
        }
    }, [data]);


    useEffect(() => {
        if (data) {
            if (table) {
                table.destroy();
            }
            let columns = [];
            columns = data?.columns.find(item => item.form_id === currentForm)?.columns;
            setCurrentData(data.data.filter(item => item.form_id === currentForm).map(item => item.data));
            setColumns(columns);

            // initialize DataTable
            $(document).ready(function () {
                if (columns) {
                    setTimeout(() => {
                        const table = $('#svb_table_id').DataTable();
                        setTable(table);
                    }, 10);
                }
            });
        }
    }, [currentForm])

    if (!data) {
        return <h2 className='text-3xl'>Loading...</h2>
    }

    return <div className='w-[80%] mt-[30px] m-auto'>
        <div className="flex gap-[15px]">
            <label htmlFor='form' className='text-[18px] font-medium'>Select form</label>
            <select className='w-[200px]' name="form" id="form" value={currentForm} onChange={(e) => setCurrentForm(e.target.value)}>
                {data?.columns.map(form => { return <><option value={form.form_id}>{form.form_name}</option>  </> })}
            </select>
        </div>
        {/* Table Area  */}
        {columns && currentData?.length > 0 ? <>
            <h1 className='text-[20px] font-[500] text-[#000] mb-[15px]' id='myTable'> List </h1>
            <table id="svb_table_id" className={`svb_table_id`}>
                <thead>
                    <tr>
                        <th className="border border-slate-300 p-[6px] text-[16px] font-[500] text-[#000]">S.N</th>
                        {Object.values(columns)?.map(column => <th key={column} className="border border-slate-300 p-[6px] text-[16px] font-[500] text-[#000]">{column}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {currentData.length < 1 ? <tr key={0}>
                        {Object.keys(columns)?.map(column => <td key={column} className="border border-slate-300 p-[4px] text-[16px] font-[400] text-[#000]">{column}</td>)}
                    </tr> :
                        currentData.map((item, index) => <tr key={index}>
                            <td className="border border-slate-300 p-[4px] text-[16px] font-[400] text-[#000]">{index + 1}</td>
                            {Object.keys(columns)?.map(column => <td key={column} className="border border-slate-300 p-[4px] text-[16px] font-[400] text-[#000]">
                                {Array.isArray(item[column]) ? item[column].join(", ") : item[column]}</td>)}
                        </tr>)}
                </tbody>
            </table>

        </> : <h3>No data submitted yet!</h3>}
    </div>
}
export default Table;