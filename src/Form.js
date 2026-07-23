
import { useMemo, useEffect, useState } from 'react';
import { duplicate, remove, loadingIcon } from './utils/icons';
import Text from './Components/FrontEnd/Fields/Text';
import TextArea from './Components/FrontEnd/Fields/TextArea';
import Checkbox from './Components/FrontEnd/Fields/CheckBox';
import Radio from './Components/FrontEnd/Fields/Radio';
import Email from './Components/FrontEnd/Fields/Email';
import DropDown from './Components/FrontEnd/Fields/DropDowns';
import Date from './Components/FrontEnd/Fields/Date';
import StarRating from './Components/FrontEnd/Fields/StarRating';
import OpinionScale from './Components/FrontEnd/Fields/OpinionScale';
import NPS from './Components/FrontEnd/Fields/NPS';
import RangeSlider from './Components/FrontEnd/Fields/RangeSlider';
import Toggle from './Components/FrontEnd/Fields/Toggle';
import Section from './Components/FrontEnd/Fields/Section';
import NumberField from './Components/FrontEnd/Fields/Number';
import Phone from './Components/FrontEnd/Fields/Phone';
import UrlField from './Components/FrontEnd/Fields/Url';

const Form = ({ fieldsEls, RichText, updateObject, postData, Tooltip, requireError, setRequireError, formData, setFormData, __, SelectControl, isBackend, fieldTypeOpt, attributes, updateFields, addField, onDuplicateFields, removeField, activeIndex, setActiveIndex }) => {
    const { form, fields, cId } = attributes;
    const { id, creator_id, title, description, successMsg } = form;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Button Area
    const ActionButtons = (index) => {
        return (isBackend && activeIndex === index) && <div className='btnArea'>

            <Tooltip text="Duplicate" position='top'><button onClick={() => onDuplicateFields(index)}>{duplicate}</button></Tooltip>
            {1 < fields?.length && <Tooltip text="Delete" position='top'><button onClick={() => removeField(index)}>{remove}</button></Tooltip>}
        </div>
    }

    useEffect(() => {
        setFormData({ ...formData, id, creator_id, title })
    }, []);

    const requiredFields = useMemo(() => {
        return fields.map(item => item.isRequired && !item.isDisable ? item.id : false).filter(item => item !== false)
    }, [fields]);

    const onSubmit = (e) => {
        e.preventDefault();

        // Required Field check 
        const missingRequiredFields = requiredFields.filter(field => {
            if (!formData[field]) {
                return true
            }
            return false;
        });

        if (missingRequiredFields.length) {
            setRequireError(true);
            return setTimeout(() => {
                setRequireError(false);
            }, 1000);
        }

        setLoading(true);
        postData(`${window.svbData?.ajaxUrl}`, formData).then(
            res => {
                setLoading(false);
                setSuccess(true);
                const tempFormData = {};
                const { id, title, creator_id } = formData;
                Object.keys(formData).map(key => tempFormData[key] = '');
                setFormData({ ...tempFormData, id, title, creator_id });
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
            }
        )
    }

    return <form action='' method='' onSubmit={onSubmit}>
        <div className="titleArea">
            {isBackend ? <RichText tagName="h2" className='title' value={title} onChange={(val) => updateObject("form", "title", val)} placeholder={__('Title Here', 'survey-form-block')} inlineToolbar /> : title && <h2 className='title' dangerouslySetInnerHTML={{ __html: title }} />}
        </div>
        <div className="descriptionArea">
            {isBackend ? <RichText tagName="h2" className='description' value={description} onChange={(val) => updateObject("form", "description", val)} placeholder={__('Description Here', 'survey-form-block')} inlineToolbar /> : description && <h2 className='description' dangerouslySetInnerHTML={{ __html: description }} />}
        </div>

        <div className="mainFieldArea">
            {fields.map((field, index) => {
                const { id, type, size, isDisable } = field;

                const fieldsPros = {
                    cId,
                    updateFields,
                    buttonArea: ActionButtons,
                    ...field,
                    fieldEls: fieldsEls[index],
                    index,
                    value: formData[id]
                }

                return <div key={index} className={`fieldItem w${size || 100} ${isDisable ? "disable" : ''} ${isBackend && index === activeIndex ? 'svbNowEditing' : ''}`}
                    onClick={() => isBackend && setActiveIndex(index)}>

                    {(!type && isBackend) && (
                        <SelectControl className='selectBox' label={__('Select Field Type', 'survey-form-block')} options={[{ label: 'Select', value: '' }, ...fieldTypeOpt]} value={type} onChange={(val) => { updateFields(index, 'type', val) }} />
                    )}

                    {(() => {
                        switch (type) {
                            case 'text':
                                return <Text {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'paragraph':
                                return <TextArea {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'email':
                                return <Email {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'number':
                                return <NumberField {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'phone':
                                return <Phone {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'url':
                                return <UrlField {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'checkbox':
                                return <Checkbox {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'radio':
                                return <Radio {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'select':
                                return <DropDown {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'toggle':
                                return <Toggle {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'star_rating':
                                return <StarRating {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'opinion_scale':
                                return <OpinionScale {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'nps':
                                return <NPS {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'range_slider':
                                return <RangeSlider {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'date':
                                return <Date {...fieldsPros} onChange={val => setFormData({ ...formData, [id]: val })} />;
                            case 'section':
                                return <Section {...fieldsPros} />;
                            default:
                                return null;
                        }
                    })()}
                </div>
            })}
            {isBackend && <button onClick={addField} className='addField'>{__('Add New Field', 'survey-form-block')}</button>}

            {fields && <div className='subBtnArea'>
                <button className='subBtn'>Submit</button>
                {loading && <div className="loading">
                    {loading && loadingIcon}
                </div>}
            </div>}
            {/* success message  */}
            {success && <div className="successArea">
                <p className='message'>{successMsg}</p>
            </div>}
        </div>
        {/* Require Notice */}
        {requireError && <div className="svb_required_notice">
            <p className='svb_notice'>Required Field Missing</p>
        </div>}

    </form>
}
export default Form;
