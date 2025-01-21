
# WhisperNote

WhisperNote is a multi-part application designed to transcribe and process audio/video content using OpenAI’s Whisper API. It includes:

- A React Native mobile app (`whispernote/app`)
- A Python CLI tool (`whispernote/cli`)
- A Python Flask server (`whispernote/server/WhisperFlask`)
- (Optionally) an Azure Function approach (`whispernote/server/WhisperAzureFunction`, not shown in detail here)

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation and Setup](#installation-and-setup)
   - [Setting Environment Variables](#setting-environment-variables)
   - [React Native App](#react-native-app)
   - [CLI](#cli)
   - [Flask Server](#flask-server)
5. [Usage](#usage)
   - [Running the React Native App](#running-the-react-native-app)
   - [Using the CLI for Transcription](#using-the-cli-for-transcription)
   - [Running the Flask Server](#running-the-flask-server)
6. [Testing](#testing)
7. [Contributing](#contributing)
8. [License](#license)

## Features

### React Native App
- Allows recording audio and sending files to a server for transcription.
- Uses React Navigation to manage screens.
- Built with TypeScript and Jest for testing.

### CLI Tool
- Processes directories of video/audio files.
- Extracts audio from video (using `moviepy`).
- Sends audio to OpenAI's API for transcription.
- Outputs raw and formatted transcriptions.

### Flask Server
- Provides an HTTP endpoint (`/api/uploadaudio`) for audio/video uploads.
- Splits large files into segments, transcribes each, and returns combined results.
- Generates a summary, notes, and a synopsis of the transcription.

### Azure Function (Optional/Preview)
- An alternative deployment approach for serverless environments.

## Project Structure

```bash
whispernote/
│
├── app/                 # React Native application
│   ├── package.json
│   ├── babel.config.js
│   ├── jest.config.js
│   └── ... 
│
├── cli/                 # Python CLI tool
│   ├── app.py
│   ├── process_audio.py
│   ├── requirements.txt
│   └── ...
│
└── server/             
    ├── WhisperFlask/    # Flask-based server
    │   ├── app.py
    │   ├── process_audio.py
    │   ├── requirements.txt
    │   └── ...
    └── WhisperAzureFunction/ # Azure Function (not shown in detail)
```

## Prerequisites

### OpenAI API Key
You must have a valid `OPENAI_API_KEY`. Obtain one from OpenAI.

### Node.js & Yarn (or npm)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or npm

### Python 3.8+
Python environment with `pip` (or your favorite dependency manager).

### Mobile Development Environment for React Native
- Xcode (for iOS on macOS)
- Android Studio / SDK (for Android)

## Installation and Setup

### Clone this repository (or your fork):
   ```bash
   git clone https://github.com/g3ntl3Giants/whispernote.git
   cd whispernote
   ```

### Setting Environment Variables
Create a `.env` file (or otherwise set environment variables) that includes your OpenAI key:

```makefile
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

Place it in:
- `whispernote/cli/.env` for the CLI
- `whispernote/server/WhisperFlask/.env` for the Flask server
- `whispernote/app/.env` if you plan to use environment variables in the RN app

**Note**: Configure your `.gitignore` to prevent committing API keys.

### React Native App
1. Navigate to the `app` directory:
   ```bash
   cd whispernote/app
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. (iOS only, on macOS) Install pods:
   ```bash
   cd ios && pod install && cd ..
   ```
4. Return to the app directory to run the app:
   ```bash
   yarn android
   # or
   yarn ios
   ```

### CLI
1. Navigate to the `cli` directory:
   ```bash
   cd whispernote/cli
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or on Windows: venv\Scriptsctivate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Make sure your `.env` file contains `OPENAI_API_KEY`.

### Flask Server
1. Go to the `WhisperFlask` directory:
   ```bash
   cd whispernote/server/WhisperFlask
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Ensure your `.env` file is present with `OPENAI_API_KEY`.

## Usage

### Running the React Native App
From `whispernote/app`, you can run:

```bash
# Android
yarn android

# iOS
yarn ios
```

### Using the CLI for Transcription
1. Place audio/video files in a directory, e.g., `./video_data`.
2. Run:
   ```bash
   python app.py
   ```
   This triggers the script to:
   - Identify video files (`.mov`, `.mp4`, `.avi`, `.wmv`).
   - Extract audio using `moviepy`.
   - Call OpenAI’s Whisper API for transcription.
   - Save raw and formatted transcriptions in subdirectories.

### Running the Flask Server
1. Start the server:
   ```bash
   python app.py
   ```
2. The server will run locally at `http://127.0.0.1:5000`.

To upload an audio/video file via HTTP POST:

- **Endpoint**: `POST /api/uploadaudio`
- **Form field name**: `file`

Example with `curl`:
```bash
curl -X POST -F "file=@path_to_your_audio.mp3" http://127.0.0.1:5000/api/uploadaudio
```

The server will:
- Split the file into segments (10 minutes each).
- Transcribe each segment via OpenAI API.
- Return a JSON response containing raw transcription, summary, notes, and synopsis.

## Testing

### React Native App
Inside `whispernote/app`, run:
```bash
yarn test
```
This uses Jest and can be further configured in `jest.config.js`.

### CLI
Currently, basic mock tests may exist. Check or create tests under the `cli` folder as desired.

### Flask Server
Similarly, add or integrate tests using Python’s `unittest` or `pytest`.

## Contributing
1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/my-new-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-new-feature`).
5. Open a pull request.

## License
TBA

---

**Happy Transcribing!** If you have any questions or issues, please open an issue or submit a pull request.
