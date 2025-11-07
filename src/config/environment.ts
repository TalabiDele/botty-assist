export class Environment {
	static readonly NODE_ENV = process.env.NODE_ENV || 'development'
	static readonly LOG_LEVEL = process.env.LOG_LEVEL || 'info'

	// Bot behavior configuration
	static readonly ONLY_RESPOND_TO_OWNER =
		process.env.ONLY_RESPOND_TO_OWNER !== 'false' // Default: true
	static readonly OWNER_NUMBER = process.env.OWNER_NUMBER || '' // Optional: specific number filter

	static get isDevelopment(): boolean {
		return this.NODE_ENV === 'development'
	}

	static get isProduction(): boolean {
		return this.NODE_ENV === 'production'
	}
}
