import { ReminderRepository } from '../repositories/reminder.repository'
import { SchedulerService } from './scheduler.service'
import {
	Reminder,
	IOneTimeReminder,
	IRecurringReminder,
} from '../types/reminder.types'
import { Logger } from '../utils/logger'
import * as schedule from 'node-schedule'

export class ReminderService {
	private logger: Logger

	constructor(
		private reminderRepo: ReminderRepository,
		private scheduler: SchedulerService
	) {
		this.logger = new Logger('ReminderService')
	}

	createOneTimeReminder(
		chatId: string,
		text: string,
		scheduledDate: Date,
		onTrigger: () => Promise<void>,
		targetChats?: string[]
	): IOneTimeReminder {
		const reminderData: any = {
			chatId,
			text,
			type: 'one-time' as const,
			scheduledDate,
		}

		if (targetChats) {
			reminderData.targetChats = targetChats
		}

		const reminder = this.reminderRepo.create(reminderData) as IOneTimeReminder

		const job = this.scheduler.scheduleOneTime(scheduledDate, async () => {
			await onTrigger()
			this.reminderRepo.delete(reminder.id)
		})

		this.reminderRepo.setJob(reminder.id, job)
		this.logger.info(
			`One-time reminder created: ID ${reminder.id}${targetChats ? ` targeting ${targetChats.length} chats` : ''}`
		)
		return reminder
	}

	createRecurringReminder(
		chatId: string,
		text: string,
		frequency: string,
		cronRule: schedule.RecurrenceRule,
		onTrigger: () => Promise<void>,
		targetChats?: string[]
	): IRecurringReminder {
		const reminderData: any = {
			chatId,
			text,
			type: 'recurring' as const,
			frequency,
			cronRule: cronRule.toString(),
		}

		if (targetChats) {
			reminderData.targetChats = targetChats
		}

		const reminder = this.reminderRepo.create(
			reminderData
		) as IRecurringReminder

		const job = this.scheduler.scheduleRecurring(cronRule, onTrigger)
		this.reminderRepo.setJob(reminder.id, job)
		this.logger.info(
			`Recurring reminder created: ID ${reminder.id}${targetChats ? ` targeting ${targetChats.length} chats` : ''}`
		)
		return reminder
	}

	getReminder(id: number): Reminder | undefined {
		return this.reminderRepo.findById(id)
	}

	getUserReminders(chatId: string): Reminder[] {
		return this.reminderRepo.findByChatId(chatId)
	}

	getAllReminders(): Reminder[] {
		return this.reminderRepo.findAll()
	}

	cancelReminder(id: number): boolean {
		this.reminderRepo.deleteJob(id)
		const deleted = this.reminderRepo.delete(id)
		if (deleted) {
			this.logger.info(`Reminder cancelled: ID ${id}`)
		}
		return deleted
	}

	shutdown(): void {
		this.logger.info('Shutting down reminder service...')
		this.reminderRepo.cancelAllJobs()
	}
}
