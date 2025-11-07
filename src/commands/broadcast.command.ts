import { BaseCommand } from './base.command'
import { CronParser } from '../utils/cron.parser'

export class BroadcastCommand extends BaseCommand {
	name = 'broadcast'
	description = 'Create a recurring broadcast to specific chats'
	pattern =
		/^!broadcast\s+(.+?)\s+(daily|weekly|monthly|every\s+\w+)\s+at\s+(.+?)\s+to\s+(.+)/i

	async execute(message: any, chatId: string): Promise<void> {
		const match = message.body.match(this.pattern)

		if (!match) {
			await this.reply(message, this.getUsageMessage())
			return
		}

		const messageText = match[1].trim()
		const frequency = match[2].trim().toLowerCase()
		const timeString = match[3].trim()
		const targetsString = match[4].trim()

		// Parse frequency
		const cronRule = CronParser.parseCronRule(frequency, timeString)
		if (!cronRule) {
			await this.reply(
				message,
				'❌ Could not parse the schedule. Please check the format.'
			)
			return
		}

		// Parse target chats
		const targetChatNames = targetsString
			.split(',')
			.map((name: string) => name.trim())
			.filter((name: string) => name.length > 0)

		if (targetChatNames.length === 0) {
			await this.reply(
				message,
				'❌ Please specify at least one target chat or group.'
			)
			return
		}

		// Search for matching chats
		const allMatchedChats: Array<{
			name: string
			id: string
			isGroup: boolean
		}> = []

		for (const targetName of targetChatNames) {
			const matches = await this.whatsappService.searchChats(targetName)
			if (matches.length === 0) {
				await this.reply(
					message,
					`⚠️ Could not find chat/group: "${targetName}"\n\n` +
						`Make sure you have an existing chat with this contact or group.`
				)
				return
			}

			if (matches.length > 1) {
				const list = matches
					.map(
						(c, i) =>
							`${i + 1}. ${c.name} ${c.isGroup ? '(Group)' : '(Contact)'}`
					)
					.join('\n')

				await this.reply(
					message,
					`❓ Multiple matches found for "${targetName}":\n\n${list}\n\n` +
						`Please use a more specific name.`
				)
				return
			}

			allMatchedChats.push({
				name: matches[0].name,
				id: matches[0].id,
				isGroup: matches[0].isGroup,
			})
		}

		// Create the broadcast
		const targetChatIds = allMatchedChats.map((c) => c.id)
		const reminder = this.reminderService.createRecurringReminder(
			chatId,
			messageText,
			frequency,
			cronRule,
			async () => {
				await this.whatsappService.sendMessageToMultiple(
					targetChatIds,
					`📢 *BROADCAST MESSAGE*\n\n${messageText}`
				)
			},
			targetChatIds
		)

		const targetsList = allMatchedChats
			.map((c) => `• ${c.name} ${c.isGroup ? '📁' : '👤'}`)
			.join('\n')

		await this.reply(
			message,
			`✅ Broadcast reminder set!\n\n` +
				`📌 *Reminder ID:* ${reminder.id}\n` +
				`💬 *Message:* ${messageText}\n` +
				`🔄 *Frequency:* ${frequency}\n` +
				`⏰ *Time:* ${timeString}\n` +
				`📤 *Sending to:*\n${targetsList}\n\n` +
				`_This will send ${frequency} to these chats. Use !cancel ${reminder.id} to stop._`
		)
	}

	private getUsageMessage(): string {
		return (
			'❌ Invalid format!\n\n' +
			'Use: *!broadcast* <message> <frequency> *at* <time> *to* <chat1>, <chat2>...\n\n' +
			'📝 Examples:\n' +
			'• !broadcast Good morning team! daily at 09:00 to Engineering Team, Sales Team\n' +
			'• !broadcast Weekly report time weekly at Monday 10:00 to Boss, Project Manager\n' +
			'• !broadcast Gym reminder every Mon,Wed,Fri at 18:00 to John, Fitness Group\n\n' +
			'💡 Tips:\n' +
			'• Separate multiple recipients with commas\n' +
			'• Works with both contacts and groups\n' +
			'• Use exact chat/group names\n' +
			'• Add 1-second delay between messages'
		)
	}
}

export class BroadcastOnceCommand extends BaseCommand {
	name = 'broadcast-once'
	description = 'Send a one-time message to specific chats'
	pattern = /^!broadcast-once\s+(.+?)\s+at\s+(.+?)\s+to\s+(.+)/i

