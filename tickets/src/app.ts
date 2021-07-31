import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@iie-inc/common';
import { createTicketRouter } from './routes/new';
import { indexTicketRouter } from './routes/index';
import { showTicketRouter } from './routes/show';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);
app.use(currentUser);

// ROUTES
app.use(createTicketRouter);
app.use(indexTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);

// Not found route
app.all('*', async (req, res) => {
	throw new NotFoundError();
});

//  Error handler
app.use(errorHandler);

export { app };
