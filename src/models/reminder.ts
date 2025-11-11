import mongoose, { Schema, Document } from 'mongoose'

export interface IReminder extends Document {
	text: string
	time: Date
	groupId: string
	createdAt: Date
}

const ReminderSchema = new Schema<IReminder>({
	text: { type: String, required: true },
	time: { type: Date, required: true },
	groupId: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
})

export const ReminderModel = mongoose.model<IReminder>(
	'Reminder',
	ReminderSchema
)
