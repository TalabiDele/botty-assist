import { ParsedTime } from '../types/reminder.types'

export class DateParser {
	private static readonly DAY_MAP: Record<string, number> = {
		sunday: 0,
		sun: 0,
		monday: 1,
		mon: 1,
		tuesday: 2,
		tue: 2,
		wednesday: 3,
		wed: 3,
		thursday: 4,
		thu: 4,
		friday: 5,
		fri: 5,
		saturday: 6,
		sat: 6,
	}

	static parseDate(dateTimeString: string): Date | null {
		const date = new Date(dateTimeString)
		return isNaN(date.getTime()) ? null : date
	}

	static parseTime(timeString: string): ParsedTime | null {
		const lowerTime = timeString.toLowerCase()

		// Parse day of week
		let dayOfWeek: number | null = null
		for (const [day, num] of Object.entries(this.DAY_MAP)) {
			if (lowerTime.includes(day)) {
				dayOfWeek = num
				break
			}
		}

		// Parse day of month
		const dayOfMonthMatch = timeString.match(/(\d+)(st|nd|rd|th)?/)
		const dayOfMonth = dayOfMonthMatch ? parseInt(dayOfMonthMatch[1]) : null

		// Parse time (HH:MM or H:MM AM/PM)
		const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i)
		if (!timeMatch) return null

		let hour = parseInt(timeMatch[1])
		const minute = parseInt(timeMatch[2])
		const ampm = timeMatch[3]

		if (ampm) {
			if (ampm.toLowerCase() === 'pm' && hour !== 12) hour += 12
			if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0
		}

		return { hour, minute, dayOfWeek, dayOfMonth }
	}

	static parseDaysOfWeek(daysString: string): number[] {
		const days: number[] = []
		const parts = daysString.toLowerCase().split(',')

		for (const part of parts) {
			const day = part.trim()
			if (this.DAY_MAP[day] !== undefined) {
				days.push(this.DAY_MAP[day])
			}
		}

		return days
	}
}
