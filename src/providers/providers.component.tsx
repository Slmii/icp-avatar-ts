import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';

import { AuthProvider } from 'context/auth.context';
import theme from 'ui-components/theme';

export const Providers: React.FC = ({ children }) => {
	return (
		<AuthProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				{children}
			</ThemeProvider>
		</AuthProvider>
	);
};
