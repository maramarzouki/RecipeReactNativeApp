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
import UpdateProfile from './Screens/UpdateProfile';
import RecipeInfoForm from './Screens/CreateRecipe/RecipeInfoForm';
import IngredientsForm from './Screens/CreateRecipe/IngredientsForm';
import InstructionsForm from './Screens/CreateRecipe/InstructionsForm';
import MyRecipesList from './Screens/MyRecipesList';
import RecipeDetails from './Screens/RecipeDetails';
import Homepage from './Screens/Homepage';
import SearchPage from './Screens/SearchPage';
import Navbar from './Screens/Navbar';
import RecipesByCategory from './Screens/RecipesByCategory';
import AllCategories from './Screens/AllCategories';
import UpdateRecipe from './Screens/UpdateRecipe';
import MySavedRecipes from './Screens/MySavedRecipes';
import Livestreams from './Screens/Livestreams';
import LiveStreamRoom from './Screens/LiveStreamRoom';
import LiveStreamWatch from './Screens/LiveStreamWatch';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayProvider } from 'stream-chat-expo';
import { useContext, useEffect, useRef, useState } from 'react';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-native-sdk';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './Screens/AuthContext';
import { AuthProvider } from './Screens/AuthContext';
import { Slot } from 'expo-router'
import RenderLivestream from './Screens/RenderLivestream';

const Stack = createNativeStackNavigator();

function InitialLayout() {


  // const navigation = useNavigation();
  const navigationContainerRef = useRef();

  const { authState, initialized } = useContext(AuthContext);


  // Navigate the user to the correct page based on their authentication state
  // useEffect(() => {
  //   if (!initialized) return;

  //   if (authState?.authenticated) {
  //     if(navigationContainerRef.current){
  //       navigationContainerRef.current.navigate("Livestreams");
  //     } // Replace with the name of your inside screen
  //   } else {
  //     client?.disconnectUser(); 
  //     if(navigationContainerRef.current){
  //       navigationContainerRef.current.navigate("SignupScreen");
  //     }
  //     // navigation.navigate(); // Replace with the name of your login screen
  //   }
  // }, [initialized, authState]);

  // Initialize the StreamVideoClient when the user is authenticated
  // useEffect(() => {
  //   if (authState?.authenticated && authState.token) {
  //     const user = { id: authState.user_id };

  //     try {
  //       const client = new StreamVideoClient({ apiKey: STREAM_KEY, user, token: authState.token });
  //       setClient(client);
  //     } catch (e) {
  //       console.log('Error creating client: ', e);
  //     }
  //   }
  //   console.log("clllllllll", client);
  //   console.log("authState", authState);
  // }, [authState]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignupScreen'>
        <Stack.Screen
          name='Initial Screen'
          component={InitialLayout}
          options={{ headerShown: false }} />
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
        <Stack.Screen
          name='Create new recipe'
          component={RecipeInfoForm} />
        <Stack.Screen
          name='Add recipe ingredients'
          component={IngredientsForm}
          options={{ headerShown: false }} />
        <Stack.Screen
          name='Add recipe instructions'
          component={InstructionsForm}
          options={{ headerShown: false }} />
        <Stack.Screen
          name='My recipes'
          component={MyRecipesList} />
        <Stack.Screen
          name='Recipe details'
          component={RecipeDetails} />
        <Stack.Screen
          name='Homepage'
          component={Homepage}
          options={{ headerLeft: null }} />
        <Stack.Screen
          name='Search'
          component={SearchPage} />
        <Stack.Screen
          name='Navbar'
          component={Navbar}
          options={{ headerShown: false }} />
        <Stack.Screen
          name='Category'
          component={RecipesByCategory} />
        <Stack.Screen
          name='AllCategories'
          component={AllCategories} />
        <Stack.Screen
          name='Update Recipe'
          component={UpdateRecipe} />
        <Stack.Screen
          name='Saved recipes'
          component={MySavedRecipes} />
        <Stack.Screen
          name='Livestreams'
          component={Livestreams} />
        <Stack.Screen
          name='Livestream room'
          component={LiveStreamRoom}
          options={{ headerShown: false }} />
        <Stack.Screen
          name='Livestream watch room'
          component={LiveStreamWatch}
          options={{ headerShown: false }} />
        <Stack.Screen
          name='RenderLivestream'
          component={RenderLivestream}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OverlayProvider>
          <InitialLayout />
        </OverlayProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
};

export default App;
