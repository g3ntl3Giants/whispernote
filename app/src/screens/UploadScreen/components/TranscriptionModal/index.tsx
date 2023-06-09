/**
 * @file @whispernote/screens/TranscriptionModal/index.tsx
 *  */
import React from 'react';
import {
  Text,
  Modal,
  View,
  StyleSheet,
  SectionList,
  FlatList,
  Alert,
} from 'react-native';
// import Clipboard from '@react-native-community/clipboard';

import {Button} from '@whispernote/appComponents';
// Update TranscriptionModalProps
interface TranscriptionModalProps {
  result: any;
  visible: boolean;
  toggleModal: () => void;
  onNext: () => void;
  onPrev: () => void;
}

// Update the Modal to display different types of results and add Next and Previous buttons
export const TranscriptionModal: React.FC<TranscriptionModalProps> = ({
  result,
  visible,
  toggleModal,
  onNext,
  onPrev,
}) => {
  const DATA = [
    {
      title: 'Summary',
      data: [result.summary],
    },
    {
      title: 'Notes',
      data: [result.notes],
    },
    {
      title: 'Synopsis',
      data: [result.synopsis],
    },
    {
      title: 'Raw Transcription',
      data: [result.raw_transcription.raw],
    },
  ];

  const handleLongPress = (text: string) => {
    // Clipboard.setString(text);
    Alert.alert('Copied to clipboard');
  };

  const BUTTONS = [
    {
      id: 1,
      text: 'Previous',
      handlePress: onPrev,
      accessHint: 'Previous result',
      accessLabel: 'Previous',
    },
    {
      id: 2,
      text: 'Next',
      handlePress: onNext,
      accessHint: 'Next result',
      accessLabel: 'Next',
    },
    {
      id: 3,
      text: 'Hide Modal',
      handlePress: toggleModal,
      accessHint: 'Closes the transcription modal',
      accessLabel: 'Hide Modal Button',
    },
  ];

  return (
    <View
      style={styles.centeredView}
      accessible={true}
      accessibilityLabel={'Transcription Modal'}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        accessibilityViewIsModal={true}
        onRequestClose={toggleModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item + index}
              renderItem={({item}) => (
                <Text
                  style={styles.modalText}
                  onLongPress={() => handleLongPress(item)}>
                  {item}
                </Text>
              )}
              renderSectionHeader={({section: {title}}) => (
                <Text style={styles.sectionHeader}>{title}</Text>
              )}
            />
            <FlatList
              data={BUTTONS}
              keyExtractor={item => item.id}
              horizontal={true}
              style={{paddingVertical: 10}}
              renderItem={({item}) => (
                <Button
                  handlePress={item.handlePress}
                  accessHint={item.accessHint}
                  accessLabel={item.accessLabel}
                  styles={{marginHorizontal: 5, paddingVertical: 5}}>
                  <Text style={styles.textStyle}>{item.text}</Text>
                </Button>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '80%', // adjust the height as per your need
    width: '90%', // adjust the width as per your need
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: '#333',
  },
});
