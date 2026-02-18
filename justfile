runner := if `command -v pnpm` != "" { "pnpm" } else { "npm" }

# Runs db-setup, db-start, setup, migrate and dev recipes in sequence
default: db-setup db-start setup migrate dev

# Starts database containers using docker compose
[group('db')]
[working-directory: 'db']
db-start:
    docker compose up -d

# Stops database containers
[working-directory: 'db']
[group('db')]
db-stop:
    docker compose down

# Creates database configuration (.env file)
[working-directory: 'db']
[group('db')]
db-setup:
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
    {{runner}} run start

# Lints web project
[group('web')]
[working-directory: 'web']
lint *FLAGS:
    {{runner}} run lint {{FLAGS}}

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
    {{runner}} run db:studio