	async execute(message: any, chatId: string): Promise<void> {
		const match = message.body.match(this.pattern)

		if (!match) {
			await this.reply(message, this.getUsageMessage())
			return
		}

		const messageText = match[1].trim()
		const dateTimeString = match[2].trim()
		const targetsString = match[3].trim()

		// Parse date
		const scheduledDate = new Date(dateTimeString)
		if (isNaN(scheduledDate.getTime())) {
			await this.reply(message, '❌ Invalid date format! Try: 2024-12-25 10:00')
			return
		}

		if (scheduledDate <= new Date()) {
			await this.reply(message, '❌ The date must be in the future!')
			return
		}

		// Parse target chats
		const targetChatNames = targetsString
			.split(',')
			.map((name: string) => name.trim())
			.filter((name: string) => name.length > 0)

		if (targetChatNames.length === 0) {
			await this.reply(
				message,
				'❌ Please specify at least one target chat or group.'
			)
			return
		}

		// Search for matching chats
		const allMatchedChats: Array<{
			name: string
			id: string
			isGroup: boolean
		}> = []

		for (const targetName of targetChatNames) {
			const matches = await this.whatsappService.searchChats(targetName)
			if (matches.length === 0) {
				await this.reply(
					message,
					`⚠️ Could not find chat/group: "${targetName}"`
				)
				return
			}

			if (matches.length > 1) {
				const list = matches
					.map(
						(c, i) =>
							`${i + 1}. ${c.name} ${c.isGroup ? '(Group)' : '(Contact)'}`
					)
					.join('\n')

				await this.reply(
					message,
					`❓ Multiple matches found for "${targetName}":\n\n${list}\n\n` +
						`Please use a more specific name.`
				)
				return
			}

			allMatchedChats.push({
				name: matches[0].name,
				id: matches[0].id,
				isGroup: matches[0].isGroup,
			})
		}

		// Create the one-time broadcast
		const targetChatIds = allMatchedChats.map((c) => c.id)
		const reminder = this.reminderService.createOneTimeReminder(
			chatId,
			messageText,
			scheduledDate,
			async () => {
				await this.whatsappService.sendMessageToMultiple(
					targetChatIds,
					`📢 *SCHEDULED MESSAGE*\n\n${messageText}`
				)
			},
			targetChatIds
		)

		const targetsList = allMatchedChats
			.map((c) => `• ${c.name} ${c.isGroup ? '📁' : '👤'}`)
			.join('\n')

		await this.reply(
			message,
			`✅ Broadcast scheduled!\n\n` +
				`📌 *Reminder ID:* ${reminder.id}\n` +
				`💬 *Message:* ${messageText}\n` +
				`⏰ *Time:* ${scheduledDate.toLocaleString()}\n` +
				`📤 *Sending to:*\n${targetsList}\n\n` +
				`_Use !cancel ${reminder.id} to cancel_`
		)
	}

	private getUsageMessage(): string {
		return (
			'❌ Invalid format!\n\n' +
			'Use: *!broadcast-once* <message> *at* <date/time> *to* <chat1>, <chat2>...\n\n' +
			'📝 Examples:\n' +
			'• !broadcast-once Meeting in 10 mins at 2024-12-25 10:00 to Team A, Team B\n' +
			'• !broadcast-once Happy New Year! at 2025-01-01 00:00 to All Friends, Family\n\n' +
			'💡 Tips:\n' +
			'• Separate multiple recipients with commas\n' +
			'• Works with both contacts and groups\n' +
			'• Use exact chat/group names'
		)
	}
}

export class ListChatsCommand extends BaseCommand {
	name = 'chats'
	description = 'List all available chats and groups'
	pattern = /^!chats(\s+(.+))?$/i

	async execute(message: any): Promise<void> {
		const match = message.body.match(this.pattern)
		const searchQuery = match?.[2]?.trim()

		let chats
		if (searchQuery) {
			chats = await this.whatsappService.searchChats(searchQuery)
		} else {
			chats = await this.whatsappService.getAllChats()
		}

		if (chats.length === 0) {
			await this.reply(
				message,
				searchQuery
					? `📭 No chats found matching "${searchQuery}"`
					: '📭 No chats available'
			)
			return
		}

		// Group by type
		const contacts = chats.filter((c) => !c.isGroup)
		const groups = chats.filter((c) => c.isGroup)

		// Limit to 20 chats per type to avoid message length issues
		const maxDisplay = 20
		let response = searchQuery
			? `🔍 *Search Results for "${searchQuery}":*\n\n`
			: '📋 *Your Chats and Groups:*\n\n'

		if (groups.length > 0) {
			response += '📁 *Groups:*\n'
			groups.slice(0, maxDisplay).forEach((chat, i) => {
				response += `${i + 1}. ${chat.name}\n`
			})
			if (groups.length > maxDisplay) {
				response += `... and ${groups.length - maxDisplay} more groups\n`
			}
			response += '\n'
		}

		if (contacts.length > 0) {
			response += '👤 *Contacts:*\n'
			contacts.slice(0, maxDisplay).forEach((chat, i) => {
				response += `${i + 1}. ${chat.name}\n`
			})
			if (contacts.length > maxDisplay) {
				response += `... and ${contacts.length - maxDisplay} more contacts\n`
			}
		}

		response += '\n_Use these exact names in broadcast commands_'

		await this.reply(message, response)
	}
}
