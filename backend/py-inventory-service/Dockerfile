#FROM python:3.11-slim as python-base
#
## https://python-poetry.org/docs#ci-recommendations
#ENV POETRY_VERSION=1.6.1
#ENV POETRY_HOME=/opt/poetry
#ENV POETRY_VENV=/opt/poetry-venv
#
## Tell Poetry where to place its cache and virtual environment
#ENV POETRY_CACHE_DIR=/opt/.cache
#
## Create stage for Poetry installation
#FROM python-base as poetry-base
#
## Creating a virtual environment just for poetry and install it with pip
#RUN python3 -m venv $POETRY_VENV \
#	&& $POETRY_VENV/bin/pip install -U pip setuptools \
#	&& $POETRY_VENV/bin/pip install poetry==${POETRY_VERSION}
#
## Create a new stage from the base python image
#FROM python-base as example-app
#
## Copy Poetry to app image
#COPY --from=poetry-base ${POETRY_VENV} ${POETRY_VENV}
#
## Add Poetry to PATH
#ENV PATH="${PATH}:${POETRY_VENV}/bin"
#
#WORKDIR /app
#
## Copy Dependencies
#COPY pyproject.toml poetry.lock ./
#
### [OPTIONAL] Validate the project is properly configured
##RUN poetry check
#
## Install Dependencies
#RUN poetry install --no-interaction --no-cache
#
## Copy Application
#COPY . .
#
## Run Application
##EXPOSE 5000
#CMD [ "poetry", "run", "python", "-m", "flask", "run", "--host=0.0.0.0" ]

FROM python:3.11-slim as base

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends build-essential gcc-11 g++-11 clang

RUN python -m venv /opt/venv
# Make sure we use the virtualenv:
ENV \
    # pip
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    # env
    PATH="/opt/venv/bin:${PATH}"

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

FROM base
#
COPY ./worker.py ./main.py ./video_utils.py ./app/
#
#CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]