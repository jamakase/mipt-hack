# Something great will be here

### kubernetes
```
helm repo add geekbrains-charts https://storage.yandexcloud.net/geekbrains-charts
helm install geekbrains-charts geekbrains-charts/geekbrains-lecturer
```

# Компоненты системы

- backend:
    - Сервис, за бизнесс логику [inventory-service](backend/inventory-service)
    - Сервис, являющийся по сути API Gateway или Backend For Frontend  [py-inventory-service](backend/py-inventory-service)
- ml:
    - Сервис LLM [ml-service](ml/llm)
    - Сервис Speech-To-Text, Классификации и Суммаризации [ml-service](ml/lecturer)
- frontend:
    - Фронтенд [frontend](frontend)