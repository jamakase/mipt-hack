import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

from app.config import S2T_PATH


device = "cuda:0" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"

s2t_pipe = pipeline(
    "automatic-speech-recognition",
    model=S2T_PATH,
    max_new_tokens=128,
    chunk_length_s=30,
    batch_size=16,
    return_timestamps=True,
    device=device,)
