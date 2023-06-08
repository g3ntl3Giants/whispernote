import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

// Assuming you have a function to check if the user is logged in
// Replace this function with your actual implementation
const isLoggedIn = () => {
  return true;
};

console.log('isLoggedIn:', isLoggedIn());

type RootStackParamList = {
  App: undefined;
  Auth: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn() ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
