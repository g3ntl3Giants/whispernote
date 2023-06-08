import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UploadScreen from '@whispernote/screens/UploadScreen';

type AppStackParamList = {
  Upload: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Upload" component={UploadScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
