// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from 'context/auth.context';
import { Profile } from 'generated/avatar_types';
import { Box, RowBox } from 'ui-components/box';

export const Authenticated = () => {
	const { principalId, actor } = useContext(AuthContext);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [isProfileLoading, setIsProfileLoading] = useState(false);

	useEffect(() => {
		const initProfile = async () => {
			if (actor) {
				setIsProfileLoading(true);

				const profile = await actor.read();

				console.log({ profile });
				if ('ok' in profile) {
					setProfile(profile.ok);
				}

				setIsProfileLoading(false);
			}
		};

		initProfile();
	}, [actor]);

	return (
		<RowBox>
			<Typography variant='h5' component='h2' gutterBottom textAlign='center'>
				You are authenticated
			</Typography>
			<Typography variant='subtitle1' gutterBottom textAlign='center'>
				{principalId}
			</Typography>
			{isProfileLoading ? <>Loading...</> : <Box>{JSON.stringify(profile)}</Box>}
			{/* <Button variant='contained' onClick={logout}>
				Logout
			</Button> */}
		</RowBox>
	);
};
