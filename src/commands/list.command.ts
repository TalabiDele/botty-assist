import { BaseCommand } from './base.command'

export class ListCommand extends BaseCommand {
	name = 'list'
	description = 'List all reminders'
	pattern = /^!list$/i

	async execute(message: any, chatId: string): Promise<void> {
		const userReminders = this.reminderService.getUserReminders(chatId)

		if (userReminders.length === 0) {
			await this.reply(
				message,
				'📭 You have no active reminders.\n\nUse *!help* to see how to create one!'
			)
			return
		}

		let response = '📋 *Your Active Reminders:*\n\n'

		const oneTime = userReminders.filter((r) => r.type === 'one-time')
		const recurring = userReminders.filter((r) => r.type === 'recurring')

		if (oneTime.length > 0) {
			response += '⏰ *One-time Reminders:*\n'
			oneTime.forEach((r) => {
				const reminder = r as any
				response += `\n*ID ${r.id}:* ${r.text}\n`
				response += `📅 ${reminder.scheduledDate.toLocaleString()}\n`
			})
		}

		if (recurring.length > 0) {
			response += '\n🔄 *Recurring Reminders:*\n'
			recurring.forEach((r) => {
				const reminder = r as any
				response += `\n*ID ${r.id}:* ${r.text}\n`
				response += `🔁 ${reminder.frequency}\n`
			})
		}

		response += '\n_Use !cancel <id> to remove a reminder_'

		await this.reply(message, response)
	}
}
