import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { faPen, faClock, faTurnUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import axios from 'axios';
import { IP_ADDRESS } from '@env';

export default function RecipeDetails({ route }) {

    const recipeID = route.params.recipeID;

    const [recipeName, setRecipeName] = useState('')
    const [recipeHours, setRecipeHours] = useState('')
    const [recipeMinutes, setRecipeMinutes] = useState('');
    const [recipeLevel, setRecipeLevel] = useState('');
    const [recipeImage, setRecipeImage] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipeInstructions, setRecipeInstructions] = useState([]);

    const [ingredientName, setIngredientName] = useState('');
    const [ingredientQuantity, setIngredientQuantity] = useState('');
    const [ingredientUnit, setIngredientUnit] = useState('');

    const [instructionNumber, setInstructionNumber] = useState();
    const [instrucntionDetails, setInstructionDetails] = useState('');

    const getRecipeDetails = () => {
        // console.log("Displaying");
        axios.get(`http:${IP_ADDRESS}:3001/getRecipeDetails/${recipeID}`)
            .then(response => {
                console.log(response.data);
                setRecipeName(response.data.title);
                setRecipeDescription(response.data.description);
                setRecipeHours(response.data.durationHours);
                setRecipeMinutes(response.data.durationMinutes);
                setRecipeLevel(response.data.level);
                setRecipeImage(response.data.image);
            }).catch(err => {
                console.log(err.message);
            })
    }

    const getRecipeIngredients = () => {
        axios.get(`http:${IP_ADDRESS}:3001/getRecipeIngredients/${recipeID}`)
            .then(response => {
                console.log("INGREDIENTS",response.data);
                setRecipeIngredients(response.data)
            }).catch(err => {
                console.log(err.message);
            })
    }

    const getRecipeInstructions = () => {
        axios.get(`http:${IP_ADDRESS}:3001/getRecipeInstructions/${recipeID}`)
            .then(response => {
                console.log("Instructions",response.data);
                setRecipeInstructions(response.data)
            }).catch(err => {
                console.log(err.message);
            })
    }

    useEffect(() => {
        console.log("Displaying");
        getRecipeDetails();
        getRecipeIngredients();
        getRecipeInstructions()
    }, [])


    const DescriptionScreen = () => (
        <View style={styles.tabContent}>
            <Text>{recipeDescription}</Text>
        </View>
    );

    const IngredientsScreen = () => (
        <View style={styles.tabContent}>
            {recipeIngredients.map((item, index) =>{
                return(
                    <View key={index}>
                        <Text>{`- ${item.quantity} ${item.unit} of ${item.name}`}</Text>
                    </View>
                )
            })}
        </View>
    );

    const InstructionsScreen = () => (
        <View style={styles.tabContent}>
            {recipeInstructions.map((item, index) =>{
                return(
                    <View key={index}>
                        <Text>{`${item.stepNum}. ${item.stepDesc}`}</Text>
                    </View>
                )
            })}
        </View>
    );

    const Tab = createMaterialTopTabNavigator();

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: recipeImage }}
                style={styles.backgroudImg}
            />
            <TouchableOpacity
                style={styles.updateRecipeButton}
            >
                <FontAwesomeIcon icon={faPen} size={15} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.recipeName}>{recipeName}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomColor: '#D9D9D9', borderBottomWidth: hp(0.7) }}>
                <View style={styles.details}>
                    <FontAwesomeIcon icon={faClock} size={15} style={styles.icon} />
                    <Text style={styles.detailsText}>
                        {recipeHours >= 0 ?
                            (recipeHours + "H" + recipeMinutes)
                            :
                            (recipeMinutes + "min")
                        }
                    </Text>
                </View>
                <View style={styles.details}>
                    <FontAwesomeIcon icon={faTurnUp} size={15} style={styles.icon} />
                    <Text style={styles.detailsText}>{recipeLevel}</Text>
                </View>
            </View>
            <NavigationContainer independent={true}>
                <Tab.Navigator
                    screenOptions={{ tabBarIndicatorStyle: { backgroundColor: '#AD2831', } }}
                >
                    <Tab.Screen name="Description" component={DescriptionScreen} />
                    <Tab.Screen name="Ingredients" component={IngredientsScreen} />
                    <Tab.Screen name="Instructions" component={InstructionsScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    )
}

const styles = StyleSheet.create({
    backgroudImg: {
        width: wp(100),
        height: hp(30),
        borderBottomRightRadius: hp(5),
        borderBottomLeftRadius: hp(5),
    },
    updateRecipeButton: {
        borderRadius: hp(5),
        alignSelf: 'flex-end',
        backgroundColor: '#AD2831',
        padding: hp(1.7),
        top: hp(-3),
        right: hp(2),
    },
    icon: {
        color: 'white'
    },
    recipeName: {
        fontSize: hp(3),
        fontWeight: 'bold',
        left: hp(3),
        bottom: hp(3),
    },
    details: {
        width: hp(10),
        padding: hp(1),
        backgroundColor: "#F4845F",
        flexDirection: 'row',
        borderRadius: hp(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: hp(1),
        bottom: hp(2)
    },
    detailsText: {
        color: "#FFFFFF",
        marginLeft: hp(0.5),
    },
    container: {
        flex: 1,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjusted to ensure tabs are spaced evenly
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: hp(0.7),
    },
    // Added a new style for the content of each tab
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },
})