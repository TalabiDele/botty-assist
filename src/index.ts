import { WhatsAppService } from './services/whatsapp.service'
import { ReminderService } from './services/reminder.service'
import { SchedulerService } from './services/scheduler.service'
import { ReminderRepository } from './repositories/reminder.repository'
import { MessageHandler } from './handlers/message.handler'
import { HelpCommand } from './commands/help.command'
import { RemindCommand } from './commands/remind.command'
import { ListCommand } from './commands/list.command'
import { CancelCommand } from './commands/cancel.command'
import {
	BroadcastCommand,
	BroadcastOnceCommand,
	ListChatsCommand,
} from './commands/broadcast.command'
import { Logger } from './utils/logger'
import { RecurringCommand } from './commands/recurrinng.command'
import { connectDB } from './config/database'

class Application {
	private logger: Logger
	private whatsappService: WhatsAppService
	private reminderService: ReminderService
	private messageHandler: MessageHandler

	constructor() {
		this.logger = new Logger('Application')

		// Initialize services
		const reminderRepo = new ReminderRepository()
		const scheduler = new SchedulerService()
		this.reminderService = new ReminderService(reminderRepo, scheduler)
		this.whatsappService = new WhatsAppService(this.reminderService)

		// ✅ Pass dependencies to MessageHandler
		this.messageHandler = new MessageHandler(
			this.whatsappService,
			this.reminderService
		)

		this.registerCommands()
		this.setupEventHandlers()
	}

	private registerCommands(): void {
		const commands = [
			new HelpCommand(this.whatsappService, this.reminderService),
			new RemindCommand(this.whatsappService, this.reminderService),
			new RecurringCommand(this.whatsappService, this.reminderService),
			new ListCommand(this.whatsappService, this.reminderService),
			new CancelCommand(this.whatsappService, this.reminderService),
			new BroadcastCommand(this.whatsappService, this.reminderService),
			new BroadcastOnceCommand(this.whatsappService, this.reminderService),
			new ListChatsCommand(this.whatsappService, this.reminderService),
		]

		commands.forEach((cmd) => this.messageHandler.registerCommand(cmd))
		this.logger.info(`Registered ${commands.length} commands`)
	}

	private setupEventHandlers(): void {
		this.whatsappService.onMessage(async (message) => {
			await this.messageHandler.handle(message)
		})
	}

	async start(): Promise<void> {
		this.logger.info('Starting WhatsApp Assistant Bot...')
		await connectDB()
		await this.whatsappService.initialize()
		this.setupGracefulShutdown()
	}

	private setupGracefulShutdown(): void {
		const shutdown = async () => {
			this.logger.info('Shutting down gracefully...')
			this.reminderService.shutdown()
			await this.whatsappService.destroy()
			process.exit(0)
		}

		process.on('SIGINT', shutdown)
		process.on('SIGTERM', shutdown)
	}
}

// ✅ Bootstrap application
const app = new Application()
app.start().catch((error) => {
	console.error('Failed to start application:', error)
	process.exit(1)
})
