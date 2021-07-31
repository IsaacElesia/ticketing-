import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
	subject: Subjects;
	data: any;
}

/*  =====================================
					Listener Abstract Class
 ======================================== */
export abstract class Listener<T extends Event> {
	abstract subject: T['subject']; //Channel name to listen to
	abstract queueGroupName: string;
	abstract onMessage(data: T['data'], msg: Message): void;
	private client: Stan;
	protected ackWait = 5 * 1000; //Number of seconds to acknowledge a message

	constructor(client: Stan) {
		this.client = client;
	}

	subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName);
	}

	//code to setup the suscription
	listen() {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);

		subscription.on('message', (msg: Message) => {
			console.log(
				`Message received: ${this.subject} / ${this.queueGroupName} `
			);
			const parsedData = this.parseMessage(msg);
			// Function to run when a message is received
			this.onMessage(parsedData, msg);
		});
	}

	parseMessage(msg: Message) {
		const data = msg.getData();
		return typeof data === 'string'
			? JSON.parse(data)
			: JSON.parse(data.toString('utf8')); //Buffer parser
	}
}