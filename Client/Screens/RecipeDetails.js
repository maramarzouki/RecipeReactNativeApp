import { View, Text, Image, StyleSheet, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { faPen, faClock, faTurnUp, faBookmark, faPlus, faTrashCan, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import axios from 'axios';
import { IP_ADDRESS } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

export default function RecipeDetails({ navigation, route }) {

    const recipeID = route.params.recipeID;
    const isFocused = useIsFocused();

    const [userID, setUserID] = useState()
    const [recipeUser, setRecipeUser] = useState()
    const [recipeName, setRecipeName] = useState('')
    const [recipeHours, setRecipeHours] = useState('')
    const [recipeMinutes, setRecipeMinutes] = useState('');
    const [recipeLevel, setRecipeLevel] = useState('');
    const [recipeImage, setRecipeImage] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [isOwnRecipe, setIsOwnRecipe] = useState(false);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipeInstructions, setRecipeInstructions] = useState([]);

    const [isRecipeSaved, setIsRecipeSaved] = useState(false)

    const fetchToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('TOKEN');
            return storedToken;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    };

    const checkIsOwnRecipe = async () => {
    }

    const saveRecipe = () => {
        console.log("Saving recipe...");
        axios.post(`http://${IP_ADDRESS}:3001/saveRecipe/${userID}`, { recipeID })
            .then((response) => {
                if (response.status === 200) {
                    ToastAndroid.show('Recipe saved!', ToastAndroid.SHORT)
                    setIsRecipeSaved(true)
                } else if (response.status === 204) {
                    axios.delete(`http://${IP_ADDRESS}:3001/unsaveRecipe/${userID}/${recipeID}`)
                        .then((response) => {
                            ToastAndroid.show('Recipe unsaved!', ToastAndroid.SHORT)
                            setIsRecipeSaved(false)
                        }).catch(err => {
                            console.log(err.response.data);
                            console.log(recipeID);
                        })
                }
            }).catch(err => {
                console.log(err);
            })
    }

    const getRecipeDetails = async () => {
        console.log("Getting recipe details...");
        const token = await fetchToken();
        const decodedToken = jwtDecode(token);
        const currentUser = decodedToken._id
        setUserID(decodedToken._id);

        // setIsOwnRecipe(userID === recipeUser)
        // console.log("Displaying");
        axios.get(`http:${IP_ADDRESS}:3001/getRecipeDetails/${recipeID}`)
            .then(response => {
                // console.log(response.data);
                setRecipeUser(response.data.user)
                setRecipeName(response.data.title);
                setRecipeDescription(response.data.description);
                setRecipeHours(response.data.durationHours);
                setRecipeMinutes(response.data.durationMinutes);
                setRecipeLevel(response.data.level);
                setRecipeImage(response.data.image);
                setIsOwnRecipe(currentUser === response.data.user)
                console.log('recipe user', response.data.user);
                console.log('current user', currentUser);
                console.log(currentUser === response.data.user);

            }).catch(err => {
                console.log(err.message);
            })
    }

    const getRecipeIngredients = () => {
        console.log("getting ingredients...");
        axios.get(`http:${IP_ADDRESS}:3001/getRecipeIngredients/${recipeID}`)
            .then(response => {
                // console.log("INGREDIENTS", response.data);
                setRecipeIngredients(response.data)
            }).catch(err => {
                console.log(err.message);
            })
    }

    const getRecipeInstructions = () => {
        console.log("getting instructions...");
        axios.get(`http:${IP_ADDRESS}:3001/getRecipeInstructions/${recipeID}`)
            .then(response => {
                // console.log("Instructions", response.data);
                setRecipeInstructions(response.data)
            }).catch(err => {
                console.log(err.message);
            })
    }

    useEffect(() => {
        if (isFocused) {
            console.log("Displaying");
            getRecipeDetails();
            getRecipeIngredients();
            getRecipeInstructions()
            // checkIsOwnRecipe()  
            // console.log(isOwnRecipe);
            // console.log(recipeUser === userID);
        }
    }, [isFocused])


    const handleDelete = () => {
        Alert.alert(
            "Delete recipe",
            "Are you sure you want to delete this recipe?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Delete",
                onPress: () => {
                  deleteItem()
                },
                style: "destructive"
              }
            ],
            { cancelable: false }
        );
    };

    const deleteItem = () => {
        axios.delete(`http://${IP_ADDRESS}:3001/deleteRecipe/${recipeID}`)
            .then(response => {
                console.log(response.data);
                console.log("done");
                navigation.goBack()
            }).catch(err => console.error(err));
    };

    const DescriptionScreen = () => (
        <View style={styles.tabContent}>
            <Text>{recipeDescription}</Text>
        </View>
    );

    const IngredientsScreen = () => (
        <View style={{ flex: 1, justifyContent: 'space-evenly', padding: hp(1) }}>
            <View style={styles.tabContent}>
                {recipeIngredients.map((item, index) => {
                    return (
                        <View key={index}>
                            <Text>{`- ${item.quantity} ${item.unit} of ${item.name}`}</Text>
                        </View>
                    )
                })}
            </View>
            {isOwnRecipe && (
                <TouchableOpacity
                    style={styles.addIngredientButton}
                    onPress={() => {
                        navigation.navigate('Add recipe ingredients', { recipeID: recipeID, isToCreate: false });
                    }}>
                    <FontAwesomeIcon icon={faPlus} size={15} style={styles.icon} />
                </TouchableOpacity>
            )}
        </View>
    );

    const InstructionsScreen = () => (
        <View style={{ flex: 1, justifyContent: 'space-evenly', padding: hp(1) }}>
            <View style={styles.tabContent}>
                {recipeInstructions.map((item, index) => {
                    return (
                        <View key={index}>
                            <Text>{`${item.stepNum}. ${item.stepDesc}`}</Text>
                        </View>
                    )
                })}
            </View>
            {isOwnRecipe && (
                <TouchableOpacity
                    style={styles.addIngredientButton}
                    onPress={() => {
                        navigation.navigate('Add recipe instructions', { recipeID: recipeID, isToCreate: false });
                    }}>
                    <FontAwesomeIcon icon={faPlus} size={15} style={styles.icon} />
                </TouchableOpacity>
            )}

        </View>
    );

    const Tab = createMaterialTopTabNavigator();

    return (
        <View style={styles.container}>
            {recipeImage !== "" && (
                <Image
                    source={{ uri: recipeImage }}
                    style={styles.backgroudImg}
                />
            )}
            {isOwnRecipe ? (
                <TouchableOpacity
                    style={styles.updateRecipeButton}
                    onPress={() => { navigation.navigate('Update Recipe', { recipeID: recipeID }) }}
                >
                    <FontAwesomeIcon icon={faPen} size={15} style={styles.icon} />
                </TouchableOpacity>
            ) : (
                isRecipeSaved ? (
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => saveRecipe()}
                        activeOpacity={0.9}
                    >
                        <FontAwesomeIcon icon={faBookmark} size={15} style={styles.icon} />
                    </TouchableOpacity>
                ) : (

                    <TouchableOpacity
                        style={styles.unsaveButton}
                        onPress={() => saveRecipe()}
                        activeOpacity={0.9}
                    >
                        <FontAwesomeIcon icon={faBookmark} size={15} style={styles.unsaveIcon} />
                    </TouchableOpacity>
                )
            )}
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={styles.recipeName}>{recipeName}</Text>
                {isOwnRecipe && (
                    <TouchableOpacity onPress={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} style={{ top: hp(-1.9), right: hp(2) }} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomColor: '#D9D9D9', borderBottomWidth: hp(0.7) }}>
                <View style={styles.details}>
                    <FontAwesomeIcon icon={faClock} size={15} style={styles.icon} />
                    <Text style={styles.detailsText}>
                        {recipeHours > 0 ?
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
                    screenOptions={{
                        tabBarIndicatorStyle: { backgroundColor: '#AD2831' },
                        tabBarStyles: { backgroundColor: "#fff" }
                    }}
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
        backgroundColor: "#fff"
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjusted to ensure tabs are spaced evenly
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: hp(0.7),
    },
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },
    addIngredientButton: {
        borderRadius: 50,
        alignSelf: 'flex-end',
        backgroundColor: '#800e13',
        padding: 15,
        top: hp(0),
        right: 15
    },
    saveButton: {
        borderRadius: hp(5),
        alignSelf: 'flex-end',
        backgroundColor: '#AD2831',
        padding: hp(1.7),
        top: hp(-3),
        right: hp(2),
    },
    unsaveButton: {
        borderRadius: hp(5),
        alignSelf: 'flex-end',
        backgroundColor: '#fff',
        padding: hp(1.7),
        top: hp(-3),
        right: hp(2),
        borderColor: "#AD2831",
        borderWidth: hp(0.1)
    },
    unsaveIcon: {
        color: "#AD2831"
    }
})