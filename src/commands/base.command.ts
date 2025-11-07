import { ICommand } from '../types/reminder.types'
import { WhatsAppService } from '../services/whatsapp.service'
import { ReminderService } from '../services/reminder.service'

export abstract class BaseCommand implements ICommand {
	abstract name: string
	abstract description: string
	abstract pattern: RegExp

	constructor(
		protected whatsappService: WhatsAppService,
		protected reminderService: ReminderService
	) {}

	abstract execute(message: any, chatId: string): Promise<void>

	protected async reply(message: any, text: string): Promise<void> {
		await message.reply(text)
	}
}
