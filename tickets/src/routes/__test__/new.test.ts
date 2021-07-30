import request from 'supertest';
import { app } from '../../app';

import { Ticket } from '../../models/tickets';

it('has a route handler listening to /api/tickets for post request', async () => {
	const res = await request(app).post('/api/tickets').send({});

	expect(res.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in ', async () => {
	return await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status code other than 401 if the user is signed in ', async () => {
	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({});

	expect(res.status).not.toEqual(401);
});

it('returns an error if invalid title is provided', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: '',
			price: 10,
		})
		.expect(400);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			price: 10,
		})
		.expect(400);
});

it('returns an error if invalid price is provided', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'ghjkuopo',
			price: -10,
		})
		.expect(400);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'gyiropp',
		})
		.expect(400);
});

it('creates a ticket with valid inputs', async () => {
	let ticket = await Ticket.find({});
	expect(ticket.length).toEqual(0);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'gyiropp',
			price: 20,
		})
		.expect(201);

	ticket = await Ticket.find({});
	expect(ticket.length).toEqual(1);
	expect(ticket[0].title).toEqual('gyiropp');
	expect(ticket[0].price).toEqual(20);
});
