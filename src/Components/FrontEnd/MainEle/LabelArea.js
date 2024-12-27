

import { questions, star } from '../../../utils/icons';
import Help from '../FieldAttr/Help';


const LabelArea = ({ isRequired, labelEl, help, buttonArea, index }) => {
    return <div className='labelArea' >
        <div className="labelHelp">
            {labelEl}
            {isRequired && star}
            {help && <div className='help'>
                {questions}
                <Help help={help} />
            </div>}

        </div>
        {buttonArea(index)}
    </div >
}
export default LabelArea;