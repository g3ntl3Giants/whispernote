/**
 * @file UploadScreen/index.test.tsx.
 */
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import UploadScreen from './index';

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  types: {audio: 'audio/*'},
}));

jest.mock('axios', () => ({
  post: jest.fn(),
}));

jest.mock('@env', () => ({
  API_ENDPOINT: 'https://api.example.com',
}));

describe('UploadScreen', () => {
  it('renders the Upload Audio button', () => {
    const {getByLabelText} = render(<UploadScreen />);
    expect(getByLabelText('Upload Audio')).toBeTruthy();
  });

  it('calls DocumentPicker.pick when the Upload Audio button is pressed', async () => {
    const {getByLabelText} = render(<UploadScreen />);
    fireEvent.press(getByLabelText('Upload Audio'));

    await waitFor(() => {
      expect(DocumentPicker.pick).toHaveBeenCalledTimes(1);
    });
  });

  it('shows the TranscriptionModal when there is a transcription', async () => {
    const {getByLabelText, queryByLabelText} = render(<UploadScreen />);
    expect(queryByLabelText('Open Text')).toBeNull();

    // Mock the DocumentPicker and axios responses
    DocumentPicker.pick.mockResolvedValueOnce({
      uri: 'file://test',
      type: 'audio/*',
      name: 'test',
    });
    axios.post.mockResolvedValueOnce({
      data: {transcription: 'Test transcription'},
    });

    fireEvent.press(getByLabelText('Upload Audio'));

    await waitFor(() => {
      expect(getByLabelText('Open Text')).toBeTruthy();
    });
  });
});
