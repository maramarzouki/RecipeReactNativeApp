import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen, faPlus, faList, faBookmark } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { IP_ADDRESS } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { decode, encode } from 'base-64'; // Import base-64 library
import { useIsFocused } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

// Set up the polyfill for atob and btoa
if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

export default function Profile({ navigation }) {

    const isFocused = useIsFocused();

    const [username, setUsername] = useState('');
    const [memberSince, setMemberSince] = useState('')

    const fetchToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('TOKEN');
            return storedToken;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    };

    const dislayUserInfo = async () => {
        try {
            console.log('Displaying...');
            const token = await fetchToken();
            const decodedToken = jwtDecode(token);
            const userID = decodedToken._id;

            axios.get(`http://${IP_ADDRESS}:3001/getUserDetails/${userID}`)
                .then(response => {
                    console.log(response.data);
                    console.log(userID);
                    setUsername(response.data.User.username);
                    setMemberSince(response.data.User.memberSince)
                })
                .catch(error => {
                    console.log('Error fetching user info:', error.response);
                });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            dislayUserInfo();
        }
    }, [isFocused]);


    return (
        <ImageBackground
            style={styles.image}
            source={require('../assets/background18.jpg')}
            imageStyle={styles.imageStyle}>
            <View style={styles.overlay}></View>
            <View style={styles.container}>
                <Image
                    source={require('../assets/chefavatr.jpg')}
                    style={styles.profileImage} />

                <View style={styles.textContainer}>
                    <Text style={styles.username}>@{username}</Text>
                    <Text style={styles.username}>Member since: {memberSince}</Text>
                </View>

                <TouchableOpacity
                    style={styles.updateInfoButton}
                    onPress={() => { navigation.navigate('Edit profile'); console.log("edit profile"); }}>
                    <FontAwesomeIcon icon={faPen} size={15} style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={styles.recipeList}
                    onPress={() => { navigation.push('My recipes') }}
                    activeOpacity={0.9}
                >
                    <Image
                        source={require('../assets/smallbackground5.jpg')}
                        style={styles.recipeListImg}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <FontAwesomeIcon icon={faList} size={15} style={styles.recipeListIcon} />
                        <Text style={styles.recipeListText}>My recipes</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.recipeList}
                    activeOpacity={0.9}
                    onPress={()=>{navigation.navigate('Saved recipes')}}
                >
                    <Image
                        source={require('../assets/smallbackground4.jpg')}
                        style={styles.recipeListImg}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <FontAwesomeIcon icon={faBookmark} size={15} style={styles.recipeListIcon} />
                        <Text style={styles.recipeListText}>Saved recipes</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
                style={styles.createRecipeButton}
                onPress={() => { navigation.navigate('Create new recipe') }}>
                <FontAwesomeIcon icon={faPlus} size={15} style={styles.icon} />
            </TouchableOpacity> */}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: 'auto',
        height: 250,
        elevation: 15,
    },
    imageStyle: {
        // borderBottomLeftRadius: 25,
        // borderBottomRightRadius: 25,
        borderRadius: 25,
        opacity: 0.7,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 300,
        position: 'absolute', // Position the image absolutely within the ImageBackground
        top: 50,
        left: 25,
        borderWidth: 3,
        borderColor: 'white',
        opacity: 0.95
    },
    updateInfoButton: {
        borderRadius: hp(50),
        alignSelf: 'flex-end',
        backgroundColor: '#800e13',
        padding: hp(1.7),
        top: hp(-5.6),
        right: hp(0),
    },
    icon: {
        color: 'white',
    },
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        marginTop: 10,
    },
    username: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        top: 75,
        left: 55
    },
    createRecipeButton: {
        borderRadius: 50,
        alignSelf: 'flex-end',
        backgroundColor: '#800e13',
        padding: 15,
        top: hp(45),
        right: 15
    },
    recipeList: {
        width: hp(20),
        borderColor: '#ddd',
        borderWidth: hp(0.12),
        height: hp(25),
        backgroundColor: '#fff',
        borderRadius: hp(5),
        top: hp(20),
        marginLeft: hp(2.2),
        elevation: hp(0.3),
    },
    recipeListImg: {
        width: hp(19.8),
        height: hp(19),
        borderTopRightRadius: hp(5),
        borderTopLeftRadius: hp(5),
        opacity: hp(0.1)
    },
    recipeListText: {
        textAlign: 'center',
        top: hp(1.5),
        color: "#800e13",
        fontSize: hp(1.9),
        fontWeight: 'bold'
    },
    recipeListIcon: {
        textAlign: 'center',
        top: hp(2),
        color: "#800e13",
        fontSize: hp(1.9),
        fontWeight: 'bold',
        right: hp(1)
    }
})