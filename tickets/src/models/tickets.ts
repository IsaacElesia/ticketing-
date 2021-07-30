import mongoose from 'mongoose';

// An interface that describes the required
// properties for creating a new ticket
interface TicketAttrs {
	title: string;
	price: number;
	userId: string;
}

// An interface that describes the
// properties a ticket Document has
interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
}

// An interface that describes the properties
//  a ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
