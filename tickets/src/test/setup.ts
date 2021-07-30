import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

/* declare global {
	namespace NodeJS {
		interface Global {
			signin() : Promise<string[]>;
		}
	}
} */

declare global {
	var signin: () => string[];
}

let mongo: any;
// beforAll hook. Runs before all our test
beforeAll(async () => {
	process.env.JWT_KEY = 'asdfasdf';

	mongo = await MongoMemoryServer.create();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

// beforEach hook. Runs before each of our test
beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

// afterll hook. Runs after all our test
afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signin = () => {
	// Build a JWT payload. {id, email}
	const payLoad = {
		id: '177hgyuiud7890-7hk',
		email: 'test@test.com',
	};

	// Create the JWT
	const token = jwt.sign(payLoad, process.env.JWT_kEY!);

	// Build session object. {jwt: MY_JWT}
	const session = { jwt: token };

	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session);

	// Take JSON and encode it has base64
	const base64 = Buffer.from(sessionJSON).toString('base64');

	// return a strin that's the cookie with the encoded data
	return [`express:sess=${base64}`];
};
