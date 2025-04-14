from fastapi import FastAPI, status

from app.apis import v1_router

import logging


app = FastAPI(title='ml service',
              description='Fastapi service for lecture',
              version='0.1')

# Adding v1 namespace route
app.include_router(v1_router)
logging.info('router add succeed')


@app.get('/health',
         tags=['System probs'])
def health() -> int:
    return status.HTTP_200_OK
