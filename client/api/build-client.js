import axios from 'axios';

const buildClient = ({ req }) => {
	if (typeof window === 'undefined') {
		// we are on the server
		// request should go to
		// http://ingress-nginx-controller .ingress-nginx.svc.cluster.local/api/users/currentuser
		return axios.create({
			baseURL:
				'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
			headers: req.headers,
		});
	} else {
		// we are on the browser
		// request should go to base url of ''
		// api/users/currentus
		return axios.create({
			baseURL: '/',
		});
	}
};

export default buildClient;
