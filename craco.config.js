const webpack = require('webpack');
const path = require('path');
const CracoAlias = require('craco-alias');

let localCanisters, prodCanisters, canisters;
const isDevelopment = process.env.NODE_ENV !== 'production';

function initCanisterIds() {
	try {
		localCanisters = require(path.resolve('.dfx', 'local', 'canister_ids.json'));
	} catch (error) {
		console.log('No local canister_ids.json found. Continuing production');
	}

	try {
		prodCanisters = require(path.resolve('canister_ids.json'));
	} catch (error) {
		console.log('No production canister_ids.json found. Continuing with local');
	}

	const network = process.env.DFX_NETWORK || (!isDevelopment ? 'ic' : 'local');

	canisters = network === 'local' ? localCanisters : prodCanisters;

	for (const canister in canisters) {
		process.env[canister.toUpperCase() + '_CANISTER_ID'] = canisters[canister][network];
	}
}

initCanisterIds();

module.exports = {
	plugins: [
		{
			plugin: CracoAlias,
			// eslint-disable-next-line no-dupe-keys
			plugin: {
				overrideCracoConfig: ({ cracoConfig }) => {
					if (typeof cracoConfig.eslint.enable !== 'undefined') {
						cracoConfig.disableEslint = !cracoConfig.eslint.enable;
					}

					delete cracoConfig.eslint;

					return cracoConfig;
				},
				overrideWebpackConfig: ({ webpackConfig, pluginOptions }) => {
					const dfxJson = require(`${__dirname}/dfx.json`);

					if (typeof pluginOptions.disableEslint !== 'undefined' && pluginOptions.disableEslint === true) {
						webpackConfig.plugins = webpackConfig.plugins.filter(
							instance => instance.constructor.name !== 'ESLintWebpackPlugin'
						);
					}

					const networkName = process.env['DFX_NETWORK'] || 'local';

					const aliases = Object.entries(dfxJson.canisters).reduce((acc, [name, value]) => {
						const outputRoot = path.join(
							__dirname,
							'.dfx',
							networkName,
							`${dfxJson.defaults.build.output}`,
							name
						);

						return {
							...acc,
							['dfx-generated/' + name]: path.join(outputRoot, 'index.js'),
							'@ic-backend/functions': path.join(outputRoot, 'index.js'),
							'@ic-backend/types': path.join(outputRoot, name + '.did.d.ts')
						};
					}, {});

					return {
						...webpackConfig,
						devtool: 'source-map',
						mode: isDevelopment ? 'development' : 'production',
						plugins: [
							...webpackConfig.plugins,
							new webpack.ProvidePlugin({
								Buffer: [require.resolve('buffer/'), 'Buffer']
							}),
							new webpack.EnvironmentPlugin({
								NODE_ENV: 'development',
								AVATAR_CANISTER_ID: canisters['avatar'],
								II_URL: isDevelopment
									? 'http://localhost:8000?canisterId=rwlgt-iiaaa-aaaaa-aaaaa-cai#authorize'
									: 'https://identity.ic0.app/#authorize'
								// II_URL: 'https://identity.ic0.app/#authorize'
							})
						],
						resolve: {
							...webpackConfig.resolve,
							alias: { ...webpackConfig.resolve.alias, ...aliases },
							extensions: [...webpackConfig.resolve.extensions, '.tsx', '.ts', '.js'],
							plugins: [
								...webpackConfig.resolve.plugins.filter(t => {
									// Removes ModuleScopePlugin
									return !Object.keys(t).includes('appSrcs');
								})
							]
						}
					};
				}
			},
			options: {
				source: 'tsconfig',
				baseUrl: '.',
				tsConfigPath: './tsconfig.paths.json'
			}
		}
	]
};
