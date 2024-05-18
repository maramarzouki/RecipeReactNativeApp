import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Dialog from 'react-native-dialog'
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'; 
import { IP_ADDRESS } from '@env'
import { login } from '../service/AuthService';
import * as SecureStore from "expo-secure-store"
import { useFocusEffect } from '@react-navigation/native';

// const IP_ADDRESS = process.env.IP_ADDRESS

export default function Livestreams({ navigation }) {
    const TOKEN_KEY = "1"
 
    const [currentLives, setCurrentLives] = useState([]);
    const [visible, setVisible] = useState(false);
    const [liveTitle, setLiveTitle] = useState("")

    const [authState, setAuthState] = useState({
        token: null,
        authenticated: null,
        user_id: null
    })
    const [initialized, setInitialized] = useState(false)

    const fetchToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('TOKEN');
            return storedToken;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    };

    const showDialog = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleCreate = async () => {
        console.log("start live");
        const token = await fetchToken();
        const decodedToken = jwtDecode(token);
        const userID = decodedToken._id;
        const randomId = Math.floor(Math.random() * 1000000000).toString();

        try {
            axios.post(`http://${IP_ADDRESS}:3001/createLive`, {
                liveTitle, liveID: randomId, liveOwner: userID
            })
                .then(response => {
                    console.log("created", response);
                    setVisible(false);
                    navigation.navigate('Livestream room', { id: randomId, liveId: response.data._id });
                    getLives();
                }).catch(err => {
                    console.log(err.response.data);
                })
        } catch (error) {
            console.log(error);
        } 

    };

    const getLives = async () => {
        const token = await fetchToken();
        const decodedToken = jwtDecode(token);
        const userID = decodedToken._id;

        try {
            axios.get(`http://${IP_ADDRESS}:3001/getAllLives`)
                .then(response => {
                    console.log("lives", response.data);
                    setCurrentLives(response.data)
                }).catch(err => {
                    console.log(err.response.data);
                })
        } catch (error) {
            console.log(error);
        }

    };

    const fetchEmail = async () => { 
        try {
            const storedEmail = await AsyncStorage.getItem('email');
            return storedEmail;
        } catch (error) {
            console.error('Error fetching email:', error);
            return null; 
        }
    };

    const loadStreamToken = async () => {
        const data = await SecureStore.getItemAsync(TOKEN_KEY);
        // console.log("dataaaaaaa", data);

        if (data) {
            const object = JSON.parse(data);
            // console.log("token", object.data.token);
            AsyncStorage.removeItem('authState');

            // Set our context state
            setAuthState({
                token: object.data.token,
                authenticated: true,
                user_id: object.data.user.id,
            });
            setInitialized(true);
            AsyncStorage.setItem('authState', JSON.stringify(authState));
            //   console.log("authstate",authState); 
        }
        console.log("authState", authState);

    };

    const loginForStream = async () => {
        const email = await fetchEmail();
        console.log("email", email);
        try {
            await login(email, email)
                .then(result => {
                    console.log("done");
                    loadStreamToken();
                })
        } catch (error) {
            Alert.alert('Error', 'Could not log in');
            console.log(e);
        }
    }
 
    useFocusEffect(
        useCallback(() => {
            loginForStream();
            getLives();
        }, []) 
    );

    const watchStream = (id) => {
        navigation.navigate('Livestream watch room', {id: id});
    }
      
    return (
        <View style={styles.container}>
            <View style={styles.buttonsView}>
                <TouchableOpacity style={styles.buttonsStyle} onPress={showDialog}>
                    <Text style={styles.buttonTextStyle}>Start live</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonsStyle}>
                    <Text style={styles.buttonTextStyle}>Create room</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.onGoingLiveText}>On going lives:</Text>
            {currentLives.length > 0 ? (
                currentLives.map((item, key) => {
                    return (
                        <TouchableOpacity key={key} style={styles.card} onPress={()=>watchStream(item.liveID)}>
                            <View style={styles.redCircle} />
                            <Text style={styles.cardTitle}>{item.liveTitle}</Text>
                            <Text style={styles.cardOwner}><Text style={{ fontWeight: 'bold' }}>Host:</Text> {item.liveOwner.username}</Text>
                        </TouchableOpacity>
                    )
                })
            ) : (
                <Text>No lives for now!</Text>
            )}
            <View style={styles.dialogContainer}>
                {/* <Bu title="Show dialog" onPress={showDialog} /> */}
                <Dialog.Container visible={visible}>
                    <Dialog.Title>Enter a title for your live</Dialog.Title>
                    <Dialog.Input onChangeText={(text) => setLiveTitle(text)} placeholder='Title' />
                    <Dialog.Button label="Cancel" onPress={handleCancel} />
                    <Dialog.Button label="Start Live" onPress={() => handleCreate()} />
                </Dialog.Container>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    buttonsView: {
        flexDirection: 'row', 
        justifyContent: "flex-end",
        marginBottom: hp(2)
    },
    buttonsStyle: {
        backgroundColor: "#800e13",
        borderRadius: hp(1), 
        padding: hp(1),
        width: hp(10),
        alignItems: "center",
        marginRight: hp(2),
        alignSelf: "flex-end",
        elevation: 2, // This property is for Android
        overflow: 'scroll',
    },
    buttonTextStyle: {
        color: "#fff",
        fontWeight: "bold",
    },
    onGoingLiveText: {
        left: hp(1.5),
        fontSize: hp(2.4),
        fontWeight: "bold"
    },
    dialogContainer: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#f8f8f8",
        padding: hp(2),
        margin: hp(1),
        borderRadius: hp(1),
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    cardTitle: {
        fontSize: hp(2.2),
        fontWeight: "bold",
    },
    cardOwner: {
        fontSize: hp(1.9),
        color: "#555",
    },
    redCircle: {
        width: hp(1),
        height: hp(1),
        borderRadius: hp(1),
        backgroundColor: "red",
        position: 'absolute',
        top: hp(3),
        right: hp(2),
    }
})