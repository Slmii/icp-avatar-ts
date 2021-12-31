import Box from '@mui/material/Box';
import MuiContainer from '@mui/material/Container';

export const Container: React.FC = ({ children }) => {
	return (
		<MuiContainer component='main' fixed disableGutters>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					paddingY: 2,
					'& > *:not(:last-child)': {
						marginBottom: 2
					}
				}}
			>
				{children}
			</Box>
		</MuiContainer>
	);
};
