# Lecturer Platform

The Lecturer Platform is an integrated system designed to process and analyze educational content through AI-powered services including speech recognition, text summarization, classification, and large language model capabilities.

## How to Run

### Local Development with Docker Compose

```
cp .env.example .env
```

Добавьте, которые вы собираетесь использовать.

OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL_NAME=

```bash
# Build all services
make build up
```

## System Components

- backend:
    - Сервис, за бизнесс логику [inventory-service](backend/inventory-service)
    - Сервис, являющийся по сути API Gateway или Backend For Frontend  [py-inventory-service](backend/py-inventory-service)
- ml:
    - Сервис LLM [ml-service](ml/llm)
    - Сервис Speech-To-Text, Классификации и Суммаризации [ml-service](ml/lecturer)
- frontend:
    - Фронтенд [frontend](frontend)

## Architecture

The system includes:
- React frontend for user interaction
- Java Spring Boot backend for business logic
- Python FastAPI service for ML integration and task processing
- Speech-to-text conversion using Whisper model
- Text summarization and classification
- LLM capabilities for natural language processing
- Asynchronous task processing with Celery
- Data storage with PostgreSQL and Redis


UI example

![image](image.png)