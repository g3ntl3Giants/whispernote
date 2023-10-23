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

    all_files = [
        f for f in os.listdir(directory)
        if os.path.isfile(os.path.join(directory, f)) and f != ".DS_Store"
    ]

    video_files = [
        f for f in all_files
        if os.path.splitext(f)[1].lower() in video_extensions
    ]

    # Standalone audio files are those in all_files but not in video_files
    standalone_audio_files = list(set(all_files) - set(video_files))

    # Process video files first
    for filename in tqdm(video_files, desc="Processing video files"):
        # Create a new directory for the file
        new_directory = os.path.join(directory, os.path.splitext(filename)[0])
        os.makedirs(new_directory, exist_ok=True)

        print('Processing files')
        start_time = time.time()

        video_path = os.path.join(directory, filename)
        audio_path = os.path.join(
            new_directory, f"{os.path.splitext(filename)[0]}.mp3"
        )
        print("Extracting Audio from Video")
        extract_audio_from_video(video_path, audio_path)

        print("Processing Audio into Transcription")
        transcriptions = transcribe_audio(audio_path)
        print("Finished Processing Transcriptions")

        # Write the raw transcription to a file
        with open(os.path.join(new_directory, 'raw_transcription.txt'), 'w') as f:
            f.write(f"Time taken to transcribe: {time.time() - start_time} seconds\\n")
            f.write(transcriptions['raw'])

        # Write the formatted transcription to a file
        with open(os.path.join(new_directory, 'formatted_transcription.txt'), 'w') as f:
            f.write(transcriptions['formatted_transcription'])

    # Process standalone audio files next
    for filename in tqdm(standalone_audio_files, desc="Processing standalone audio files"):
        new_directory = os.path.join(directory, os.path.splitext(filename)[0])
        os.makedirs(new_directory, exist_ok=True)

        print('Processing files')
        start_time = time.time()

        print("Processing Audio into Transcription")
        transcriptions = transcribe_audio(os.path.join(directory, filename))
        print("Finished Processing Transcriptions")

        # Write the raw transcription to a file
        with open(os.path.join(new_directory, 'raw_transcription.txt'), 'w') as f:
            f.write(f"Time taken to transcribe: {time.time() - start_time} seconds\\n")
            f.write(transcriptions['raw'])

        # Write the formatted transcription to a file
        with open(os.path.join(new_directory, 'formatted_transcription.txt'), 'w') as f:
            f.write(transcriptions['formatted_transcription'])


if __name__ == "__main__":
    transcribe_directory('./video_data')
