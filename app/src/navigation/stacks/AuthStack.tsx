import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@whispernote/screens/LoginScreen';
import SignUpScreen from '@whispernote/screens/SignUpScreen';

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
