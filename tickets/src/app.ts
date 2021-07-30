import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from '@iie-inc/common';

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

// Not found route
app.all('*', async (req, res) => {
	throw new NotFoundError();
});

//  Error handler
app.use(errorHandler);

export { app };