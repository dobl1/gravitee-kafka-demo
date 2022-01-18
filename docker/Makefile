# Retrieve current file name, must be done before doing "include .env" ...
makefile := $(MAKEFILE_LIST)

# TODO: check environment: zx, docker-compose, mongo tools, .env exists, license file, swagger generator license
# TODO: use the mongo container to restore/dump seeds

help: ## Print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(makefile) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

clean: ## Clean the Docker environment
	# stopping everything
	docker-compose --env-file .env -f ./docker-compose.yml -p kafka-local --project-directory . down
	# clean all volumes
	#docker volume rm gravitee-demo_data-mongodb || true
	#docker volume rm gravitee-demo_data-elasticsearch || true

start: ## Start the platform-demo
	docker-compose --env-file .env -f ./docker-compose.yml -p kafka-local --project-directory . up -d

stop: ## Stop the platform-demo
	docker-compose -f ./docker-compose.yml -p kafka-local down
