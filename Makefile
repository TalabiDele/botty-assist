.PHONY: help install build dev start test lint format clean docker-build docker-up docker-down logs

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo '$(BLUE)WhatsApp Reminder Bot - Available Commands:$(NC)'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo '$(BLUE)Installing dependencies...$(NC)'
	npm install
	@echo '$(GREEN)✓ Dependencies installed$(NC)'

build: ## Build the TypeScript project
	@echo '$(BLUE)Building project...$(NC)'
	npm run build
	@echo '$(GREEN)✓ Build complete$(NC)'

dev: ## Run in development mode with hot reload
	@echo '$(BLUE)Starting development server...$(NC)'
	npm run dev

start: build ## Build and start the application
	@echo '$(BLUE)Starting application...$(NC)'
	npm start

test: ## Run tests
	@echo '$(BLUE)Running tests...$(NC)'
	npm test

test-watch: ## Run tests in watch mode
	@echo '$(BLUE)Running tests in watch mode...$(NC)'
	npm run test:watch

test-coverage: ## Run tests with coverage report
	@echo '$(BLUE)Running tests with coverage...$(NC)'
	npm run test:coverage
	@echo '$(GREEN)✓ Coverage report generated in coverage/$(NC)'

lint: ## Lint the code
	@echo '$(BLUE)Linting code...$(NC)'
	npm run lint
	@echo '$(GREEN)✓ Linting complete$(NC)'

lint-fix: ## Lint and fix the code
	@echo '$(BLUE)Linting and fixing code...$(NC)'
	npm run lint:fix
	@echo '$(GREEN)✓ Linting and fixing complete$(NC)'

format: ## Format code with Prettier
	@echo '$(BLUE)Formatting code...$(NC)'
	npm run format
	@echo '$(GREEN)✓ Code formatted$(NC)'

clean: ## Clean build artifacts and dependencies
	@echo '$(YELLOW)Cleaning project...$(NC)'
	rm -rf dist node_modules coverage .wwebjs_auth .wwebjs_cache
	@echo '$(GREEN)✓ Project cleaned$(NC)'

docker-build: ## Build Docker image
	@echo '$(BLUE)Building Docker image...$(NC)'
	docker-compose build
	@echo '$(GREEN)✓ Docker image built$(NC)'

docker-up: ## Start Docker containers
	@echo '$(BLUE)Starting Docker containers...$(NC)'
	docker-compose up -d
	@echo '$(GREEN)✓ Containers started$(NC)'

docker-down: ## Stop Docker containers
	@echo '$(BLUE)Stopping Docker containers...$(NC)'
	docker-compose down
	@echo '$(GREEN)✓ Containers stopped$(NC)'

docker-logs: ## View Docker container logs
	docker-compose logs -f whatsapp-bot

docker-restart: docker-down docker-up ## Restart Docker containers

docker-clean: ## Remove Docker containers and volumes
	@echo '$(YELLOW)Cleaning Docker resources...$(NC)'
	docker-compose down -v
	docker system prune -f
	@echo '$(GREEN)✓ Docker resources cleaned$(NC)'

logs: ## View application logs
	@if [ -d "logs" ]; then \
		tail -f logs/*.log; \
	else \
		echo '$(YELLOW)No log files found$(NC)'; \
	fi

setup: install ## Initial project setup
	@echo '$(BLUE)Setting up project...$(NC)'
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo '$(GREEN)✓ Created .env file$(NC)'; \
	else \
		echo '$(YELLOW).env file already exists$(NC)'; \
	fi
	@mkdir -p logs data
	@echo '$(GREEN)✓ Project setup complete$(NC)'

check: lint test ## Run linter and tests
	@echo '$(GREEN)✓ All checks passed$(NC)'

ci: install lint test build ## Run CI pipeline
	@echo '$(GREEN)✓ CI pipeline complete$(NC)'