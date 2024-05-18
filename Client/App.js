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
        <Stack.Screen
          name='Create new recipe'
          component={RecipeInfoForm} />
        <Stack.Screen
          name='Add recipe ingredients'
          component={IngredientsForm}
          options={{ headerShown: true }} />
        <Stack.Screen
          name='Add recipe instructions'
          component={InstructionsForm}
          options={{ headerShown: true }} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
