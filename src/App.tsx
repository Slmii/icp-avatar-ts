import { Home } from 'components/home';

import { Providers } from 'providers/index';
import { Container } from 'ui-components/index';

function App() {
	return (
		<Providers>
			<Container>
				<Home />
			</Container>
		</Providers>
	);
}

export default App;
