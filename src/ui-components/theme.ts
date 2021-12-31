import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
	palette: {
		mode: 'dark'
	},
	typography: {
		fontFamily: '"Roboto", serif',
		fontSize: 16,
		htmlFontSize: 16
	},
	shape: {
		borderRadius: 4
	},
	spacing: 16
});

theme = createTheme(theme, {
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'initial'
				}
			}
		},
		MuiCssBaseline: {
			styleOverrides: {
				html: {
					fontFamily: "'Roboto', serif",
					margin: 0,
					fontSize: '100%',
					WebkitFontSmoothing: 'auto',
					height: '100%'
				},
				body: {
					height: '100%',
					backgroundColor: theme.palette.background.default
				},
				code: {
					fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
				}
			}
		}
	}
});

theme = responsiveFontSizes(theme);

export default theme;
