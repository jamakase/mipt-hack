from fastapi import UploadFile, File, status
from fastapi.routing import APIRouter

from app.apis.v1.model import InputBase, OutputBase
from app.core import interact

router = APIRouter(prefix="/v1")

@router.post('/invoke',
             description='llm',
             tags=['Inference endpoints'],
             status_code=status.HTTP_200_OK,
             response_model=OutputBase)
def process_base(input_: InputBase) -> OutputBase:
    result = interact(input_.txt)
    return OutputBase(txt=result)
