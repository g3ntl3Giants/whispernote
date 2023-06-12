/**
 * @file @whispernote/screens/TranscriptionModal/index.test.tsx
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {TranscriptionModal} from './index';

describe('TranscriptionModal', () => {
  it('renders the transcription sections', () => {
    const testResult = {
      summary: 'Test summary',
      notes: 'Test notes',
      synopsis: 'Test synopsis',
      raw_transcription: 'Test raw transcription',
    };
    const {getByText} = render(
      <TranscriptionModal
        result={testResult}
        visible={true}
        toggleModal={() => {}}
        onNext={() => {}}
        onPrev={() => {}}
      />,
    );
    expect(getByText('Test summary')).toBeTruthy();
    expect(getByText('Test notes')).toBeTruthy();
    expect(getByText('Test synopsis')).toBeTruthy();
    expect(getByText('Test raw transcription')).toBeTruthy();
  });

  it('calls the toggleModal function when the Hide Modal button is pressed', () => {
    const mockToggleModal = jest.fn();
    const {getByText} = render(
      <TranscriptionModal
        result={{summary: '', notes: '', synopsis: '', raw_transcription: ''}}
        visible={true}
        toggleModal={mockToggleModal}
        onNext={() => {}}
        onPrev={() => {}}
      />,
    );

    fireEvent.press(getByText('Hide Modal'));
    expect(mockToggleModal).toHaveBeenCalledTimes(1);
  });

  it('calls the onNext and onPrev functions when the Next and Previous buttons are pressed', () => {
    const mockOnNext = jest.fn();
    const mockOnPrev = jest.fn();
    const {getByText} = render(
      <TranscriptionModal
        result={{summary: '', notes: '', synopsis: '', raw_transcription: ''}}
        visible={true}
        toggleModal={() => {}}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />,
    );

    fireEvent.press(getByText('Next'));
    expect(mockOnNext).toHaveBeenCalledTimes(1);

    fireEvent.press(getByText('Previous'));
    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });
});
