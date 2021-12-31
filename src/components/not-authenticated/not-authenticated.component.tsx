import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';

import { AuthContext } from 'context/auth.context';
import { RowBox } from 'ui-components/box';

export const NotAuthenticated = () => {
	const { connectWallet } = useContext(AuthContext);

	return (
		<RowBox>
			<Typography variant='h5' component='h2' gutterBottom>
				You are not authenticated
			</Typography>
			<Button variant='contained' onClick={connectWallet}>
				Authenticate
			</Button>
		</RowBox>
	);
};
