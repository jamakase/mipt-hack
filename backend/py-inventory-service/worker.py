import os
import time
import requests

from celery import Celery
from celery import chain, group, chord
from .text_utils import summarize_lecture_with_timings

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")

s2t_model_url = os.environ.get("SPEECH_TO_TEXT_MODEL_URL", "http://localhost:8080/v1/s2t")
summarize_model_url = os.environ.get("SUMMARIZATION_MODEL_URL", "http://localhost:8080/v1/summarization")
classification_model_url = os.environ.get("CLASSIFICATION_MODEL_URL", "http://localhost:8080/v1/classification")
inventory_service_url = os.environ.get("INVENTORY_SERVICE_URL", "http://localhost:8080")
llm_model_url=os.environ.get("LLM_MODEL_URL", "http://localhost:8080/v1/invoke")
llm_promt = os.environ.get("LLM_MODEL_PROMT", 'Найди одно слово, для которого дается определение в следующих предложениях и верни ответ с этим словом. ')

@celery.task(name="create_task")
def create_task(lecture_id, file_path):
    print(f'Creating tasks for lecture {lecture_id} file {file_path}...')
    group_task = group(save_chunks.s(), terms.s(), summ.s())
    chain(s2t.s(lecture_id, file_path), group_task).delay()
    print("task 1")
    return True


@celery.task(name="s2t")
def s2t(lecture_id, file_path):
    print(f's2t sending request for lecture {lecture_id} file {file_path}...')
    response = requests.post(s2t_model_url, json={'file_path': file_path})
    print(f's2t completed. {response.status_code}')
    if response.status_code == 200:
        json = {}
        json['chunks'] = response.json()['result']
        json['lecture_id'] = lecture_id
        json['file_path'] = file_path
        print(f's2t response {json}')
        return json
    else:
        raise Exception(f's2t model responded with wrong code')


@celery.task(name="summ")
def summ(result):
    chunks = result['chunks']
    lecture_id = result['lecture_id']
    print(f'sending summarize request...')
    # Join all chunk texts into a single string for summarization
    combined_chunks = ""
    for chunk in chunks:
        # Extract text from each chunk and append to the combined string
        text = chunk.get('text', '')
        combined_chunks += text
    text = summarize_lecture_with_timings(combined_chunks)
    
    # Ensure text is always a string
    if not isinstance(text, str):
        if isinstance(text, list):
            text = '\n\n'.join(text)
        else:
            text = str(text)
    
    body = {'sum': text}
    print(f'sending summarize request... {body}')
    response = requests.post(inventory_service_url + f'/inventory/lecture/{lecture_id}/summ_feedback',
                                 json=body)
    if response.status_code != 200:
        raise Exception(f'inventory service responded with wrong code {response.status_code}')
    return text


@celery.task(name="terms")
def terms(result):
    chunks = result['chunks']
    lecture_id = result['lecture_id']
    print(f'creating new terms request...')
    response = requests.post(classification_model_url, json={'text': "".join([chunk['text'] for chunk in chunks])})
    if response.status_code == 200:
        terms = response.json()['result']
        real_terms = []
        for term in terms:
            print(f'Calling llm model for term {term}')
            term_response = requests.post(llm_model_url, json={"txt": llm_promt + term})
            if (term_response.status_code == 200):
                print(f'Llm response for term {term} is ${term_response.json()["txt"]}')
                real_terms.append({'term': term_response.json()['txt'], 'meaning': term})
            else:
                print(f'Llm model responded with wrong code. Using default term {term}')
                real_terms.append({'term': term, 'meaning': term})
        response = requests.post(inventory_service_url + f'/inventory/lecture/{lecture_id}/class_feedback', json=real_terms)
        if response.status_code != 200:
            raise Exception(f'inventory service responded with wrong code')
        return terms
    else:
        raise Exception(f'classification model responded with wrong code')


@celery.task(name="save_chunks")
def save_chunks(result):
    chunks = result['chunks']
    lecture_id = result['lecture_id']
    print(f'saving chunks {chunks} for lecture {lecture_id}')
    response = requests.post(inventory_service_url + f'/inventory/lecture/{lecture_id}/text-chunks', json=[
        {"content": chunk['text'], "from": chunk['timestamp'][0], "to": chunk['timestamp'][1]} for chunk in chunks])
    if response.status_code != 200:
        raise Exception(f'inventory service responded with wrong code')
    return