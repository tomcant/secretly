.PHONY: *
SHELL := /bin/bash
COMPOSE := docker compose
EXEC := $(COMPOSE) exec

start: up db

stop:
	$(COMPOSE) down -v --remove-orphans

restart: stop start

up:
	$(COMPOSE) up -d --build --force-recreate --remove-orphans

db: db/dev db/test
db/%:
	@echo "Creating database secretly_$*"
	@$(EXEC) database psql -U postgres -c "DROP DATABASE IF EXISTS secretly_$*" >/dev/null 2>&1
	@$(EXEC) database psql -U postgres -c "CREATE DATABASE secretly_$*" >/dev/null 2>&1
	@$(EXEC) -e APP_ENV=$* backend uv run alembic upgrade head >/dev/null 2>&1

can-release:
	@$(MAKE) format-check
	@$(MAKE) lint
	@$(MAKE) test

test: db/test
	@$(EXEC) -e APP_ENV=test backend uv run pytest --capture=no

test/%:
	@$(EXEC) -e APP_ENV=test backend uv run pytest --capture=no -k $*

lint:
	@$(EXEC) backend uvx ruff check

lint-fix:
	@$(EXEC) backend uvx ruff check --fix

format:
	@$(EXEC) backend uv format --preview-features format

format-check:
	@$(EXEC) backend uv format --check --preview-features format

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

shell:
	$(EXEC) backend bash
