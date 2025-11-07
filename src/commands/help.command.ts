import { BaseCommand } from './base.command'

export class HelpCommand extends BaseCommand {
	name = 'help'
	description = 'Show help message'
	pattern = /^!help$/i

	async execute(message: any): Promise<void> {
		const helpText =
			'🤖 *WhatsApp Assistant Bot*\n\n' +
			"I'm your personal reminder assistant!\n" +
			'_I only respond to YOUR messages (not others)._\n\n' +
			'━━━━━━━━━━━━━━━━━━━\n' +
			'*📝 Personal Reminders:*\n\n' +
			'⏰ *One-time:*\n' +
			'`!remind <message> at <date/time>`\n' +
			'_Example:_ !remind Call dentist at 2024-12-15 14:00\n\n' +
			'🔄 *Recurring:*\n' +
			'`!recurring <message> <frequency> at <time>`\n' +
			'_Example:_ !recurring Standup daily at 09:00\n\n' +
			'━━━━━━━━━━━━━━━━━━━\n' +
			'*📢 Broadcast Messages:*\n\n' +
			'📤 *Send to Multiple Chats:*\n' +
			'`!broadcast <msg> <frequency> at <time> to <chats>`\n' +
			'_Example:_ !broadcast Good morning! daily at 08:00 to Team A, Team B\n\n' +
			'📨 *One-time Broadcast:*\n' +
			'`!broadcast-once <msg> at <time> to <chats>`\n' +
			'_Example:_ !broadcast-once Meeting at 10:00 to John, Sarah\n\n' +
			'📋 *List Available Chats:*\n' +
			'`!chats` - See all contacts and groups\n' +
			'`!chats <name>` - Search for specific chat\n\n' +
			'━━━━━━━━━━━━━━━━━━━\n' +
			'*🛠️ Manage:*\n' +
			'`!list` - View all your reminders\n' +
			'`!cancel <id>` - Cancel a reminder\n' +
			'`!help` - Show this help\n\n' +
			'━━━━━━━━━━━━━━━━━━━\n' +
			'*💡 Quick Examples:*\n\n' +
			'_Personal reminder in current chat:_\n' +
			'!remind Buy milk at 2024-12-20 18:00\n\n' +
			'_Daily message to work team:_\n' +
			'!broadcast Standup time! daily at 09:00 to Engineering Team\n\n' +
			'_Weekly reminder to multiple groups:_\n' +
			'!broadcast Report due weekly at Monday 16:00 to Boss, Project Manager\n\n' +
			'_One-time message to friends:_\n' +
			'!broadcast-once Party tonight! at 2024-12-25 18:00 to John, Sarah, Mike\n\n' +
			'━━━━━━━━━━━━━━━━━━━\n' +
			'*📝 Frequency Options:*\n' +
			'• `daily` - Every day\n' +
			'• `weekly` - Once a week (specify day)\n' +
			'• `monthly` - Once a month (specify date)\n' +
			'• `every Mon,Wed,Fri` - Custom days\n\n' +
			'_Type !chats to see your available contacts and groups_'

		await this.reply(message, helpText)
	}
}
