# process_audio.py
import openai
import tiktoken
import nltk

from transcript_formatter_gpt import role

nltk.download('punkt')  # Download the Punkt tokenizer

def format_transcription(transcription):
    # This function uses GPT-3.5-turbo to format the transcription text
    # Get the encoder for the model
    encoder = tiktoken.encoding_for_model("gpt-3.5-turbo")

    # Split the transcription into sentences
    sentences = nltk.tokenize.sent_tokenize(transcription)

    formatted_transcription = ""
    section = []
    for sentence in sentences:
        tokens_in_sentence = list(encoder.encode(sentence))
        if sum(len(list(encoder.encode(sent))) for sent in section) + len(tokens_in_sentence) > 4096 - 100:
            # If the sentence doesn't fit in the current section, format the current section and start a new one
            formatted_transcription += format_section(section)
            section = [sentence]
        else:
            section.append(sentence)
    # Format the last section
    if section:
        formatted_transcription += format_section(section)

    return formatted_transcription


def format_section(section):
    # This function sends a section of sentences to the GPT-3.5-turbo model for formatting
    section_text = ' '.join(section)
    messages = [
        {"role": "system", "content": role},
        {"role": "user", "content": f"Format the following raw transcription into clear, readable text: {section_text}"},
    ]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.0
    )

    return response['choices'][0]['message']['content'].strip() +'\n\n'


def transcribe_audio(audio_file_path):
    # This function will send the audio file to Whisper ASR API and return the transcription
    with open(audio_file_path, 'rb') as audio_file:
        transcription = openai.Audio.transcribe("whisper-1", audio_file)
        # formatted_transcription = format_transcription(transcription.text)
    return {'raw': transcription.text}


def process_audio(file_path):
    transcription = transcribe_audio(file_path)

    return transcription
