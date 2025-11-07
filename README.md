# WhatsApp Reminder Bot

A professional, enterprise-grade WhatsApp bot built with TypeScript that manages
one-time and recurring reminders with a clean, maintainable architecture.

## 🎯 How It Works

**Important:** This bot is a **personal assistant** that responds to YOUR
messages only.

- ✅ Send `!remind` command in ANY chat (personal or group)
- ✅ The bot (running on your WhatsApp) processes your command
- ✅ The reminder gets sent back to THAT specific chat at the scheduled time
- ❌ The bot ignores messages from other people

### Example Workflow

1. **You send** in a group chat: `!remind Team standup daily at 09:00`
2. **Bot confirms** in that group: "✅ Recurring reminder set!"
3. **Every day at 9 AM**, bot sends reminder to that group chat

This means you can set reminders in:

- 📱 Personal chats with friends
- 👥 Group chats
- 💼 Work groups
- 📝 Your own "Saved Messages" chat

## 🏗️ Architecture

This project follows SOLID principles and clean architecture patterns:

```
src/
├── index.ts                    # Application entry point
├── config/
│   └── environment.ts          # Environment configuration
├── types/
│   └── reminder.types.ts       # TypeScript interfaces and types
├── services/
│   ├── whatsapp.service.ts     # WhatsApp client management
│   ├── reminder.service.ts     # Business logic for reminders
│   └── scheduler.service.ts    # Job scheduling abstraction
├── handlers/
│   └── message.handler.ts      # Message routing and command execution
├── commands/
│   ├── base.command.ts         # Abstract command base class
│   ├── remind.command.ts       # One-time reminder command
│   ├── recurring.command.ts    # Recurring reminder command
│   ├── list.command.ts         # List reminders command
│   ├── cancel.command.ts       # Cancel reminder command
│   └── help.command.ts         # Help command
├── utils/
│   ├── date.parser.ts          # Date parsing utilities
│   ├── cron.parser.ts          # Cron rule generation
│   └── logger.ts               # Logging utility
└── repositories/
    └── reminder.repository.ts  # Data access layer
```

## 🚀 Features

- ✅ **One-time reminders** - Set reminders for specific dates/times
- 🔄 **Recurring reminders** - Daily, weekly, monthly, and custom schedules
- 📋 **Reminder management** - List, cancel, and track all reminders
- 🏛️ **Clean architecture** - Separation of concerns, SOLID principles
- 📝 **TypeScript** - Full type safety and IntelliSense support
- 🧪 **Testable** - Dependency injection and interfaces for easy testing
- 📊 **Logging** - Structured logging for debugging and monitoring
- 🔒 **Type-safe** - Strict TypeScript configuration

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Build the project
npm run build
```

## 🛠️ Development

```bash
# Run in development mode with hot reload
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## 🏃 Running the Bot

```bash
# Production
npm start

# Development
npm run dev
```

When you first run the bot, scan the QR code with WhatsApp to authenticate.

## 💬 Commands

### One-time Reminders

```
!remind <message> at <date/time>
```

**Examples:**

- `!remind Call dentist at 2024-12-15 14:00`
- `!remind Team meeting at Dec 20 2024 3:00 PM`

### Recurring Reminders

```
!recurring <message> <frequency> at <time>
```

**Examples:**

- `!recurring Standup daily at 09:00`
- `!recurring Team sync weekly at Monday 10:00`
- `!recurring Pay rent monthly at 1st 09:00`
- `!recurring Gym every Mon,Wed,Fri at 18:00`

### Management

- `!list` - View all your reminders
- `!cancel <id>` - Cancel a specific reminder
- `!help` - Show help message

## 🏛️ Design Patterns

### Command Pattern

Each command is a separate class implementing the `ICommand` interface, making
it easy to add new commands without modifying existing code.

### Repository Pattern

Data access is abstracted through the repository layer, making it easy to swap
in-memory storage for a database.

### Dependency Injection

Services receive dependencies through constructors, making the code testable and
loosely coupled.

### Strategy Pattern

Different reminder types (one-time, recurring) are handled through type
discrimination.

## 🔧 Configuration

Edit `.env` file to customize:

- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging verbosity

## 🗄️ Database Integration (Future)

The architecture is designed to easily integrate a database. Simply:

1. Implement a new repository that extends the interface
2. Replace `ReminderRepository` with your database implementation
3. Add database connection in the configuration

Example databases supported:

- PostgreSQL
- MongoDB
- MySQL
- SQLite

## 🧪 Testing

The architecture supports easy unit testing:

```typescript
// Example test structure
describe('ReminderService', () => {
	let service: ReminderService
	let mockRepo: jest.Mocked<ReminderRepository>
	let mockScheduler: jest.Mocked<SchedulerService>

	beforeEach(() => {
		mockRepo = createMockRepository()
		mockScheduler = createMockScheduler()
		service = new ReminderService(mockRepo, mockScheduler)
	})

	it('should create a one-time reminder', async () => {
		// Test implementation
	})
})
```

## 📈 Scalability

To scale the bot:

1. **Add database** - Replace in-memory storage with PostgreSQL/MongoDB
2. **Add Redis** - For distributed job scheduling
3. **Add message queue** - Use Bull/RabbitMQ for job processing
4. **Containerize** - Create Docker containers for easy deployment
5. **Add monitoring** - Integrate Prometheus/Grafana for metrics

## 🔐 Security Considerations

- WhatsApp session data is stored locally (`.wwebjs_auth/`)
- Add authentication to restrict bot access to specific users
- Implement rate limiting to prevent abuse
- Add input validation and sanitization
- Use environment variables for sensitive data

## 📝 Code Quality

This project uses:

- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Consistent code formatting
- **TypeScript strict mode** - Maximum type safety
- **Conventional commits** - Clear commit messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [node-schedule](https://github.com/node-schedule/node-schedule)

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ using TypeScript and Clean Architecture principles**
