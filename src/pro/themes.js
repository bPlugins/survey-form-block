/**
 * Premium theme definitions.
 *
 * Premium build only (listed under @fs_premium_only in the plugin header, so
 * the WordPress.org build never contains it). The free build lists these
 * themes by name and swatch for its upgrade prompt; this file supplies what
 * makes them work: the CSS variable layer (vars) and the attribute payload
 * written when a theme is picked (apply). It is merged in through the
 * svb.design.themes filter, see ./index.js.
 */

import { __ } from '@wordpress/i18n';

export const PRO_THEMES = [
	{
		name: 'glassmorphism',
		label: __('Glassmorphism', 'survey-form-block'),
		pro: true,
		swatch: { bg: 'linear-gradient(135deg,#c7d2fe,#a5f3fc)', accent: '#7c3aed', text: '#1e1b4b', border: 'rgba(255,255,255,.7)' },
		description: __('Frosted translucent panel floating over a colour wash.', 'survey-form-block'),
		vars: {
			'--svb-accent': '#7c3aed',
			'--svb-accent-alt': '#38bdf8',
			'--svb-accent-soft': 'rgba(124, 58, 237, 0.14)',
			'--svb-heading': '#1e1b4b',
			'--svb-muted': '#4c1d95',
			'--svb-divider': 'rgba(255, 255, 255, 0.55)',
			'--svb-input-bg': 'rgba(255, 255, 255, 0.55)',
			'--svb-input-focus': '#7c3aed',
			'--svb-input-focus-ring': 'rgba(124, 58, 237, 0.22)',
			'--svb-placeholder': 'rgba(30, 27, 75, 0.45)',
			'--svb-card-bg': 'rgba(255, 255, 255, 0.42)',
			'--svb-card-border-color': 'rgba(255, 255, 255, 0.65)',
			'--svb-card-radius': '16px',
			'--svb-card-shadow': '0 8px 32px rgba(31, 38, 135, 0.12)',
			'--svb-card-hover-shadow': '0 14px 40px rgba(31, 38, 135, 0.20)',
			'--svb-form-shadow': '0 8px 40px rgba(31, 38, 135, 0.18)',
			'--svb-btn-shadow': '0 8px 24px rgba(124, 58, 237, 0.35)',
			'--svb-progress-track': 'rgba(255, 255, 255, 0.5)',
			'--svb-card-blur': '10px'
		},
		apply: {
			form: {
				bgColor: 'rgba(255, 255, 255, 0.35)',
				padding: { top: '32px', right: '30px', bottom: '32px', left: '30px' },
				border: { width: '1px', style: 'solid', color: 'rgba(255,255,255,0.65)', side: 'all', radius: '20px' },
				titleColor: '#1e1b4b',
				descriptionColor: '#4c1d95',
				successMsgColor: '#15803d'
			},
			labelS: { color: '#1e1b4b' },
			input: {
				color: '#1e1b4b',
				padding: { top: '12px', right: '15px', bottom: '12px', left: '15px' },
				border: { width: '1px', style: 'solid', color: 'rgba(255,255,255,0.75)', side: 'all', radius: '12px' }
			},
			radioCheckLabelColor: '#312e81',
			button: { colors: { color: '#ffffff', bg: '#7c3aed' }, padding: { top: '14px', right: '30px', bottom: '14px', left: '30px' } },
			design: {
				layout: 'card',
				inputStyle: 'filled',
				button: { variant: 'gradient', radius: '12px', hoverEffect: 'lift', gradient: 'linear-gradient(135deg, #7c3aed 0%, #38bdf8 100%)' },
				card: { enable: true },
				background: { enable: true, type: 'gradient', gradient: 'linear-gradient(135deg, #c7d2fe 0%, #a5f3fc 100%)', blur: 14 }
			}
		}
	},
	{
		name: 'bold-gradient',
		label: __('Bold Gradient', 'survey-form-block'),
		pro: true,
		swatch: { bg: 'linear-gradient(135deg,#6366f1,#ec4899)', accent: '#ffffff', text: '#ffffff', border: 'rgba(255,255,255,.35)' },
		description: __('Landing-page energy: saturated gradient with white type.', 'survey-form-block'),
		colorScheme: 'dark',
		vars: {
			'--svb-accent': '#ffffff',
			'--svb-accent-alt': '#fde68a',
			'--svb-accent-soft': 'rgba(255, 255, 255, 0.18)',
			'--svb-heading': '#ffffff',
			'--svb-muted': 'rgba(255, 255, 255, 0.82)',
			'--svb-divider': 'rgba(255, 255, 255, 0.28)',
			'--svb-input-bg': 'rgba(255, 255, 255, 0.16)',
			'--svb-input-focus': '#ffffff',
			'--svb-input-focus-ring': 'rgba(255, 255, 255, 0.35)',
			'--svb-placeholder': 'rgba(255, 255, 255, 0.7)',
			'--svb-card-bg': 'rgba(255, 255, 255, 0.10)',
			'--svb-card-border-color': 'rgba(255, 255, 255, 0.24)',
			'--svb-card-radius': '14px',
			'--svb-card-shadow': 'none',
			'--svb-card-hover-shadow': '0 10px 30px rgba(0, 0, 0, 0.18)',
			'--svb-form-shadow': '0 18px 50px rgba(76, 29, 149, 0.35)',
			'--svb-btn-shadow': '0 10px 26px rgba(0, 0, 0, 0.22)',
			'--svb-progress-track': 'rgba(255, 255, 255, 0.25)',
			'--svb-scale-btn-bg': 'rgba(255,255,255,0.14)',
			'--svb-scale-btn-color': '#ffffff',
			'--svb-star-empty': 'rgba(255,255,255,0.35)',
			'--svb-star-active': '#fde68a',
			'--svb-accent-contrast': '#4c1d95'
		},
		apply: {
			form: {
				bgColor: 'transparent',
				padding: { top: '38px', right: '34px', bottom: '38px', left: '34px' },
				border: { width: '0px', style: 'solid', color: 'rgba(255,255,255,0.3)', side: 'all', radius: '22px' },
				titleColor: '#ffffff',
				descriptionColor: 'rgba(255,255,255,0.85)',
				successMsgColor: '#bbf7d0'
			},
			labelS: { color: '#ffffff' },
			input: {
				color: '#ffffff',
				padding: { top: '13px', right: '16px', bottom: '13px', left: '16px' },
				border: { width: '1px', style: 'solid', color: 'rgba(255,255,255,0.32)', side: 'all', radius: '12px' }
			},
			radioCheckLabelColor: 'rgba(255,255,255,0.92)',
			button: { colors: { color: '#4c1d95', bg: '#ffffff' }, padding: { top: '15px', right: '32px', bottom: '15px', left: '32px' } },
			design: {
				layout: 'fullwidth',
				inputStyle: 'filled',
				button: { variant: 'filled', radius: '999px', hoverEffect: 'lift' },
				card: { enable: false },
				background: { enable: true, type: 'gradient', gradient: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', blur: 0 }
			}
		}
	},
	{
		name: 'midnight',
		label: __('Midnight Dark', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#0f172a', accent: '#38bdf8', text: '#e2e8f0', border: '#1e293b' },
		description: __('Deep slate dark mode with a luminous sky accent.', 'survey-form-block'),
		colorScheme: 'dark',
		vars: {
			'--svb-accent': '#38bdf8',
			'--svb-accent-alt': '#818cf8',
			'--svb-accent-soft': 'rgba(56, 189, 248, 0.14)',
			'--svb-heading': '#f1f5f9',
			'--svb-muted': '#94a3b8',
			'--svb-divider': '#1e293b',
			'--svb-input-bg': '#111c31',
			'--svb-input-focus': '#38bdf8',
			'--svb-input-focus-ring': 'rgba(56, 189, 248, 0.22)',
			'--svb-placeholder': '#64748b',
			'--svb-card-bg': '#14203a',
			'--svb-card-border-color': '#243352',
			'--svb-card-radius': '12px',
			'--svb-card-shadow': '0 2px 10px rgba(0, 0, 0, 0.35)',
			'--svb-card-hover-shadow': '0 12px 28px rgba(0, 0, 0, 0.45)',
			'--svb-form-shadow': '0 20px 60px rgba(2, 6, 23, 0.55)',
			'--svb-btn-shadow': '0 8px 22px rgba(56, 189, 248, 0.28)',
			'--svb-progress-track': '#1e293b',
			'--svb-scale-btn-bg': '#14203a',
			'--svb-scale-btn-color': '#cbd5e1',
			'--svb-star-empty': '#334155',
			'--svb-star-active': '#fbbf24',
			'--svb-accent-contrast': '#04121f'
		},
		apply: {
			form: {
				bgColor: '#0f172a',
				padding: { top: '30px', right: '28px', bottom: '30px', left: '28px' },
				border: { width: '1px', style: 'solid', color: '#1e293b', side: 'all', radius: '16px' },
				titleColor: '#f1f5f9',
				descriptionColor: '#94a3b8',
				successMsgColor: '#4ade80'
			},
			labelS: { color: '#e2e8f0' },
			input: {
				color: '#e2e8f0',
				padding: { top: '12px', right: '15px', bottom: '12px', left: '15px' },
				border: { width: '1px', style: 'solid', color: '#243352', side: 'all', radius: '10px' }
			},
			radioCheckLabelColor: '#cbd5e1',
			button: { colors: { color: '#04121f', bg: '#38bdf8' }, padding: { top: '14px', right: '28px', bottom: '14px', left: '28px' } },
			design: {
				layout: 'card',
				inputStyle: 'filled',
				button: { variant: 'filled', radius: '10px', hoverEffect: 'glow' },
				card: { enable: true },
				background: { enable: false }
			}
		}
	},
	{
		name: 'elegant',
		label: __('Elegant', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#fbf8f3', accent: '#8a6a3d', text: '#3f3222', border: '#e6dcc9' },
		description: __('Warm editorial cream with a refined gold rule.', 'survey-form-block'),
		vars: {
			'--svb-accent': '#8a6a3d',
			'--svb-accent-alt': '#c8a96a',
			'--svb-accent-soft': 'rgba(138, 106, 61, 0.10)',
			'--svb-heading': '#2f2617',
			'--svb-muted': '#7a6a52',
			'--svb-divider': '#e6dcc9',
			'--svb-input-bg': '#ffffff',
			'--svb-input-focus': '#8a6a3d',
			'--svb-input-focus-ring': 'rgba(138, 106, 61, 0.18)',
			'--svb-placeholder': '#b3a690',
			'--svb-card-bg': '#ffffff',
			'--svb-card-border-color': '#ece3d2',
			'--svb-card-radius': '4px',
			'--svb-card-shadow': 'none',
			'--svb-card-hover-shadow': '0 6px 18px rgba(63, 50, 34, 0.08)',
			'--svb-form-shadow': 'none',
			'--svb-btn-shadow': 'none',
			'--svb-progress-track': '#ece3d2'
		},
		apply: {
			form: {
				bgColor: '#fbf8f3',
				padding: { top: '36px', right: '34px', bottom: '36px', left: '34px' },
				border: { width: '1px', style: 'solid', color: '#e6dcc9', side: 'all', radius: '2px' },
				titleColor: '#2f2617',
				descriptionColor: '#7a6a52',
				successMsgColor: '#5b7f4b'
			},
			labelS: { color: '#3f3222' },
			input: {
				color: '#3f3222',
				padding: { top: '11px', right: '2px', bottom: '11px', left: '2px' },
				border: { width: '1px', style: 'solid', color: '#d9cdb6', side: 'all', radius: '0px' }
			},
			radioCheckLabelColor: '#5a4c37',
			button: { colors: { color: '#ffffff', bg: '#8a6a3d' }, padding: { top: '14px', right: '34px', bottom: '14px', left: '34px' } },
			design: {
				layout: 'minimal',
				inputStyle: 'underline',
				button: { variant: 'outline', radius: '0px', hoverEffect: 'none' },
				card: { enable: false },
				background: { enable: false }
			}
		}
	},
	{
		name: 'neumorphic',
		label: __('Neumorphic', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#e8ecf1', accent: '#5b7cfa', text: '#3d4658', border: '#dbe1e9' },
		description: __('Soft extruded surfaces, no hard borders.', 'survey-form-block'),
		vars: {
			'--svb-accent': '#5b7cfa',
			'--svb-accent-alt': '#8ba3ff',
			'--svb-accent-soft': 'rgba(91, 124, 250, 0.12)',
			'--svb-heading': '#333c4d',
			'--svb-muted': '#7c879b',
			'--svb-divider': '#d7dde6',
			'--svb-input-bg': '#e8ecf1',
			'--svb-input-focus': '#5b7cfa',
			'--svb-input-focus-ring': 'rgba(91, 124, 250, 0.20)',
			'--svb-placeholder': '#9aa4b6',
			'--svb-card-bg': '#e8ecf1',
			'--svb-card-border-color': 'transparent',
			'--svb-card-radius': '18px',
			'--svb-card-shadow': '6px 6px 14px rgba(163, 177, 198, 0.55), -6px -6px 14px rgba(255, 255, 255, 0.9)',
			'--svb-card-hover-shadow': '9px 9px 20px rgba(163, 177, 198, 0.6), -9px -9px 20px rgba(255, 255, 255, 0.95)',
			'--svb-form-shadow': '10px 10px 26px rgba(163, 177, 198, 0.5), -10px -10px 26px rgba(255, 255, 255, 0.9)',
			'--svb-btn-shadow': '5px 5px 12px rgba(163, 177, 198, 0.55), -5px -5px 12px rgba(255, 255, 255, 0.9)',
			'--svb-input-shadow': 'inset 3px 3px 7px rgba(163, 177, 198, 0.55), inset -3px -3px 7px rgba(255, 255, 255, 0.9)',
			'--svb-progress-track': '#dde3ea',
			'--svb-scale-btn-bg': '#e8ecf1',
			'--svb-scale-btn-color': '#55607a'
		},
		apply: {
			form: {
				bgColor: '#e8ecf1',
				padding: { top: '32px', right: '30px', bottom: '32px', left: '30px' },
				border: { width: '0px', style: 'solid', color: 'transparent', side: 'all', radius: '24px' },
				titleColor: '#333c4d',
				descriptionColor: '#7c879b',
				successMsgColor: '#3f9d5c'
			},
			labelS: { color: '#3d4658' },
			input: {
				color: '#3d4658',
				padding: { top: '13px', right: '16px', bottom: '13px', left: '16px' },
				border: { width: '0px', style: 'solid', color: 'transparent', side: 'all', radius: '14px' }
			},
			radioCheckLabelColor: '#55607a',
			button: { colors: { color: '#ffffff', bg: '#5b7cfa' }, padding: { top: '15px', right: '30px', bottom: '15px', left: '30px' } },
			design: {
				layout: 'card',
				inputStyle: 'filled',
				button: { variant: 'filled', radius: '14px', hoverEffect: 'scale' },
				card: { enable: true },
				background: { enable: false }
			}
		}
	},
	{
		name: 'sunset',
		label: __('Sunset Warm', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#fff7ed', accent: '#ea580c', text: '#431407', border: '#fed7aa' },
		description: __('Friendly warm palette for feedback and NPS surveys.', 'survey-form-block'),
		vars: {
			'--svb-accent': '#ea580c',
			'--svb-accent-alt': '#db2777',
			'--svb-accent-soft': 'rgba(234, 88, 12, 0.10)',
			'--svb-heading': '#431407',
			'--svb-muted': '#9a5b32',
			'--svb-divider': '#fed7aa',
			'--svb-input-bg': '#ffffff',
			'--svb-input-focus': '#ea580c',
			'--svb-input-focus-ring': 'rgba(234, 88, 12, 0.18)',
			'--svb-placeholder': '#c08457',
			'--svb-card-bg': '#ffffff',
			'--svb-card-border-color': '#fde3c8',
			'--svb-card-radius': '14px',
			'--svb-card-shadow': '0 2px 10px rgba(234, 88, 12, 0.07)',
			'--svb-card-hover-shadow': '0 10px 26px rgba(234, 88, 12, 0.14)',
			'--svb-form-shadow': '0 2px 12px rgba(234, 88, 12, 0.06)',
			'--svb-btn-shadow': '0 8px 20px rgba(234, 88, 12, 0.28)',
			'--svb-progress-track': '#fde3c8'
		},
		apply: {
			form: {
				bgColor: '#fff7ed',
				padding: { top: '28px', right: '26px', bottom: '28px', left: '26px' },
				border: { width: '1px', style: 'solid', color: '#fed7aa', side: 'all', radius: '18px' },
				titleColor: '#431407',
				descriptionColor: '#9a5b32',
				successMsgColor: '#15803d'
			},
			labelS: { color: '#431407' },
			input: {
				color: '#431407',
				padding: { top: '12px', right: '15px', bottom: '12px', left: '15px' },
				border: { width: '1px', style: 'solid', color: '#fbd3ae', side: 'all', radius: '12px' }
			},
			radioCheckLabelColor: '#7c3d17',
			button: { colors: { color: '#ffffff', bg: '#ea580c' }, padding: { top: '14px', right: '30px', bottom: '14px', left: '30px' } },
			design: {
				layout: 'card',
				inputStyle: 'rounded',
				button: { variant: 'gradient', radius: '999px', hoverEffect: 'lift', gradient: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)' },
				card: { enable: true },
				background: { enable: false }
			}
		}
	},
	{
		name: 'ocean',
		label: __('Ocean Cool', 'survey-form-block'),
		pro: true,
		swatch: { bg: '#f0f9ff', accent: '#0ea5e9', text: '#0c4a6e', border: '#bae6fd' },
		description: __('Fresh aquatic tones, generous rounding, calm contrast.', 'survey-form-block'),
		vars: {
			'--svb-accent': '#0ea5e9',
			'--svb-accent-alt': '#06b6d4',
			'--svb-accent-soft': 'rgba(14, 165, 233, 0.10)',
			'--svb-heading': '#0c4a6e',
			'--svb-muted': '#3f7ea3',
			'--svb-divider': '#bae6fd',
			'--svb-input-bg': '#ffffff',
			'--svb-input-focus': '#0ea5e9',
			'--svb-input-focus-ring': 'rgba(14, 165, 233, 0.20)',
			'--svb-placeholder': '#7dabc7',
			'--svb-card-bg': '#ffffff',
			'--svb-card-border-color': '#d5ecfa',
			'--svb-card-radius': '16px',
			'--svb-card-shadow': '0 2px 10px rgba(12, 74, 110, 0.06)',
			'--svb-card-hover-shadow': '0 12px 28px rgba(12, 74, 110, 0.12)',
			'--svb-form-shadow': '0 2px 14px rgba(12, 74, 110, 0.05)',
			'--svb-btn-shadow': '0 8px 20px rgba(14, 165, 233, 0.30)',
			'--svb-progress-track': '#d5ecfa'
		},
		apply: {
			form: {
				bgColor: '#f0f9ff',
				padding: { top: '30px', right: '28px', bottom: '30px', left: '28px' },
				border: { width: '1px', style: 'solid', color: '#bae6fd', side: 'all', radius: '20px' },
				titleColor: '#0c4a6e',
				descriptionColor: '#3f7ea3',
				successMsgColor: '#0d9488'
			},
			labelS: { color: '#0c4a6e' },
			input: {
				color: '#0c4a6e',
				padding: { top: '12px', right: '16px', bottom: '12px', left: '16px' },
				border: { width: '1px', style: 'solid', color: '#cbe9f9', side: 'all', radius: '999px' }
			},
			radioCheckLabelColor: '#265f80',
			button: { colors: { color: '#ffffff', bg: '#0ea5e9' }, padding: { top: '14px', right: '32px', bottom: '14px', left: '32px' } },
			design: {
				layout: 'floating',
				inputStyle: 'rounded',
				button: { variant: 'filled', radius: '999px', hoverEffect: 'lift' },
				card: { enable: true },
				background: { enable: false }
			}
		}
	}
];
