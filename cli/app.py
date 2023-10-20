# app.py

# CLI imports
import os
import moviepy.editor as mp
import openai
import time
import logging
from dotenv import load_dotenv
from tqdm import tqdm

# Local imports
from process_audio import transcribe_audio

logging.basicConfig(filename='whispernote.log')

def extract_audio_from_video(video_path: str, audio_path: str) -> None:
    """
    Extract audio from a given video file.
    """
    try:
        clip = mp.VideoFileClip(video_path)
        clip.audio.write_audiofile(audio_path, codec='mp3')
        clip.close()
    except Exception as e:
        logging.error(f"Error extracting audio from {video_path}: {e}")


def transcribe_directory(directory):
    print(" Beginning transcribe_directory")
    load_dotenv()
    openai.api_key = os.getenv('OPENAI_API_KEY')

    video_extensions = ['.mov', '.mp4', '.avi', '.wmv']

    audio_files = [
        f for f in os.listdir(directory)
        if os.path.isfile(os.path.join(directory, f))
        ]
    video_files = [
        f for f in audio_files
        if os.path.splitext(f)[1].lower() in video_extensions
        ]

    for filename in tqdm(audio_files + video_files, desc="Processing files"):
        print('Processing files')
        start_time = time.time()
        if filename in video_files:
            video_path = os.path.join(directory, filename)
            audio_path = os.path.join(
                directory, f"{os.path.splitext(filename)[0]}.wav"
                )
            print("Extracting Audio from Video")
            extract_audio_from_video(video_path, audio_path)
            print("Processing Audio into Transcription")
            transcriptions = transcribe_audio(audio_path)
            print("Finished Processing Transcriptions")
        else:
            print("Processing Audio into Transcription")
            transcriptions = transcribe_audio(os.path.join(directory, filename))
            print("Finished Processing Transcriptions")

        # Create a new directory for the file
        new_directory = os.path.join(directory, os.path.splitext(filename)[0])
        os.makedirs(new_directory, exist_ok=True)

        # Write the raw transcription to a file
        with open(os.path.join(new_directory, 'raw_transcription.txt'), 'w') as f:
            f.write(f"Time taken to transcribe: {time.time() - start_time} seconds\n")
            f.write(transcriptions['raw'])

        # Write the formatted transcription to a file
        with open(os.path.join(new_directory, 'formatted_transcription.txt'), 'w') as f:
            f.write(transcriptions['formatted_transcription'])


if __name__ == "__main__":
    # transcribe_directory('./audio_files')
    transcribe_directory('./video_data')
