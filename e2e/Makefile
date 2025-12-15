.PHONY: *
SHELL := /bin/bash

run-e2e:
ifdef CI
	@if grep -q localhost ../frontend/.env; then \
	  echo "Warning: The frontend .env file contains 'localhost'."; \
	  echo "This should be replaced with 'host.docker.internal' when running the tests in Docker."; \
	  exit 1; \
	fi

	rm -rf ./screenshots
	mkdir ./screenshots
	chmod a+w ./screenshots

	# The "unsafely-treat-insecure-origin-as-secure" flag is required to
	# use the Web Crypto API from the insecure origin "host.docker.internal"

	docker run --rm \
	  -v $(PWD):/e2e -w /e2e \
	  --add-host=host.docker.internal:host-gateway \
	  -e START_URL=http://host.docker.internal:5173 \
	  -e K6_BROWSER_ARGS=no-sandbox,unsafely-treat-insecure-origin-as-secure=http://host.docker.internal:5173 \
	  grafana/k6:latest-with-browser run index.js
else
	rm -rf ./screenshots/*
	K6_BROWSER_HEADLESS=$${HEADLESS:-true} \
	START_URL=http://localhost:5173 \
	  k6 run index.js
endif
