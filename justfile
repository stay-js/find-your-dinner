# Runs setup-db, start-db, setup-web, migrate and start-web recipes in sequence
default: setup-db start-db setup-web migrate start-web

# Runs start-web recipe
dev: start-web

runner := if `command -v pnpm` != "" { "pnpm" } else { "npm" }

# Starts MySQL and PHPMyAdmin Docker containers
[group('db')]
[working-directory: 'db']
start-db:
    docker compose up -d

# Stops database containers
[working-directory: 'db']
[group('db')]
stop-db:
    docker compose down

# Creates database configuration (.env file)
[working-directory: 'db']
[group('db')]
setup-db:
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
setup-web:
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
start-web:
    -{{runner}} run dev

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
