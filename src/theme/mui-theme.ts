import { createTheme } from '@mui/material/styles';
import { BRAND, SAGE, INK } from '../constants/colors';

/**
 * Thème MUI du design system ESSG.
 *
 * Centralise les couleurs (palette), la typographie (Poppins), les rayons,
 * les ombres et les styles des composants MUI afin de garantir une
 * cohérence graphique globale sans toucher à la logique applicative.
 */

declare module '@mui/material/styles' {
  interface PaletteColor {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    950?: string;
  }
  interface SimplePaletteColorOptions {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    950?: string;
  }
}

const muiTheme = createTheme({
  shape: {
    borderRadius: 12,
  },
  palette: {
    primary: {
      ...BRAND,
      main: BRAND[600],
      light: BRAND[400],
      dark: BRAND[800],
      contrastText: '#ffffff',
    },
    secondary: {
      ...SAGE,
      main: SAGE[500],
      light: SAGE[300],
      dark: SAGE[700],
      contrastText: '#ffffff',
    },
    success: {
      main: BRAND[600],
      light: BRAND[100],
      dark: BRAND[800],
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
      light: '#fca5a5',
      dark: '#991b1b',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#d97706',
      light: '#fbbf24',
      dark: '#92400e',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    text: {
      primary: INK[900],
      secondary: INK[500],
      disabled: INK[300],
    },
    background: {
      default: INK[50],
      paper: '#ffffff',
    },
    divider: INK[100],
    action: {
      hover: 'rgba(46, 106, 95, 0.06)',
      selected: 'rgba(46, 106, 95, 0.1)',
    },
  },
  typography: {
    fontFamily:
      "'Poppins', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '0.75rem',
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 10px 24px -10px rgba(46, 106, 95, 0.55)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        sizeLarge: {
          paddingInline: '1.5rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: '9999px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          backgroundColor: '#ffffff',
          transition: 'all 0.2s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND[400],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND[600],
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dc2626',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: BRAND[600],
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
        },
        rounded: {
          borderRadius: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1.25rem',
          boxShadow: '0 1px 2px rgba(15, 33, 30, 0.04), 0 4px 16px -4px rgba(15, 33, 30, 0.08)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: INK[900],
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          padding: '6px 10px',
        },
        arrow: {
          color: INK[900],
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '0.9rem',
          boxShadow: '0 16px 40px -12px rgba(15, 33, 30, 0.2)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&::before': {
            display: 'none',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 33, 30, 0.08)',
        },
      },
    },
  },
});

export default muiTheme;
