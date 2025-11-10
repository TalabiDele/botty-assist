import mongoose from 'mongoose'
import { Logger } from '../utils/logger'

const logger = new Logger('Database')

export const connectDB = async () => {
	try {
		const uri =
			process.env.MONGO_URI || 'mongodb://localhost:27017/whatsapp-bot'
		await mongoose.connect(uri)
		logger.info('✅ MongoDB connected successfully')
	} catch (error) {
		logger.error('❌ MongoDB connection failed', error as Error)
		process.exit(1)
	}
}
