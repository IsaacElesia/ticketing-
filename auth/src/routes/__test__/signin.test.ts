import request from 'supertest';
import { app } from '../../app';

it('fails when an email that doesn not exist is supplied', async () => {
	return request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(400);
});

it('fails when an inc0rrect password is supplied', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);

	return request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'fhkdiumbtyui',
		})
		.expect(400);
});

it('response with cookie when given valid credentials', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);

	const res = await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(200);

	expect(res.get('Set-Cookie')).toBeDefined();
});
