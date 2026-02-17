runner := if `command -v pnpm` != "" { "pnpm" } else { "npm" }

# Runs db-setup, db-start, web-setup, migrate and web-dev recipes in sequence
default: db-setup db-start web-setup migrate web-dev

# Runs web-dev recipe
[group('shortcuts')]
dev: web-dev

# Runs web-start recipe
[group('shortcuts')]
start: web-start

# Runs web-build recipe
[group('shortcuts')]
build: web-build

#Runs web-preview recipe
[group('shortcuts')]
preview: web-preview

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
web-setup:
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
web-dev:
    -{{runner}} run dev

# Builds web project
[group('web')]
[working-directory: 'web']
web-build:
    {{runner}} run build

# Starts the production web server
[group('web')]
[working-directory: 'web']
web-start:
    {{runner}} run start

# Builds web project and starts the production web server
[group('web')]
[working-directory: 'web']
web-preview:
    {{runner}} run preview

# Runs pending database migrations
[group('migrate')]
[working-directory: 'web']
migrate:
    {{runner}} run db:migrate

# Resets database and runs all migrations
[group('migrate')]
[working-directory: 'web']
migrate-fresh:
    {{runner}} run db:migrate:fresh
