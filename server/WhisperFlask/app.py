# Flask imports
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import openai
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import logging
from pydub import AudioSegment

# Local imports
from process_audio import transcribe_audio, summarize_transcription, write_notes, generate_synopsis

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # Initialize CORS
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/api/uploadaudio', methods=['POST'])
def process_audio_file():
    print('Python HTTP trigger function')

    if request.method == 'POST':
        if 'file' in request.files:
            file = request.files['file']
            filename = secure_filename(file.filename)
            print(f"Filename from request: {filename}")
            file.save(filename)

            results = []

            # split the audio from the video file into 10-minute segments
            segment_duration = 10 * 60 * 1000  # 10 minutes in milliseconds
            audio = AudioSegment.from_file(filename, filename[-3:])
            num_segments = int(len(audio) / segment_duration) + 1
            print(f"Number of segments: {num_segments}")
            for i in range(num_segments):
                segment = audio[i*segment_duration:(i+1)*segment_duration]
                segment_file_path = os.path.join(os.getcwd(), f"segment_{i}.mp3")
                segment.export(segment_file_path, format='mp3')

                # transcribe each segment of audio separately
                transcript = transcribe_audio(segment_file_path)

                # summarize the transcription
                summary = summarize_transcription(transcript)

                # write notes from the summary
                notes = write_notes(summary)

                # generate a synopsis from the notes
                synopsis = generate_synopsis(notes)

                results.append({
                    "raw_transcription": transcript,
                    "summary": summary,
                    "notes": notes,
                    "synopsis": synopsis
                })
            return jsonify(results)
        else:
            logging.error("No file uploaded")
            return jsonify({"message": "No file uploaded"}), 400
    else:
        logging.error("Method not allowed")
        return jsonify({"message": "Method not allowed"}), 405

if __name__ == "__main__":
    app.run(debug=True)
