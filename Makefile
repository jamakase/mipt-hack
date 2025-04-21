build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

up-detached:
	docker compose up -d

logs:
	docker compose logs -f

frontend:
	docker compose up app

backend:
	docker compose up inventory web worker

ml:
	docker compose up ml-llm ml-mock

restart:
	docker compose restart

clean:
	docker compose down -v
	docker system prune -f
