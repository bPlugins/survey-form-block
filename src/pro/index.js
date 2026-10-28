/**
 * Survey Form Block Pro - premium design presets.
 *
 * Built to build/pro/design.js and build/pro/design.css, which the plugin header
 * lists under @fs_premium_only: Freemius strips them when it generates the free
 * WordPress.org build, so the free plugin ships none of this code. In the
 * premium build includes/Pro.php loads this bundle ahead of the block's editor
 * and view scripts, and it plugs into the free code through @wordpress/hooks.
 *
 * Every premium rule still checks the licence through `isPremium`; this bundle
 * only makes the premium presets available to draw.
 */

import { addFilter } from '@wordpress/hooks';

import { PRO_THEMES } from './themes';
import { registerProCSS } from './css';
import { registerProProgress } from './progress';
import { registerProIcons } from './icons';
import './style.scss';

// Replace the free build's name-and-swatch stubs with the full definitions.
addFilter('svb.design.themes', 'svb/pro-design', themes => themes.map(theme => PRO_THEMES.find(pro => pro.name === theme.name) || theme));

registerProCSS();
registerProProgress();
registerProIcons();
