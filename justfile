runner := if `command -v pnpm` != "" { "pnpm" } else { "npm" }

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

# Creates infra configuration (.env file)
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

# Installs dependencies and creates web app configuration (.env file)
[group('web')]
[working-directory: 'web']
setup:
    #!/bin/bash
    if [ -d "node_modules" ]; then
        echo "node_modules already exists. Skipping dependency installation..."
    else
        echo "Installing dependencies..."
        {{runner}} install
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
    -{{runner}} run dev

# Builds web project
[group('web')]
[working-directory: 'web']
build:
    {{runner}} run build

# Starts the production web server
[group('web')]
[working-directory: 'web']
start:
    -{{runner}} run start

# Lints web project
[group('web')]
[working-directory: 'web']
lint *FLAGS:
    {{runner}} run lint {{FLAGS}}

# Executes a command inside web directory with current npm runner. Usage: just exec <command>
[group('web')]
[working-directory: 'web']
exec *ARGS:
    {{runner}} {{ARGS}}

# Generates migration from schema changes
[group('drizzle')]
[working-directory: 'web']
generate *FLAGS:
    {{runner}} run db:generate {{FLAGS}}

# Push schema to database
[group('drizzle')]
[working-directory: 'web']
push:
    {{runner}} run db:push

# Runs pending database migrations
[group('drizzle')]
[working-directory: 'web']
migrate:
    {{runner}} run db:migrate

# Resets database and runs all migrations
[group('drizzle')]
[working-directory: 'web']
migrate-fresh:
    {{runner}} run db:migrate:fresh

# Start drizzle studio
[group('drizzle')]
[working-directory: 'web']
studio:
    -{{runner}} run db:studio

# Seeds the database with initial data
[group('drizzle')]
[working-directory: 'web']
seed:
    {{runner}} run db:seed

# Generates DBML schema file from Drizzle schema
[group('drizzle')]
[working-directory: 'web']
dbml:
    {{runner}} run db:generate:dbml

# Runs API tests and E2E tests
[group('tests')]
[working-directory: 'web']
test: test-api test-e2e

# Runs all tests (API and E2E)
[group('tests')]
[working-directory: 'web']
test-api *ARGS:
    {{runner}} run test:api {{ARGS}}

# Runs API tests with Vitest and generates coverage report
[group('tests')]
[working-directory: 'web']
test-api-coverage *ARGS:
    {{runner}} run test:api:coverage {{ARGS}}

# Runs API tests with Vitest in watch mode
[group('tests')]
[working-directory: 'web']
test-api-watch:
    -{{runner}} run test:api:watch

# Runs E2E tests with Playwright
[group('tests')]
[working-directory: 'web']
test-e2e:
    -{{runner}} run test:e2e

# Runs E2E tests with Playwright in headed mode
[group('tests')]
[working-directory: 'web']
test-e2e-headed:
    -{{runner}} run test:e2e:headed

# Runs E2E tests with Playwright UI mode
[group('tests')]
[working-directory: 'web']
test-e2e-ui:
    {{runner}} run test:e2e:ui
