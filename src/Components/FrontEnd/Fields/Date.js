

import { useState, useEffect } from 'react';
import LabelArea from '../MainEle/LabelArea';

const Date = ({ fieldEls, buttonArea, index, isRequired, name, help, classes, onChange, end, start }) => {

    const [data, setData] = useState({});
    const capitalize = (str) => {
        return str?.replace(str[0], str[0].toUpperCase())
    }

    useEffect(() => {
        onChange(`${data.day} ${capitalize(data?.month)}, ${data.year}`);
    }, [data]);

    // Month 
    const month = [
        { label: ('January'), value: 'january' },
        { label: ('February'), value: 'february' },
        { label: ('March'), value: 'march' },
        { label: ('April'), value: 'april' },
        { label: ('May'), value: 'may' },
        { label: ('June'), value: 'june' },
        { label: ('July'), value: 'july' },
        { label: ('August'), value: 'august' },
        { label: ('August'), value: 'august' },
        { label: ('September'), value: 'september' },
        { label: ('October'), value: 'october' },
        { label: ('November'), value: 'november' },
        { label: ('December'), value: 'december' },
    ]

    // Date 
    const date = [];
    for (let i = 1; i <= 31; i++) {
        date.push({ label: i, value: i });
    }

    // Year 
    const year = [];
    for (let i = start; i <= end; i++) {
        year.push({ label: i, value: i });
    }

    return <div className={`fieldMainArea labelPosition-${index} `}>
        <LabelArea isRequired={isRequired} labelEl={fieldEls.label} help={help} buttonArea={buttonArea} index={index} />
        <div className={`fieldArea ${classes}`}>
            <div className="selectArea">
                <select name={name} value={data.month} onChange={(e) => setData({ ...data, month: e.target.value })}>
                    <option value="">Select Month</option>
                    {month.map((option, index) => {
                        return <option key={index} value={option.value}>{option.label}</option>
                    })}
                </select>
                <select name={name} value={data.day} onChange={(e) => setData({ ...data, day: e.target.value })}>
                    <option value="">Select Date</option>
                    {date.map((option) => {
                        return <><option value={option.value}>{option.label}</option></>
                    })}
                </select>
                <select name={name} value={data.year} onChange={(e) => setData({ ...data, year: e.target.value })}>
                    <option value="">Select Year</option>
                    {year.map((option) => {
                        return <><option value={option.value}>{option.label}</option></>
                    })}
                </select>
            </div>
        </div>
    </div>
}
export default Date;