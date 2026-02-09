const dev = {
  API_ENDPOINT_URL: process.env.REACT_APP_API_URL || 'http://localhost:8001',
};

const prod = {
  API_ENDPOINT_URL: process.env.REACT_APP_API_URL || 'http://localhost:8001',
};

const test = {
  API_ENDPOINT_URL: process.env.REACT_APP_API_URL || 'http://localhost:8001',
};

const getEnv = () => {
	switch (process.env.NODE_ENV) {
		case 'development':
			return dev
		case 'production':
			return prod
		case 'test':
			return test
		default:
			break;
	}
}

export const env = getEnv()
