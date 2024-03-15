import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import axios from 'axios';
import { IP_ADDRESS } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { decode, encode } from 'base-64'; // Import base-64 library

// Set up the polyfill for atob and btoa
if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}


export default function MyRecipesList({ navigation }) {
    const [recipesList, setRecipesList] = useState([])

    const fetchToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('TOKEN');
            return storedToken;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    };

    const getMyRecipes = async () => {
        try {
            // console.log('Displayin...');
            const token = await fetchToken();
            const decodedToken = jwtDecode(token);
            const userID = decodedToken._id;

            axios.get(`http://${IP_ADDRESS}:3001/getAllRecipes/${userID}`)
                .then(response => {
                    // console.log(response.data);
                    setRecipesList(response.data);
                }).catch(err => {
                    console.log(err.message);
                })

        } catch (error) {
            console.log('Error:', error);
        }
    }

    useEffect(() => {
        getMyRecipes()
    }, []);

    return (
        <View>
            <View>
                <Image
                    source={require('../assets/smallbackground5.jpg')}
                    style={styles.backgroundImg}
                />
                <Text style={styles.backgroundImgText}>My recipes list</Text>
            </View>
            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {recipesList.map((item, index) => {
                    return (
                        <TouchableOpacity
                            style={styles.recipeList}
                            activeOpacity={0.9}
                            key={index}
                            onPress={() => { navigation.navigate('Recipe details', { recipeID: item._id }) }}
                        >
                            <Image
                                // source={require('../assets/smallbackground5.jpg')}
                                source={{ uri: item.image }}
                                style={styles.recipeListImg}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={styles.recipeListText}>{item.title}</Text>
                                <FontAwesomeIcon icon={faAngleRight} size={15} style={styles.recipeListIcon} />
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView> 
        </View>
    )
}

const styles = StyleSheet.create({
    backgroundImg: {
        width: wp('100'),
        height: hp('22%'),
        borderBottomLeftRadius: hp(5),
        borderBottomRightRadius: hp(5),
        opacity: 0.7
    },
    backgroundImgText: {
        bottom: hp(12),
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: hp(3.2),
        fontStyle: 'italic',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    recipeList: {
        width: hp(20),
        borderColor: '#ddd',
        borderWidth: hp(0.12),
        height: hp(25),
        backgroundColor: '#fff',
        borderRadius: hp(5),
        marginLeft: hp(2),
        elevation: hp(0.3),
        marginBottom: hp(1)
    },
    recipeListImg: {
        width: hp(19.8),
        height: hp(19),
        borderTopRightRadius: hp(5),
        borderTopLeftRadius: hp(5),
        // opacity: hp(0.1)
    },
    recipeListText: {
        top: hp(1.3),
        fontSize: hp(1.9),
        fontWeight: 'bold',
        right: hp(1.3)
    },
    recipeListIcon: {
        textAlign: 'center',
        top: hp(2),
        fontSize: hp(1.9),
        fontWeight: 'bold',
        left: hp(2.3)
    },
})