/**
 * @file @whispernote/appComponents/Button.tsx
 *  */
import React from 'react';
import {Pressable, ViewStyle, StyleProp, StyleSheet} from 'react-native';

interface ButtonProps {
  handlePress: () => void;
  accessHint: string;
  accessLabel: string;
  children: React.ReactNode;
  styles?: StyleProp<ViewStyle>;
}

export const Button = (props: ButtonProps) => {
  return (
    <Pressable
      style={[buttonStyles.button, buttonStyles.buttonClose, props.styles]}
      onPress={props.handlePress}
      accessibilityRole={'button'}
      accessibilityLabel={props.accessLabel}
      accessibilityHint={props.accessHint}>
      {props.children}
    </Pressable>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});
