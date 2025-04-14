FROM python:3.11-slim as base

WORKDIR /app
COPY requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
COPY app ./app

RUN mkdir -p /app/models


# Образ для разработки
FROM base as dev
CMD uvicorn app.main:app --host=0.0.0.0 --port=8080 --reload
