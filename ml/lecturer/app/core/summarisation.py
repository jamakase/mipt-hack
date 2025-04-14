import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

from app.config import SUM_PATH


class SumarisationPipe:

    def __init__(self, path):
        device = "cuda:0" if torch.cuda.is_available() else "cpu"
        # path = 'cointegrated/rut5-base-absum'
        self.model = T5ForConditionalGeneration.from_pretrained(path)
        self.tokenizer = T5Tokenizer.from_pretrained(path)
        self.model.eval()
        self.model.to(device)

    def summarise(self,
            text, n_words=None, compression=None,
            max_length=1000, num_beams=3, do_sample=False, repetition_penalty=10.0,
            **kwargs):
        """
        Summarize the text
        The following parameters are mutually exclusive:
        - n_words (int) is an approximate number of words to generate.
        - compression (float) is an approximate length ratio of summary and original text.
        """
        if n_words:
            text = '[{}] '.format(n_words) + text
        elif compression:
            text = '[{0:.1g}] '.format(compression) + text
        x = self.tokenizer(text, return_tensors='pt', padding=True).to(self.model.device)
        with torch.inference_mode():
            out = self.model.generate(
                **x,
                max_length=max_length, num_beams=num_beams,
                do_sample=do_sample, repetition_penalty=repetition_penalty,
                **kwargs)
        return self.tokenizer.decode(out[0], skip_special_tokens=True)

    def __call__(self, text):
        n = 2000
        res = []
        for chunk in [text[i:i + n] for i in range(0, len(text), n)]:
            res.append(self.summarise(chunk))
        return ' '.join(res)

summarisation_pipe = SumarisationPipe(SUM_PATH)
