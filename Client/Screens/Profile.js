import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { IP_ADDRESS } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { decode, encode } from 'base-64'; // Import base-64 library
import { useIsFocused } from '@react-navigation/native';

// Set up the polyfill for atob and btoa
if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

export default function Profile({navigation}) {

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
                    source={require('../assets/profile_img.jpg')}
                    style={styles.profileImage} />

                <View style={styles.textContainer}>
                    <Text style={styles.username}>@{username}</Text>
                    <Text style={styles.username}>Member since: {memberSince}</Text>
                </View>

                <TouchableOpacity
                    style={styles.updateInfoButton}
                    onPress={()=>{navigation.navigate('Edit profile')}}>
                    <FontAwesomeIcon icon={faPen} size={15} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: 'auto',
        height: 250,       
        shadowOffset: { width: 2, height: 6 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
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
        borderRadius: 50,
        alignSelf: 'flex-end',
        backgroundColor: '#800e13',
        padding: 15,
        top: 120,
        right: 15
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
})