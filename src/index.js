import { blockIcon } from './utils/icons';
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './Edit';
import variations from './variations';
import './editor.scss';

registerBlockType(metadata, {
	icon: blockIcon,
	variations,

	// Build in Functions
	edit: Edit,
	save: () => null
});
