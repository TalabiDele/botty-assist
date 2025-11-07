import * as schedule from 'node-schedule'
import { DateParser } from './date.parser'

export class CronParser {
	static parseCronRule(
		frequency: string,
		timeString: string
	): schedule.RecurrenceRule | null {
		const timeParts = DateParser.parseTime(timeString)
		if (!timeParts) return null

		const { hour, minute, dayOfWeek, dayOfMonth } = timeParts
		const rule = new schedule.RecurrenceRule()

		// Optionally set timezone (adjust if needed)
		// rule.tz = 'Africa/Lagos'

		if (frequency === 'daily') {
			rule.hour = hour
			rule.minute = minute
			return rule
		}

		if (frequency === 'weekly') {
			rule.dayOfWeek = dayOfWeek !== null ? dayOfWeek : 1 // default to Monday
			rule.hour = hour
			rule.minute = minute
			return rule
		}

		if (frequency === 'monthly') {
			rule.date = dayOfMonth !== null ? dayOfMonth : 1
			rule.hour = hour
			rule.minute = minute
			return rule
		}

		if (frequency.startsWith('every')) {
			const daysMatch = frequency.match(/every\s+(.*)/i)
			if (daysMatch) {
				const days = DateParser.parseDaysOfWeek(daysMatch[1])
				if (days.length > 0) {
					rule.dayOfWeek = days
					rule.hour = hour
					rule.minute = minute
					return rule
				}
			}
		}

		return null
	}
}
