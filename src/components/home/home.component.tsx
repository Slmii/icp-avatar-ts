import { Typography } from '@mui/material';
import { useContext } from 'react';

import { Authenticated } from 'components/authenticated';
import { NotAuthenticated } from 'components/not-authenticated';
import { AuthContext } from 'context/auth.context';
import { Box } from 'ui-components/box';

export const Home = () => {
	const { isConnected } = useContext(AuthContext);

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column'
				}}
			>
				<img src='/assets/dfn.svg' alt='dfinity' />
				<Typography variant='h3' component='h1' fontWeight='bold'>
					Internet Computer
				</Typography>
			</Box>
			{!isConnected ? <NotAuthenticated /> : <Authenticated />}
		</>
	);
};
