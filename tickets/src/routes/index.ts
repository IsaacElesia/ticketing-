import express, { Request, Response } from 'express';

import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
	const ticket = await Ticket.find({});

	res.status(200).json(ticket);
});

export { router as indexTicketRouter };
