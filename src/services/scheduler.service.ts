import * as schedule from 'node-schedule'
import { Logger } from '../utils/logger'

export class SchedulerService {
	private logger: Logger

	constructor() {
		this.logger = new Logger('SchedulerService')
	}

	scheduleOneTime(date: Date, callback: () => Promise<void>): any {
		this.logger.debug(`Scheduling one-time job for ${date.toISOString()}`)
		return schedule.scheduleJob(date, callback)
	}

	scheduleRecurring(
		rule: schedule.RecurrenceRule,
		callback: () => Promise<void>
	): any {
		this.logger.debug(
			`Scheduling recurring job with rule: ${JSON.stringify(rule)}`
		)
		return schedule.scheduleJob(rule, callback)
	}
}
