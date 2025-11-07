import { Client, LocalAuth } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

const client = new Client({ authStrategy: new LocalAuth() })

client.on('qr', (qr) => qrcode.generate(qr, { small: true }))
client.on('ready', () => console.log('✅ Client is ready!'))
client.on('message', async (msg) => {
	console.log('📩 Message received:', msg.body)
	if (msg.body.toLowerCase() === '!ping') {
		await msg.reply('🏓 Pong!')
	}
})

client.initialize()
