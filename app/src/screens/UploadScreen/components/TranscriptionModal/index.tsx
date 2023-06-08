// TranscriptionModal/index.tsx
import React from 'react';
import {Pressable, Text, Modal, ScrollView} from 'react-native';

interface TranscriptionModalProps {
  transcription: string;
  visible: boolean;
  toggleModal: () => void;
}

export const TranscriptionModal: React.FC<TranscriptionModalProps> = ({
  transcription,
  visible,
  toggleModal,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={toggleModal}>
      <ScrollView style={{margin: 20, backgroundColor: 'white', padding: 20}}>
        <Text>{transcription}</Text>
      </ScrollView>
      <Pressable
        onPress={toggleModal}
        style={{backgroundColor: 'black', padding: 10, margin: 20}}>
        <Text style={{color: 'white'}}>Close Text</Text>
      </Pressable>
    </Modal>
  );
};
