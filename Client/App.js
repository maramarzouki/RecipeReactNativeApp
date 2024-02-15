import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from './Screens/Signup';
import Singin from './Screens/Singin';
import EnterEmail from './Screens/SinginResetPasswordScreens/EnterEmail';
import EnterCode from './Screens/SinginResetPasswordScreens/EnterCode';
import ResetPassword from './Screens/SinginResetPasswordScreens/ResetPassword';
import Profile from './Screens/Profile';
import UpdateProfile from './Screens/UpdateProfile/UpdateProfile';
import { ToastProvider } from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='SignupScreen'>
          <Stack.Screen
            name='SignupScreen'
            component={Signup}
            options={{ headerShown: false }} />
          <Stack.Screen
            name='SigninScreen'
            component={Singin}
            options={{ headerShown: false }} />
          <Stack.Screen
            name='EnterEmailScreen'
            component={EnterEmail}
            options={{ headerShown: false }} />
          <Stack.Screen
            name='EnterCodeScreen'
            component={EnterCode}
            options={{ headerShown: false }} />
          <Stack.Screen
            name='ResetPasswordScreen'
            component={ResetPassword}
            options={{ headerShown: false }} />
          <Stack.Screen
            name='Profile'
            component={Profile} />
          <Stack.Screen
            name='Edit profile'
            component={UpdateProfile} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
