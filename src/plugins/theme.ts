/**
 * plugins/theme.ts
 *
 * Paleta "emerald" (verde esmeralda) e temas claro/escuro da aplicação.
 */

export const emerald = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  300: '#6EE7B7',
  400: '#34D399',
  500: '#10B981',
  600: '#059669',
  700: '#047857',
  800: '#065F46',
  900: '#064E3B',
  950: '#022C22',
} as const

const light = {
  dark: false,
  colors: {
    'background': '#F3FBF7',
    'surface': '#FFFFFF',
    'surface-variant': emerald[100],
    'on-surface': '#06251A',
    'on-surface-variant': '#3F5C4E',

    'primary': emerald[600],
    'primary-darken-1': emerald[700],
    'primary-lighten-1': emerald[500],
    'on-primary': '#FFFFFF',

    'secondary': '#3F5C4E',
    'secondary-darken-1': '#2F463A',
    'secondary-lighten-1': '#567A67',
    'on-secondary': '#FFFFFF',

    'success': '#22C55E',
    'success-darken-1': '#16A34A',
    'on-success': '#052E16',

    'info': '#0D9488',
    'info-darken-1': '#0F766E',
    'on-info': '#FFFFFF',

    'warning': '#D97706',
    'warning-darken-1': '#B45309',
    'on-warning': '#2B1F00',

    'error': '#DC2626',
    'error-darken-1': '#B91C1C',
    'on-error': '#FFFFFF',
  },
}

const dark = {
  dark: true,
  colors: {
    'background': '#07130E',
    'surface': '#0C1F17',
    'surface-variant': '#143126',
    'on-surface': '#E6FFF3',
    'on-surface-variant': emerald[200],

    'primary': emerald[400],
    'primary-darken-1': emerald[500],
    'primary-lighten-1': emerald[300],
    'on-primary': '#04231A',

    'secondary': '#A7C4B4',
    'secondary-darken-1': '#8CAB9B',
    'secondary-lighten-1': '#C4DCCE',
    'on-secondary': '#04231A',

    'success': '#4ADE80',
    'success-darken-1': '#22C55E',
    'on-success': '#052E16',

    'info': '#2DD4BF',
    'info-darken-1': '#14B8A6',
    'on-info': '#042F2E',

    'warning': '#FBBF24',
    'warning-darken-1': '#F59E0B',
    'on-warning': '#241A00',

    'error': '#F87171',
    'error-darken-1': '#EF4444',
    'on-error': '#450A0A',
  },
}

export const themes = { light, dark }
