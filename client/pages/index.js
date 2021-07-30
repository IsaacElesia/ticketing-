import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
	return (
		<h1>{currentUser ? 'You are signed in' : 'You are NOT signed in.'}</h1>
	);
};

LandingPage.getInitialProps = async (context) => {
	try {
		const client = buildClient(context);
		const { data } = await client.get('/api/users/currentuser');

		return data;
	} catch (err) {
		console.log(err);
	}
};

export default LandingPage;
