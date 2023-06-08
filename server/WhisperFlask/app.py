# Flask imports
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import openai
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# Local imports
from process_audio import transcribe_audio

app = Flask(__name__)
CORS(app) # Initialize CORS
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/api/uploadaudio', methods=['POST'])
def process_audio_file():
    logging.info('Python HTTP trigger function processed a request.')

    if request.method == 'POST':
        if 'file' in request.files:
            file = request.files['file']
            filename = secure_filename(file.filename)
            file.save(filename)

            transcription = transcribe_audio(filename)

            return jsonify({"raw_transcription": transcription['raw']})
        else:
            return jsonify({"message": "No file uploaded"}), 400
    else:
        return jsonify({"message": "Method not allowed"}), 405

if __name__ == "__main__":
    app.run(debug=True)
