import { createContext, useState } from 'react';

import { idlFactory } from 'generated/avatar_idl';
import { _SERVICE } from 'generated/avatar_types';

const canisterId = `${process.env.AVATAR_CANISTER_ID}`;
// const isDevelopment = process.env.NODE_ENV === 'development';

interface IAuthClient {
	// authClient: AuthClient | null;
	// isAuthenticated: boolean;
	// principalId: string | null;
	// login: () => void;
	// logout: () => void;
	connectWallet: () => void;
	actor: _SERVICE | null;
	isConnected: boolean;
	principalId: string | null;
	isLoading: boolean;
}

export const AuthContext = createContext<IAuthClient>({
	// authClient: null,
	// isAuthenticated: false,
	// principalId: null,
	// login: () => {},
	// logout: () => {}
	connectWallet: () => {},
	actor: null,
	isConnected: false,
	principalId: null,
	isLoading: false
});

const windowObject = window as any;

// Canister Ids
const nnsCanisterId = canisterId;

// Whitelist
const whitelist = [nnsCanisterId];

// Host
const host = 'https://mainnet.dfinity.network';

// If plug is installed
const isPlugWalletInstalled = !!windowObject.ic.plug;

export const AuthProvider: React.FC = ({ children }) => {
	const [isConnected, setIsConnected] = useState(false);
	const [principalId, setPrincipalId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [actor, setActor] = useState<_SERVICE | null>(null);

	// useEffect(() => {
	// 	const initAuthClient = async () => {
	// 		const client = await AuthClient.create();
	// 		const isAuthenticated = await client.isAuthenticated();

	// 		setAuthClient(client);
	// 		setIsAuthenticated(isAuthenticated);
	// 	};

	// 	initAuthClient();
	// }, []);

	// useEffect(() => {
	// 	if (isAuthenticated) {
	// 		initActor();
	// 	}

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [isAuthenticated]);

	// const login = async () => {
	// 	await authClient?.login({
	// 		identityProvider: process.env.II_URL,
	// 		onSuccess: async () => {
	// 			await initActor();
	// 			setIsAuthenticated(true);
	// 		}
	// 	});
	// };

	// const logout = () => {
	// 	authClient?.logout();

	// 	setIsAuthenticated(false);
	// 	setActor(null);
	// };

	// const initActor = async () => {
	// 	const identity = authClient?.getIdentity();
	// 	const agent = new HttpAgent({
	// 		host: isDevelopment ? 'http://localhost:8000' : undefined,
	// 		identity
	// 	});

	// 	// For local development only, this must not be used for production
	// 	if (process.env.NODE_ENV === 'development') {
	// 		await agent.fetchRootKey();
	// 	}

	// 	const actor = Actor.createActor<_SERVICE>(idlFactory, {
	// 		canisterId,
	// 		agent
	// 	});

	// 	setActor(actor);
	// 	setPrincipalId(identity?.getPrincipal().toString() ?? null);
	// };

	const connectWallet = async () => {
		if (!isPlugWalletInstalled) {
			return;
		}

		setIsLoading(true);

		let connected = (await windowObject.ic.plug.isConnected()) as boolean;

		// try {
		if (!connected) {
			// Make the request
			connected = await windowObject.ic.plug.requestConnect({
				whitelist,
				host
			});
		} else if (connected) {
			await windowObject.ic.plug.createAgent({ whitelist });
		}

		// Get the user principal id
		const principalId = await windowObject.ic.plug.agent.getPrincipal();
		const principalIdToText = `${principalId}`;

		const actor: _SERVICE = await windowObject.ic.plug.createActor({
			canisterId: nnsCanisterId,
			interfaceFactory: idlFactory
		});

		console.log(actor);

		setActor(actor);
		setPrincipalId(principalIdToText);
		setIsConnected(connected);
		setIsLoading(false);
		// } catch (error) {
		// 	console.log(error);
		// 	setIsLoading(false);
		// }
	};

	return (
		<AuthContext.Provider
			value={{
				connectWallet,
				principalId,
				isLoading,
				isConnected,
				actor
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
