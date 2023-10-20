# gpt.py

import openai
import logging
from typing import List, Dict


class TranscriptionFormatter:
    """
    Class to format transcriptions using the OpenAI GPT-4 model.
    """
    DEFAULT_PARAMS: Dict[str, float] = {
        "temperature": 0.75,
        "frequency_penalty": 0.2,
        "presence_penalty": 0
    }

    def __init__(self, model: str = "gpt-4", system_prompt: str = "You are a helpful AI Assistant"):
        """
        Initializes the TranscriptionFormatter with a specified model and system prompt.

        :param model: The OpenAI model to use. Default is "gpt-4".
        :param system_prompt: The initial system prompt for the conversation.
        """
        self.model = model
        self.conversation: List[Dict[str, str]] = []  # To store the conversation history
        self.system_prompt = system_prompt

    def format_transcription(self, transcription: str, **kwargs) -> str:
        """
        Formats the given transcription using the GPT-4 model.

        :param transcription: The raw transcription text to be formatted.
        :param kwargs: Optional parameters to adjust temperature, frequency_penalty, and presence_penalty.
        :return: Formatted transcription text.
        """
        params = {**self.DEFAULT_PARAMS, **kwargs}
        messages = self.conversation.copy()
        messages.insert(0, {"role": "system", "content": self.system_prompt})
        
        # Construct the prompt for the model
        prompt = f"Format the following transcription:\n{transcription}"
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = openai.ChatCompletion.create(
              model=self.model,
              temperature=params['temperature'],
              frequency_penalty=params['frequency_penalty'],
              presence_penalty=params['presence_penalty'],
              messages=messages
            )
            formatted_transcription = response['choices'][0]['message']['content']
            print("Successfully formatted the transcription.")
            return formatted_transcription

        except Exception as e:
            logging.error("Error in formatting transcription:\n")
            logging.error(e)
            return transcription  # Return the original transcription in case of error
