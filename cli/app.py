# app.py

# CLI imports
import os
import openai
import time
from dotenv import load_dotenv
from tqdm import tqdm

# Local imports
from process_audio import transcribe_audio


def transcribe_directory(directory):
    load_dotenv()
    openai.api_key = os.getenv('OPENAI_API_KEY')

    audio_files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

    for filename in tqdm(audio_files, desc="Processing audio files"):
        start_time = time.time()
        transcriptions = transcribe_audio(os.path.join(directory, filename))

        # Create a new directory for the file
        new_directory = os.path.join(directory, os.path.splitext(filename)[0])
        os.makedirs(new_directory, exist_ok=True)

        # Write the raw transcription to a file
        with open(os.path.join(new_directory, 'raw_transcription.txt'), 'w') as f:
            f.write(f"Time taken to transcribe: {time.time() - start_time} seconds\n")
            f.write(transcriptions['raw'])

        # Write the formatted transcription to a file
        # with open(os.path.join(new_directory, 'formatted_transcription.txt'), 'w') as f:
        #     f.write(f"Time taken to format: {time.time() - start_time} seconds\n")
        #     f.write(transcriptions['formatted'])


if __name__ == "__main__":
    transcribe_directory('./audio_files')
