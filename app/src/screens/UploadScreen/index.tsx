/**
 * @file UploadScreen/index.tsx.
 */

import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import FormData from 'form-data';

import {WHISPER_API_ENDPOINT} from '@env';
import {TranscriptionModal} from './components';

const audioFile: any = require('./Microsoft.m4a');
console.log('Audio file:', audioFile);

console.log('WHISPER_API_ENDPOINT:', WHISPER_API_ENDPOINT);

/**
 * The UploadScreen component renders a button that allows the user to
 * upload an audio file. When the button is pressed, a document picker
 * is displayed for the user to choose the audio file. After the file is
 * uploaded and processed, a second button appears to open the PDF transcript.
 *
 * @returns {JSX.Element} A React Native component.
 */
const UploadScreen = () => {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  /**
   * Handles document picking and upload.
   *
   * Opens a document picker for audio files and uploads the chosen file
   * to the server. After the server processes the file, it returns a string containing
   * the transcript, which is then stored in the transcription state variable.
   *
   * @async
   * @function
   */
  const pickDocument = async () => {
    try {
      const formData: FormData = new FormData();

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      console.log('res: ' + JSON.stringify(res));
      formData.append('file', {
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      });

      console.log('formData:', formData);

      const response = axios
        .post(WHISPER_API_ENDPOINT, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          console.log('response', response);
          return response;
        })
        .catch(err => console.error('Axios err:', err));

      const transcriptionResponse: string = response?.data?.raw_transcription;

      // Save the Transcription in state
      setTranscription(transcriptionResponse);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.error('User cancelled the picker');
      } else {
        console.error('Pick Document Error: ', err);
        if (err?.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(err?.response?.data);
          console.error(err?.response?.status);
          console.error(err?.response?.headers);
        }
      }
    }
  };

  // Function to toggle the visibility of the modal
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Pressable
        onPress={pickDocument}
        accessibilityRole="button"
        accessibilityLabel="Upload Audio">
        <Text style={{color: 'black'}}>Upload Audio</Text>
      </Pressable>
      {/* Show the Transcription button only if there is a Transcription */}
      {transcription && (
        <View>
          <Pressable
            onPress={() => toggleModal()}
            accessibilityRole="button"
            accessibilityLabel="Open Transcription">
            <Text style={{color: 'black', marginTop: 20}}>
              Open Transcription
            </Text>
          </Pressable>
          <TranscriptionModal
            transcription={transcription}
            visible={modalVisible}
            toggleModal={toggleModal}
          />
        </View>
      )}
    </View>
  );
};

export default UploadScreen;
