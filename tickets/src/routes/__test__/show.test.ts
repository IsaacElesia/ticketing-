import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns 404 if the ticket is not found', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	return await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns ticket if the ticket is found', async () => {
	const title = 'concert';
	const price = 30;

	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title,
			price,
		})
		.expect(201);

	const ticketRes = await request(app)
		.get(`/api/tickets/${res.body.id}`)
		.send()
		.expect(200);

	expect(ticketRes.body.title).toEqual(title);
	expect(ticketRes.body.price).toEqual(price);
});
