import { BaseCommand } from './base.command'
import { CronParser } from '../utils/cron.parser'

export class RecurringCommand extends BaseCommand {
	name = 'recurring'
	description = 'Create a recurring reminder'
	pattern =
		/^!recurring\s+(.+?)\s+(daily|weekly|monthly|every\s+\w+)\s+at\s+(.+)/i

	async execute(message: any, chatId: string): Promise<void> {
		const match = message.body.match(this.pattern)

		if (!match) {
			await this.reply(message, this.getUsageMessage())
			return
		}

		const reminderText = match[1].trim()
		const frequency = match[2].trim().toLowerCase()
		const timeString = match[3].trim()

		const cronRule = CronParser.parseCronRule(frequency, timeString)

		if (!cronRule) {
			await this.reply(
				message,
				'❌ Could not parse the schedule. Please check the format.'
			)
			return
		}

		const reminder = this.reminderService.createRecurringReminder(
			chatId,
			reminderText,
			frequency,
			cronRule,
			async () => {
				await this.whatsappService.sendMessage(
					chatId,
					`🔔 *RECURRING REMINDER*\n\n${reminderText}\n\n_${frequency} reminder_`
				)
			}
		)

		await this.reply(
			message,
			`✅ Recurring reminder set!\n\n` +
				`📌 *Reminder ID:* ${reminder.id}\n` +
				`💬 *Message:* ${reminderText}\n` +
				`🔄 *Frequency:* ${frequency}\n` +
				`⏰ *Time:* ${timeString}\n\n` +
				`_This will repeat ${frequency}. Use !cancel ${reminder.id} to stop._`
		)
	}

	private getUsageMessage(): string {
		return (
			'❌ Invalid format!\n\n' +
			'Use: *!recurring* <message> <frequency> *at* <time>\n\n' +
			'📝 Examples:\n' +
			'• !recurring Standup meeting daily at 09:00\n' +
			'• !recurring Team sync weekly at Monday 10:00\n' +
			'• !recurring Pay rent monthly at 1st 09:00\n' +
			'• !recurring Gym workout every Monday,Wednesday,Friday at 18:00'
		)
	}
}
