import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { signinRoute } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(
	cookieSession({
		signed: false,
		secure: true,
	})
);

// ROUTES
app.use(currentUserRouter);
app.use(signinRoute);
app.use(signoutRouter);
app.use(signupRouter);

// Not found route
app.all('*', async (req, res) => {
	throw new NotFoundError();
});

//  Error handler
app.use(errorHandler);

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined.');
	}

	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log('Auth server listening on port 3000!!!');
	});
};

start();
