import { blockIcon } from './utils/icons';
import { registerBlockType } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import metadata from './block.json';
import Edit from './Edit';
import variations from './variations';
import ShortcodeClip from './Components/ShortcodeClip';
import './editor.scss';

registerBlockType(metadata, {
	icon: blockIcon,
	variations,

	// Build in Functions
	edit: Edit,
	save: () => null
});

/**
 * Shows the "[survey-form-block id=…]" copy clip above the block while editing
 * a saved survey, so the shortcode can be copied without leaving the editor for
 * the ShortCode column on the list screen.
 *
 * Only on the survey post type: dropping the block straight onto a page has no
 * shortcode to offer, because the shortcode addresses a saved survey by id.
 *
 * The editor store is read by string rather than by importing
 * `@wordpress/editor`. Importing it would add wp-editor to this block's
 * editorScript dependencies, which then loads on every screen the block editor
 * appears on, including the widgets screen where that store does not exist.
 * Reading it by name keeps the dependency out and simply yields undefined
 * where the store is absent.
 */
const withShortcodeClip = createHigherOrderComponent((BlockEdit) => (props) => {
	const { postType, postId } = useSelect((select) => {
		const editor = select('core/editor');

		return {
			postType: editor?.getCurrentPostType?.(),
			postId: editor?.getCurrentPostId?.()
		};
	}, []);

	if (metadata.name !== props.name || 'survey-form-block' !== postType || !postId) {
		return <BlockEdit {...props} />;
	}

	return <>
		<ShortcodeClip shortCode={`[survey-form-block id="${postId}"]`} />
		<BlockEdit {...props} />
	</>;
}, 'withSvbShortcodeClip');

addFilter('editor.BlockEdit', 'svb/shortcode-clip', withShortcodeClip);
