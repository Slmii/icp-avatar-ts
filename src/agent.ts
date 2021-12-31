import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

import { idlFactory } from 'generated/avatar_idl';
import { _SERVICE } from 'generated/avatar_types';

const canisterId = process.env.AVATAR_CANISTER_ID;

let agentOptions = {};
if (process.env.NODE_ENV === 'development') {
	agentOptions = { ...agentOptions, host: 'http://localhost:8000' };
}

export const createActor = async (authClient: AuthClient | null): Promise<ActorSubclass<_SERVICE>> => {
	if (authClient instanceof AuthClient) {
		const identity = authClient.getIdentity();
		agentOptions = { ...agentOptions, identity: identity as any };
	}

	const agent = new HttpAgent(agentOptions);

	// for local development only, this must not be used for production
	if (process.env.NODE_ENV === 'development') {
		await agent.fetchRootKey().catch(err => {
			console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
			console.error(err);
		});
	}

	const actor = Actor.createActor<_SERVICE>(idlFactory, { agent, canisterId: `${canisterId}` });

	return actor;
};
