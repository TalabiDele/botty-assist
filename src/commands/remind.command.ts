import { BaseCommand } from './base.command'
import { DateParser } from '../utils/date.parser'

export class RemindCommand extends BaseCommand {
	name = 'remind'
	description = 'Create a one-time reminder'
	pattern = /^!remind\s+(.+?)\s+at\s+(.+)/i

	async execute(message: any, chatId: string): Promise<void> {
		const match = message.body.match(this.pattern)

		if (!match) {
			await this.reply(message, this.getUsageMessage())
			return
		}

		const reminderText = match[1].trim()
		const dateTimeString = match[2].trim()

		const reminderDate = DateParser.parseDate(dateTimeString)

		if (!reminderDate) {
			await this.reply(
				message,
				'❌ Invalid date format! Try:\n• 2024-12-25 10:00\n• Dec 25 2024 10:00 AM'
			)
			return
		}

		if (reminderDate <= new Date()) {
			await this.reply(message, '❌ The date must be in the future!')
			return
		}

		const reminder = this.reminderService.createOneTimeReminder(
			chatId,
			reminderText,
			reminderDate,
			async () => {
				await this.whatsappService.sendMessage(
					chatId,
					`🔔 *REMINDER*\n\n${reminderText}\n\n_Scheduled for ${reminderDate.toLocaleString()}_`
				)
			}
		)

		await this.reply(
			message,
			`✅ Got it! I'll remind you.\n\n` +
				`📌 *Reminder ID:* ${reminder.id}\n` +
				`💬 *Message:* ${reminderText}\n` +
				`⏰ *Time:* ${reminderDate.toLocaleString()}\n\n` +
				`_Use !cancel ${reminder.id} to cancel_`
		)
	}

	private getUsageMessage(): string {
		return (
			'❌ Invalid format!\n\n' +
			'Use: *!remind* <message> *at* <date/time>\n\n' +
			'📝 Examples:\n' +
			'• !remind Call mom at 2024-12-25 10:00\n' +
			'• !remind Team meeting at 2024-11-01 15:30\n' +
			'• !remind Doctor appointment at Dec 1 2024 9:00 AM'
		)
	}
}
