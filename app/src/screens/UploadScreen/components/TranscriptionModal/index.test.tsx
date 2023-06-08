// TranscriptionModal/index.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {TranscriptionModal} from '.';

describe('TranscriptionModal', () => {
  it('renders the transcription text', () => {
    const {getByText} = render(
      <TranscriptionModal
        transcription="Sample transcription"
        visible={true}
        toggleModal={() => {}}
      />,
    );
    expect(getByText('Sample transcription')).toBeTruthy();
  });

  it('calls the toggleModal function when the close button is pressed', () => {
    const mockToggleModal = jest.fn();
    const {getByText} = render(
      <TranscriptionModal
        transcription="Sample transcription"
        visible={true}
        toggleModal={mockToggleModal}
      />,
    );

    fireEvent.press(getByText('Close Text'));
    expect(mockToggleModal).toHaveBeenCalledTimes(1);
  });
});
