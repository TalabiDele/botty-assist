import { Message } from 'whatsapp-web.js'
import { Logger } from '../utils/logger'
import { Environment } from '../config/environment'
import { ICommand } from '../types/reminder.types'
import { WhatsAppService } from '../services/whatsapp.service'
import { ReminderService } from '../services/reminder.service'

// Import all command classes
import { HelpCommand } from '../commands/help.command'
import { RemindCommand } from '../commands/remind.command'
import { RecurringCommand } from '../commands/recurrinng.command'
import { ListCommand } from '../commands/list.command'
import {
	BroadcastCommand,
	BroadcastOnceCommand,
	ListChatsCommand,
} from '../commands/broadcast.command'
// (Add ListCommand, CancelCommand etc. if you have them)

export class MessageHandler {
	private logger = new Logger('MessageHandler')
	private commands: ICommand[]

	constructor(
		private whatsappService: WhatsAppService,
		private reminderService: ReminderService
	) {
		this.commands = [
			new HelpCommand(this.whatsappService, this.reminderService),
			new RemindCommand(this.whatsappService, this.reminderService),
			new RecurringCommand(this.whatsappService, this.reminderService),
			new ListCommand(this.whatsappService, this.reminderService),
			new BroadcastCommand(this.whatsappService, this.reminderService),
			new BroadcastOnceCommand(this.whatsappService, this.reminderService),
			new ListChatsCommand(this.whatsappService, this.reminderService),
			// Add other commands here
		]
	}

	registerCommand(command: ICommand): void {
		this.commands.push(command)
		this.logger.debug(`Command registered: ${command.name}`)
	}

	async handle(message: Message): Promise<void> {
		try {
			const sender = message.from.replace('@c.us', '') // "2348012345678"

			// ✅ Allow messages from owner — even if message.fromMe === true
			if (Environment.ONLY_RESPOND_TO_OWNER) {
				if (!message.fromMe) {
					this.logger.debug(`Ignoring message from non-owner: ${sender}`)
					return
				}
			}

			const chat = await message.getChat()
			const chatId = chat.id._serialized
			const text = message.body.trim()

			for (const command of this.commands) {
				if (command.pattern.test(text)) {
					this.logger.info(`Command triggered: ${command.name}`)
					await command.execute(message, chatId)
					return
				}
			}
		} catch (error) {
			this.logger.error('Error handling message', error as Error)
		}
	}
}
