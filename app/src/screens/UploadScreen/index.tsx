/**
 * @file UploadScreen/index.tsx.
 */

import React, {useState} from 'react';
import {
  Platform,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import FormData from 'form-data';

import {
  WHISPER_API_ENDPOINT_IOS,
  WHISPER_API_ENDPOINT_ANDROID,
  APP_ENV,
  WHISPER_API_ENDPOINT as WHISPER_API_ENDPOINT_DEFAULT,
} from '@env';
import {TranscriptionModal} from './components';
import {Button} from '@whispernote/appComponents/Button';

// local full stack development. TODO: remove this when cloud function is deployed
let WHISPER_API_ENDPOINT: string;
if (APP_ENV === 'development') {
  WHISPER_API_ENDPOINT =
    Platform.OS === 'ios'
      ? WHISPER_API_ENDPOINT_IOS
      : WHISPER_API_ENDPOINT_ANDROID;
} else {
  WHISPER_API_ENDPOINT = WHISPER_API_ENDPOINT_DEFAULT;
}
console.log('APP_ENV:', APP_ENV);

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
  const [transcription, setTranscription] = useState<string | null>(transcript);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
    setLoading(true);
    try {
      const formData: FormData = new FormData();

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      console.log(`${Platform.OS} res: + ${JSON.stringify(res)}`);
      formData.append('file', {
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      });

      console.log(`${Platform.OS} formData:`, formData);

      const response = await axios.post(WHISPER_API_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // response.data is now an array of results for each segment
      const results = response?.data;

      // Loop through the results array
      for (const result of results) {
        const {summary, notes, synopsis, raw_transcription} = result;
        console.log(`${Platform.OS} summary:`, summary);
        console.log(`${Platform.OS} notes:`, notes);
        console.log(`${Platform.OS} synopsis:`, synopsis);
        console.log(`${Platform.OS} raw_transcription:`, raw_transcription);
      }

      setAllResults(results);
      // const transcriptionResponse: string = response?.data?.raw_transcription;

      // Save the Transcription in state
      // setTranscription(transcriptionResponse);
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
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle the visibility of the modal
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {!loading && (
        <Button
          handlePress={pickDocument}
          accessHint="Upload an audio file"
          accessLabel="Upload Audio">
          <Text style={styles.textStyle}>Upload Audio</Text>
        </Button>
      )}
      {/* Show the ActivityIndicator only if loading is true */}
      {loading && <ActivityIndicator size="large" color="#800080" />}
      {/* Show the Transcription button only if there is a Transcription */}
      {allResults.length > 0 && !loading && (
        <View style={{marginTop: 10}}>
          <Button
            handlePress={toggleModal}
            accessHint="Open the transcription"
            accessLabel="Open Transcription">
            <Text style={styles.textStyle}>Open Transcription</Text>
          </Button>
          <TranscriptionModal
            result={allResults[currentIndex]}
            visible={modalVisible}
            toggleModal={toggleModal}
            onPrev={() =>
              setCurrentIndex(
                (currentIndex - 1 + allResults.length) % allResults.length,
              )
            }
            onNext={() =>
              setCurrentIndex((currentIndex + 1) % allResults.length)
            }
          />
        </View>
      )}
    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
