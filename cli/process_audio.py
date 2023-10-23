# process_audio.py

import os
import openai
import tiktoken
import logging

from pydub import AudioSegment
from pydub.silence import split_on_silence
from transcript_formatter_gpt import ROLE
from gpt import TranscriptionFormatter

def format_transcription(transcription):
    """
    Tokenize and chunk the transcription text, then format each chunk using a GPT-4 based model.
    
    :param transcription: Raw transcription text.
    :return: Formatted transcription text.
    """
    format_bot = TranscriptionFormatter("gpt-4", ROLE)

    # Tokenize and chunk the transcription
    enc = tiktoken.encoding_for_model("gpt-4")
    tokens = enc.encode(transcription)
    max_tokens = 4096

    # Iterate through chunks and format them
    formatted_transcription = ""
    for i in range(0, len(tokens), max_tokens):
        chunk_text = enc.decode(tokens[i:i + max_tokens])
        formatted_chunk = format_bot.format_transcription(chunk_text)
        formatted_transcription += formatted_chunk

    return formatted_transcription

def transcribe_audio(audio_file_path):
    """
    Transcribe audio that might be larger
    than the API's maximum limit
    by splitting it into smaller chunks.

    :param audio_path: Path to the audio file.
    :return: Dictionary containing raw and formatted transcriptions.
    """
    print('Transcribing audio')
    transcription_total = ""
    formatted_transcription_total = ""

    try:
        # Load the audio file
        print('Load the audio file')
        audio = AudioSegment.from_file(audio_file_path, format="mp3")

        # Split audio on silence
        print('Split audio on silence')
        chunks = split_on_silence(
            audio,
            min_silence_len=500,  # must be silent for at least 500ms
            silence_thresh=-40,    # consider it silent if quieter than -40 dBFS
            keep_silence=500,      # keep 500ms of leading/trailing silence
        )

        # Fallback: If silence splitting creates too large chunks, split audio into fixed-size chunks
        chunk_length = 10000  # 10 seconds in ms
        if any(len(chunk) > chunk_length for chunk in chunks):
            chunks = [audio[i:i+chunk_length] for i in range(0, len(audio), chunk_length)]

        # Transcribe each chunk and combine the results
        for i, chunk in enumerate(chunks):
            chunk_path = f"chunk_{i}.mp3"
            chunk.export(chunk_path, format="mp3")

            with open(chunk_path, 'rb') as audio_file:
                chunk_transcription = openai.Audio.transcribe("whisper-1", audio_file)
                transcription_total += chunk_transcription.text

            # Cleanup temporary chunk
            os.remove(chunk_path)
            print(f"Processed and removed chunk: {chunk_path}")

        formatted_transcription_total += format_transcription(transcription_total)

        print(f"Completed transcription for {audio_file_path}")
        return {'raw': transcription_total, 'formatted_transcription': formatted_transcription_total}

    except Exception as e:
        logging.error(f"Error transcribing {audio_file_path}:\n")
        logging.error(e)
        return {'raw': "", 'formatted_transcription': ""}