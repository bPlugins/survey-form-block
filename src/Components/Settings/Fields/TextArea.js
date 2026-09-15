import Text from './Text';

/**
 * Paragraph fields take exactly the same settings as single-line fields.
 * Kept as its own module so the switch in Settings.js stays readable.
 */
const TextArea = (props) => <Text {...props} />;

export default TextArea;
