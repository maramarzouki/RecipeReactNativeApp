import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { decode, encode } from 'base-64'; // Import base-64 library
import { err } from 'react-native-svg'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useIsFocused } from '@react-navigation/native'

export default function MySavedRecipes({ navigation }) {

    const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS
    
    const isFocused = useIsFocused()
    const [savedRecipesList, setSavedRecipesList] = useState([])

    const fetchToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('TOKEN');
            return storedToken;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    };

    const getSavedRecipes = async () => {
        console.log("Getting saved recipes...");
        const token = await fetchToken();
        const decodedToken = jwtDecode(token);
        const userID = decodedToken._id;

        axios.get(`http://${IP_ADDRESS}:3001/getSavedRecipes/${userID}`)
            .then((response) => {
                console.log("response", response.data[0].recipesIDs);
                setSavedRecipesList(response.data[0].recipesIDs);
            }).catch((error) => {
                console.log(error.response.data);
            })
    }

    useEffect(() => {
        getSavedRecipes()
    }, [isFocused])

    return (
        <View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: hp(1) }}>
                {savedRecipesList && savedRecipesList.length > 0 ? (
                    savedRecipesList.map((item, key) => {
                        return (
                            <TouchableOpacity
                                style={styles.recipeList}
                                activeOpacity={0.9}
                                key={key}
                                onPress={() => { navigation.navigate('Recipe details', { recipeID: item._id }) }}
                            >
                                <Image
                                    // source={require('../assets/smallbackground5.jpg')}
                                    source={{ uri: item.image }}
                                    style={styles.recipeListImg}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: hp(1.7), paddingRight: hp(1.5) }}>
                                    <Text style={styles.recipeListText}>{item.title}</Text>
                                    <FontAwesomeIcon icon={faAngleRight} size={15} style={styles.recipeListIcon} />
                                </View>
                            </TouchableOpacity>
                        )
                    })
                ) : (
                    <Text style={{ textAlign: 'center' }}>No recipes to show!</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    recipeList: {
        width: hp(20),
        borderColor: '#ddd',
        borderWidth: hp(0.12),
        height: hp(22),
        backgroundColor: '#fff',
        borderRadius: hp(5),
        marginLeft: hp(2),
        elevation: hp(0.3),
        marginBottom: hp(1)
    },
    recipeListImg: {
        width: hp(19.8),
        height: hp(16),
        borderTopRightRadius: hp(5),
        borderTopLeftRadius: hp(5),
        // opacity: hp(0.1)
    },
    recipeListText: {
        top: hp(1.3),
        fontSize: hp(1.9),
        fontWeight: 'bold',
    },
    recipeListIcon: {
        textAlign: 'center',
        top: hp(2),
        fontSize: hp(1.9),
        fontWeight: 'bold',
    },
})