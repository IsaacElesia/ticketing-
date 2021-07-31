import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

import { Ticket } from '../../models/tickets';

it('returns 404 if provided id dose not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'gi-man',
			price: 5,
		})
		.expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'gi-man',
			price: 5,
		})
		.expect(401);
});

it('returns 401 if the user dose not own the ticket', async () => {
	const title = 'fun time';
	const price = 14;

	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title,
			price,
		});

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'funny time',
			price: 14,
		})
		.expect(401);

	const noUpdate = await request(app).get(`/api/tickets/${res.body.id}`).send();

	expect(noUpdate.body.title).toEqual(res.body.title);
	expect(noUpdate.body.price).toEqual(res.body.price);
});

it('returns 400 if the user provides an invalid title or price', async () => {
	const title = 'fun time';
	const price = 14;
	const cookie = global.signin();

	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price,
		});

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'funny time',
			price: -14,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: -14,
		})
		.expect(400);
});

it('updates tickets if inputs are valid', async () => {
	const title = 'fun time';
	const price = 14;
	const cookie = global.signin();

	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price,
		});

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'funny time',
			price: 140,
		})
		.expect(200);

	const updatedTicket = await request(app)
		.get(`/api/tickets/${res.body.id}`)
		.send();

	expect(updatedTicket.body.title).toEqual('funny time');
	expect(updatedTicket.body.price).toEqual(140);
});
