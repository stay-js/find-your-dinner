# Runs infra-setup, infra-start, setup, migrate and dev recipes in sequence
default: infra-setup infra-start setup migrate dev

# Starts infra containers using docker compose
[group('infra')]
[working-directory: 'infra']
infra-start:
    docker compose up -d

# Stops infra containers
[working-directory: 'infra']
[group('infra')]
infra-stop:
    docker compose stop

# Removes infra containers
[working-directory: 'infra']
[group('infra')]
infra-remove *FLAGS:
    docker compose down {{FLAGS}}

# Creates infra configuration (`.env` file)
[working-directory: 'infra']
[group('infra')]
infra-setup:
    #!/bin/bash
    if [ -f ".env" ]; then
        echo ".env file already exists. Skipping..."
    else
        echo ".env file does not exist. Copying from .env.example..."
        cp .env.example .env
    fi

# Dumps the database to `infra/dump/` directory
[working-directory: 'infra']
[group('infra')]
[group('drizzle')]
db-dump:
    bash dump-db.sh

# Installs dependencies and creates web app configuration (`.env` file)
[group('web')]
[working-directory: 'web']
setup:
    #!/bin/bash
    if [ -d "node_modules" ]; then
        echo "node_modules already exists. Skipping dependency installation..."
    else
        echo "Installing dependencies..."
        pnpm install
    fi

    if [ -f ".env" ]; then
        echo ".env file already exists. Skipping..."
    else
        echo ".env file does not exist. Copying from .env.example..."
        cp .env.example .env
    fi

# Starts the development web server
[group('web')]
[working-directory: 'web']
dev:
    -pnpm run dev

# Builds web project
[group('web')]
[working-directory: 'web']
build:
    pnpm run build

# Starts the production web server
[group('web')]
[working-directory: 'web']
start:
    -pnpm run start

# Lints web project via ESLint
[group('web')]
[working-directory: 'web']
lint *FLAGS:
    pnpm run lint {{FLAGS}}

# Formats web project via Prettier
[group('web')]
[working-directory: 'web']
format:
    pnpm run format

# Executes a command inside web directory with current npm runner. Usage: just exec <command>
[group('web')]
[working-directory: 'web']
exec *ARGS:
    pnpm {{ARGS}}

# Generates migration from schema changes
[group('drizzle')]
[working-directory: 'web']
generate *FLAGS:
    pnpm run db:generate {{FLAGS}}

# Push schema to database
[group('drizzle')]
[working-directory: 'web']
push:
    pnpm run db:push

# Runs pending database migrations
[group('drizzle')]
[working-directory: 'web']
migrate:
    pnpm run db:migrate

# Resets database and runs all migrations
[group('drizzle')]
[working-directory: 'web']
migrate-fresh:
    pnpm run db:migrate:fresh

# Start drizzle studio
[group('drizzle')]
[working-directory: 'web']
studio:
    -pnpm run db:studio

# Seeds the database with initial data
[group('drizzle')]
[working-directory: 'web']
seed:
    pnpm run db:seed

# Generates DBML schema file from Drizzle schema
[group('drizzle')]
[working-directory: 'web']
dbml:
    pnpm run db:generate:dbml

# Runs unit tests, API tests and E2E tests
[group('tests')]
[working-directory: 'web']
test: test-unit test-api test-e2e

# Runs unit tests with Vitest
[group('tests')]
[working-directory: 'web']
test-unit +ARGS="tests/unit":
    pnpm run test {{ARGS}}

# Runs API tests with Vitest
[group('tests')]
[working-directory: 'web']
test-api +ARGS="tests/api":
    pnpm run test {{ARGS}}

# Runs API tests with Vitest and generates coverage report
[group('tests')]
[working-directory: 'web']
test-api-coverage +ARGS="tests/api":
    pnpm run test:coverage {{ARGS}}

# Runs API and unit tests with Vitest in watch mode
[group('tests')]
[working-directory: 'web']
test-watch:
    -pnpm run test:watch

# Runs E2E tests with Playwright
[group('tests')]
[working-directory: 'web']
test-e2e:
    -pnpm run test:e2e

# Runs E2E tests with Playwright in headed mode
[group('tests')]
[working-directory: 'web']
test-e2e-headed:
    -pnpm run test:e2e:headed

# Runs E2E tests with Playwright UI mode
[group('tests')]
[working-directory: 'web']
test-e2e-ui:
    pnpm run test:e2e:ui
