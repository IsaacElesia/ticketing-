import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

/*  =====================================
			Ticket Created Listener Class
 ======================================== */
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	// subject: Subjects.TicketCreated = Subjects.TicketCreated;
	readonly subject = Subjects.TicketCreated;
	queueGroupName = 'payment-service';

	onMessage(data: TicketCreatedEvent['data'], msg: Message) {
		console.log('Event Data!!!', data);
		console.log(data.id);

		msg.ack();
	}
}
