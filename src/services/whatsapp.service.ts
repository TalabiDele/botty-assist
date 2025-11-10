import { Client, Message, Chat } from 'whatsapp-web.js'
import * as qrcode from 'qrcode-terminal'
import { Logger } from '../utils/logger'
import { WhatsAppConfig } from '../config/whatsapp.config'
import { Environment } from '../config/environment'
import { ChatInfo } from '../types/reminder.types'
import { MessageHandler } from '../handlers/message.handler'
import { ReminderService } from './reminder.service'

export class WhatsAppService {
        private client: Client
        private logger: Logger
        private messageHandler: MessageHandler
        private reminderService: ReminderService

        constructor(reminderService: ReminderService) {
                this.logger = new Logger('WhatsAppService')
                this.reminderService = reminderService

                // Use appropriate config based on environment
                const clientOptions =
                        process.env.DOCKER === 'true'
                                ? WhatsAppConfig.getDockerClientOptions()
                                : Environment.isDevelopment
                                        ? WhatsAppConfig.getClientOptions()
                                        : WhatsAppConfig.getClientOptions()

                this.client = new Client(clientOptions)
                this.messageHandler = new MessageHandler(this, this.reminderService)
                this.initializeEventHandlers()
        }

        private initializeEventHandlers(): void {
                this.client.on('qr', (qr: string) => {
                        this.logger.info('QR Code received. Please scan:')
                        qrcode.generate(qr, { small: true })
                })

                this.client.on('ready', () => {
                        this.logger.info('WhatsApp client is ready! 🤖')
                })

                this.client.on('auth_failure', (message: string) => {
                        this.logger.error('Authentication failed', new Error(message))
                })

                this.client.on('disconnected', (reason: string) => {
                        this.logger.warn('Client disconnected', reason)
                })

                this.client.on('message_create', async (message: Message) => {
                        try {
                                this.logger.debug(`📩 Message received: ${message.body}`)
                                // Delegate message handling to MessageHandler
                                await this.messageHandler.handle(message)
                        } catch (error) {
                                this.logger.error('Error handling message', error as Error)
                        }
                })
        }

        onMessage(handler: (message: Message) => Promise<void>): void {
                this.client.on('message', handler)
        }

        async sendMessage(chatId: string, message: string): Promise<void> {
                try {
                        await this.client.sendMessage(chatId, message)
                        this.logger.debug(`Message sent to ${chatId}`)
                } catch (error) {
                        this.logger.error('Failed to send message', error as Error)
                        throw error
                }
        }

        async sendMessageToMultiple(
                chatIds: string[],
                message: string
        ): Promise<void> {
                for (const chatId of chatIds) {
                        try {
                                await this.sendMessage(chatId, message)
                                // Add delay to avoid rate limiting
                                await new Promise((resolve) => setTimeout(resolve, 1000))
                        } catch (error) {
                                this.logger.error(`Failed to send message to ${chatId}`, error as Error)
                        }
                }
        }

        async searchChats(query: string): Promise<ChatInfo[]> {
                try {
                        const chats = await this.client.getChats()
                        const searchLower = query.toLowerCase()

                        const matchedChats = chats
                                .filter((chat) => chat.name.toLowerCase().includes(searchLower))
                                .map((chat) => ({
                                        id: chat.id._serialized,
                                        name: chat.name,
                                        isGroup: chat.isGroup,
                                }))

                        return matchedChats
                } catch (error) {
                        this.logger.error('Failed to search chats', error as Error)
                        return []
                }
        }

        async getChatById(chatId: string): Promise<Chat | null> {
                try {
                        const chat = await this.client.getChatById(chatId)
                        return chat
                } catch (error) {
                        this.logger.error(`Failed to get chat ${chatId}`, error as Error)
                        return null
                }
        }

        async getAllChats(): Promise<ChatInfo[]> {
                try {
                        const chats = await this.client.getChats()
                        return chats.map((chat) => ({
                                id: chat.id._serialized,
                                name: chat.name,
                                isGroup: chat.isGroup,
                        }))
                } catch (error) {
                        this.logger.error('Failed to get all chats', error as Error)
                        return []
                }
        }

        async initialize(): Promise<void> {
                try {
                        await this.client.initialize()
                        this.logger.info('WhatsApp service initialized')
                } catch (error) {
                        this.logger.error('Failed to initialize WhatsApp service', error as Error)
                        throw error
                }
        }

        async destroy(): Promise<void> {
                await this.client.destroy()
                this.logger.info('WhatsApp service destroyed')
        }
}
