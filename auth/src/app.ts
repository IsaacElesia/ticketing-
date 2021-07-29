import express from 'express';
import 'express-async-errors';
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
		secure: process.env.NODE_ENV !== 'test',
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

export { app };
