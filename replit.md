# WhatsApp Reminder Bot

## Project Overview
A professional WhatsApp reminder bot built with TypeScript that manages one-time and recurring reminders. The bot responds to commands sent by the owner in any chat and sends reminders back to those specific chats.

## Current State
The project has been successfully configured to run in the Replit environment. The bot is operational and displays a QR code for WhatsApp authentication.

## Architecture
- **Language**: TypeScript (Node.js)
- **Main Dependencies**:
  - whatsapp-web.js - WhatsApp Web automation
  - puppeteer - Browser automation
  - node-schedule - Task scheduling
  - qrcode-terminal - QR code display for authentication

## Project Structure
```
src/
├── index.ts                    # Application entry point
├── config/
│   ├── environment.ts          # Environment configuration
│   └── whatsapp.config.ts      # WhatsApp client configuration
├── types/
│   └── reminder.types.ts       # TypeScript interfaces
├── services/
│   ├── whatsapp.service.ts     # WhatsApp client management
│   ├── reminder.service.ts     # Reminder business logic
│   └── scheduler.service.ts    # Job scheduling
├── handlers/
│   └── message.handler.ts      # Message routing
├── commands/                   # Command implementations
│   ├── help.command.ts
│   ├── remind.command.ts
│   ├── recurrinng.command.ts
│   ├── list.command.ts
│   ├── cancel.command.ts
│   └── broadcast.command.ts
├── utils/
│   ├── date.parser.ts
│   ├── cron.parser.ts
│   └── logger.ts
└── repositories/
    └── reminder.repository.ts  # Data access layer
```

## Key Features
- One-time reminders with date/time parsing
- Recurring reminders (daily, weekly, monthly, custom)
- Reminder management (list, cancel)
- Broadcast capabilities
- Clean architecture with SOLID principles

## Commands
- `!remind <message> at <date/time>` - Set one-time reminder
- `!recurring <message> <frequency> at <time>` - Set recurring reminder
- `!list` - View all reminders
- `!cancel <id>` - Cancel a reminder
- `!help` - Show help message
- `!broadcast` - Broadcast commands
- `!chats` - List available chats

## Environment Configuration
The bot uses the following environment variables (managed via Replit Secrets):
- `NODE_ENV` - Environment mode (development/production)
- `LOG_LEVEL` - Logging verbosity (info/debug/error)
- `ONLY_RESPOND_TO_OWNER` - Only respond to owner messages (default: true)
- `OWNER_NUMBER` - Optional specific number filter

## Replit Setup
- **Workflow**: Console application running `npm run dev`
- **System Dependencies**: Chromium and related libraries for WhatsApp Web automation
- **Port**: No web server (console-only application)

## How to Use
1. Run the project - a QR code will appear in the console
2. Scan the QR code with WhatsApp (Settings > Linked Devices > Link a Device)
3. Once connected, send commands in any WhatsApp chat
4. The bot will respond and send reminders to those specific chats

## Recent Changes
- 2025-11-10: Configured for Replit environment
  - Fixed TypeScript configuration (commonjs modules)
  - Installed Chromium and system dependencies
  - Updated WhatsApp config to auto-detect Nix Chromium path
  - Removed unused LocalAuth import
  - Successfully tested bot initialization

## Notes
- The bot stores WhatsApp session data locally in `.wwebjs_auth/`
- Reminders are currently stored in-memory (can be upgraded to database)
- The bot runs as a personal assistant and only responds to the owner
