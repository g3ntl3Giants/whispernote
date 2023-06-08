# process_audio.py
import openai

def transcribe_audio(audio_file_path):
    # This function will send the audio file to Whisper ASR API and return the transcription
    with open(audio_file_path, 'rb') as audio_file:
        transcription = openai.Audio.transcribe("whisper-1", audio_file)
    return {'raw': transcription.text}

