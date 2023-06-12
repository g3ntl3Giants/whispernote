# process_audio.py
import openai

def transcribe_audio(audio_file):
    # This function will send the audio file to Whisper ASR API and return the transcription
    transcription = openai.Audio.transcribe("whisper-1", audio_file)
    return transcription

def process_audio(file_path):
    transcription = transcribe_audio(file_path)

    return transcription
