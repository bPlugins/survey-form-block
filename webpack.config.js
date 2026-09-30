
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const ESLintPlugin = require('eslint-webpack-plugin');

const plugins = defaultConfig.plugins.filter(p => {
	if (Object.values(p).length === 2 && Object.values(p)?.[1]['filename'] && Object.values(p)?.[1]['filename'] === '[name]-rtl.css') {
		return false;
	}
	return true;
});

/**
 * Silence the Dart Sass "legacy JS API is deprecated" notice.
 *
 * It is emitted once per .scss file - dozens of blocks of it per build, almost
 * all from bpl-tools - and it is not ours to fix: @wordpress/scripts pins
 * sass-loader 12, which still calls sass.render(). The modern compiler API
 * only became selectable in sass-loader 14. Silencing the one deprecation
 * keeps every other Sass warning visible.
 */
const rules = defaultConfig.module.rules.map((rule) => {
	const loaders = Array.isArray(rule.use) ? rule.use : [];
	const at = loaders.findIndex((l) => l && l.loader && l.loader.includes('sass-loader'));

	if (at < 0) {
		return rule;
	}

	const use = [...loaders];
	const sassLoader = use[at];

	use[at] = {
		...sassLoader,
		options: {
			...sassLoader.options,
			sassOptions: {
				...(sassLoader.options && sassLoader.options.sassOptions),
				silenceDeprecations: ['legacy-js-api']
			}
		}
	};

	return { ...rule, use };
});

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		"admin-script": './src/admin/adminScript.js',
		"admin-dashboard": './src/bplugins-admin/dashboard.js',
		"admin-post": './src/admin/post.js',
	},
	module: { ...defaultConfig.module, rules },
	plugins: [
		...plugins,
		new ESLintPlugin()
	],
	optimization: {}
};