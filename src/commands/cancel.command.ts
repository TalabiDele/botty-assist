import { BaseCommand } from './base.command'

export class CancelCommand extends BaseCommand {
	name = 'cancel'
	description = 'Cancel a reminder'
	pattern = /^!cancel\s+(\d+)/i

	async execute(message: any, chatId: string): Promise<void> {
		const match = message.body.match(this.pattern)

		if (!match) {
			await this.reply(
				message,
				'❌ Please specify the reminder ID.\n\nUse: *!cancel <id>*\n\nExample: !cancel 1'
			)
			return
		}

		const reminderId = parseInt(match[1])
		const reminder = this.reminderService.getReminder(reminderId)

		if (!reminder) {
			await this.reply(
				message,
				"❌ I couldn't find that reminder. Use *!list* to see your active reminders."
			)
			return
		}

		if (reminder.chatId !== chatId) {
			await this.reply(message, '❌ You can only cancel your own reminders!')
			return
		}

		this.reminderService.cancelReminder(reminderId)

		await this.reply(
			message,
			`✅ Reminder #${reminderId} has been cancelled!\n\n_"${reminder.text}"_`
		)
	}
}
