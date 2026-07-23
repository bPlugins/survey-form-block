const Section = ({ fieldEls, help }) => {
    return (
        <div className="svbSectionDivider">
            <div className="svbSectionHeader">{fieldEls.label}</div>
            {help && <p className="svbSectionDescription">{help}</p>}
            <hr className="svbSectionLine" />
        </div>
    );
};

export default Section;
