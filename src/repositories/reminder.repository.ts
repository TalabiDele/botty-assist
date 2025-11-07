import { Reminder, IScheduledJob } from '../types/reminder.types'
import { Logger } from '../utils/logger'

export class ReminderRepository {
	private reminders: Map<number, Reminder> = new Map()
	private jobs: Map<number, IScheduledJob> = new Map()
	private idCounter: number = 1
	private logger: Logger

	constructor() {
		this.logger = new Logger('ReminderRepository')
	}

	create(reminder: any): Reminder {
		const id = this.idCounter++
		const newReminder: Reminder = {
			...reminder,
			id,
			createdAt: new Date(),
		} as Reminder

		this.reminders.set(id, newReminder)
		this.logger.debug(`Reminder created with ID: ${id}`)
		return newReminder
	}

	findById(id: number): Reminder | undefined {
		return this.reminders.get(id)
	}

	findByChatId(chatId: string): Reminder[] {
		return Array.from(this.reminders.values()).filter(
			(r) => r.chatId === chatId
		)
	}

	findAll(): Reminder[] {
		return Array.from(this.reminders.values())
	}

	delete(id: number): boolean {
		const deleted = this.reminders.delete(id)
		if (deleted) {
			this.logger.debug(`Reminder deleted with ID: ${id}`)
		}
		return deleted
	}

	setJob(reminderId: number, job: any): void {
		this.jobs.set(reminderId, { reminderId, job })
	}

	getJob(reminderId: number): IScheduledJob | undefined {
		return this.jobs.get(reminderId)
	}

	deleteJob(reminderId: number): void {
		const job = this.jobs.get(reminderId)
		if (job) {
			job.job.cancel()
			this.jobs.delete(reminderId)
			this.logger.debug(`Job cancelled for reminder ID: ${reminderId}`)
		}
	}

	cancelAllJobs(): void {
		this.jobs.forEach((job) => job.job.cancel())
		this.jobs.clear()
		this.logger.info('All jobs cancelled')
	}
}
