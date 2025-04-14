from pydantic import BaseModel

class InputBase(BaseModel):
    txt: str

class OutputBase(BaseModel):
    txt: str
