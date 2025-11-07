import { ClientOptions } from 'whatsapp-web.js'
import * as os from 'os'
import * as fs from 'fs'

export class WhatsAppConfig {
	/**
	 * Get Chrome/Chromium executable path based on platform
	 */
	private static getChromePath(): string | undefined {
		const platform = os.platform()

		switch (platform) {
			case 'darwin': // macOS
				return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

			case 'linux':
				// Try common paths
				const linuxPaths = [
					'/usr/bin/google-chrome-stable',
					'/usr/bin/google-chrome',
					'/usr/bin/chromium-browser',
					'/usr/bin/chromium',
					'/snap/bin/chromium',
				]

				// Return first existing path or undefined
				for (const path of linuxPaths) {
					if (fs.existsSync(path)) {
						return path
					}
				}
				return undefined

			case 'win32': // Windows
				const windowsPaths = [
					'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
					'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
					process.env.LOCALAPPDATA +
						'\\Google\\Chrome\\Application\\chrome.exe',
				]

				for (const path of windowsPaths) {
					if (fs.existsSync(path)) {
						return path
					}
				}
				return undefined

			default:
				return undefined
		}
	}

	/**
	 * Get optimized Puppeteer configuration
	 */
	static getPuppeteerConfig() {
		const executablePath = this.getChromePath()

		return {
			headless: true,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-accelerated-2d-canvas',
				'--no-first-run',
				'--no-zygote',
				'--disable-gpu',
				'--disable-extensions',
				'--disable-software-rasterizer',
				'--disable-background-timer-throttling',
				'--disable-backgrounding-occluded-windows',
				'--disable-renderer-backgrounding',
			],
			executablePath, // Will be undefined if using bundled Chromium
		}
	}

	/**
	 * Get WhatsApp Web version cache configuration
	 */
	static getWebVersionCache() {
		return {
			type: 'remote' as const,
			remotePath:
				'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
		}
	}

	/**
	 * Get complete WhatsApp client configuration
	 */
	static getClientOptions(): ClientOptions {
		const LocalAuth = require('whatsapp-web.js').LocalAuth

		return {
			authStrategy: new LocalAuth({
				dataPath: '.wwebjs_auth',
			}),
			puppeteer: this.getPuppeteerConfig(),
			webVersionCache: this.getWebVersionCache(),
		}
	}

	/**
	 * Alternative configuration for Docker/Cloud environments
	 */
	static getDockerClientOptions(): ClientOptions {
		const LocalAuth = require('whatsapp-web.js').LocalAuth

		return {
			authStrategy: new LocalAuth({
				dataPath: '.wwebjs_auth',
			}),
			puppeteer: {
				headless: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-dev-shm-usage',
					'--disable-accelerated-2d-canvas',
					'--no-first-run',
					'--no-zygote',
					'--single-process',
					'--disable-gpu',
				],
				executablePath: process.env.CHROME_BIN || '/usr/bin/chromium-browser',
			},
			webVersionCache: this.getWebVersionCache(),
		}
	}

	/**
	 * Configuration for development with debugging
	 */
	static getDevClientOptions(): ClientOptions {
		const LocalAuth = require('whatsapp-web.js').LocalAuth

		return {
			authStrategy: new LocalAuth({
				dataPath: '.wwebjs_auth',
			}),
			puppeteer: {
				headless: false, // Show browser for debugging
				devtools: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--window-size=1280,720',
				],
				executablePath: this.getChromePath(),
			},
			webVersionCache: this.getWebVersionCache(),
		}
	}
}
