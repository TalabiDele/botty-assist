export interface IReminder {
	id: number
	chatId: string
	text: string
	type: ReminderType
	createdAt: Date
	targetChats?: string[] // Optional: specific chats to send to
}

export interface IOneTimeReminder extends IReminder {
	type: 'one-time'
	scheduledDate: Date
}

export interface IRecurringReminder extends IReminder {
	type: 'recurring'
	frequency: string
	cronRule: string
}

export type ReminderType = 'one-time' | 'recurring'

export type Reminder = IOneTimeReminder | IRecurringReminder

export interface IScheduledJob {
	reminderId: number
	job: any // node-schedule Job type
}

export interface ParsedTime {
	hour: number
	minute: number
	dayOfWeek: number | null
	dayOfMonth: number | null
}

export interface ICommand {
	name: string
	description: string
	pattern: RegExp
	execute(message: any, chatId: string): Promise<void>
}

export interface ChatInfo {
	id: string
	name: string
	isGroup: boolean
}
