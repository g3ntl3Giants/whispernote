# __init__.py

import logging
import os
import azure.functions as func
from .process_audio import process_audio
from werkzeug.utils import secure_filename
import openai
from dotenv import load_dotenv

def main(req: func.HttpRequest) -> func.HttpResponse:
    load_dotenv()
    openai.api_key = os.getenv('OPENAI_API_KEY')

    logging.info('Python HTTP trigger function processed a request.')

    if req.method == 'POST':
        file = req.files['file']
        if file:
            filename = secure_filename(file.name)
            file.save(filename)

            transcription = process_audio(filename)

             # Create a response
            response = func.HttpResponse(body=transcription, mimetype="text/plain")

            # Add Access-Control-* headers
            response.headers['Access-Control-Allow-Origin'] = "*"
            response.headers['Access-Control-Allow-Methods'] = "POST, OPTIONS"
            response.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"

            return response
        else:
            return func.HttpResponse("No file uploaded", status_code=400)
    else:
        return func.HttpResponse("Method not allowed", status_code=405)