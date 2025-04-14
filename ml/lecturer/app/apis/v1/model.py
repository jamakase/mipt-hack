from pydantic import BaseModel

class InputS2t(BaseModel):
    file_path: str

class OutputS2t(BaseModel):
    result: list[dict]

class InputSum(BaseModel):
    text: str

class OutputSum(BaseModel):
    result: str

class InputCl(BaseModel):
    text: str

class OutputCl(BaseModel):
    result: list[str]
