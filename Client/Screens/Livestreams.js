// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import React, { useCallback, useContext, useEffect, useState } from 'react';
// import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Dialog from 'react-native-dialog';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import jwtDecode from 'jwt-decode';
// import { login } from '../service/AuthService';
// import * as SecureStore from "expo-secure-store";
// import { useFocusEffect } from '@react-navigation/native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { StreamVideoClient, StreamVideo, useStreamVideoClient } from '@stream-io/video-react-native-sdk';
// import { OverlayProvider } from 'stream-chat-expo';
// import { AuthContext } from './AuthContext';

// export default function Livestreams({ navigation }) {
//     const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;
//     const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;

//     const { loginForStream, authState, initialized } = useContext(AuthContext);

//     const [client, setClient] = useState(null);
//     const [currentLives, setCurrentLives] = useState([]);
//     const [visible, setVisible] = useState(false);
//     const [liveTitle, setLiveTitle] = useState("");
//     const [email, setEmail] = useState(null);
//     const [isFirstLoad, setIsFirstLoad] = useState(true);
//     const [liveID, setLiveID] = useState("");
//     const [callID, setCallID] = useState("");

//     const fetchToken = async () => {
//         try {
//             const storedToken = await AsyncStorage.getItem('TOKEN');
//             return storedToken;
//         } catch (error) {
//             console.error('Error fetching token:', error);
//             return null;
//         }
//     };

//     const fetchEmail = async () => {
//         try {
//             const storedEmail = await AsyncStorage.getItem('email');
//             return storedEmail;
//         } catch (error) {
//             console.error('Error fetching email:', error);
//             return null;
//         }
//     };

//     const showDialog = () => {
//         setVisible(true);
//     };

//     const handleCancel = () => {
//         setVisible(false);
//     };

//     const handleCreate = async () => {
//         console.log("start live");
//         const token = await fetchToken();
//         const decodedToken = jwtDecode(token);
//         const userID = decodedToken._id;
//         const randomId = Math.floor(Math.random() * 1000000000).toString();

//         try {
//             await axios.post(`http://${IP_ADDRESS}:3001/createLive`, {
//                 liveTitle, liveID: randomId, liveOwner: userID
//             }).then(response => {
//                 console.log("created", response);
//                 setCallID(randomId);
//                 setLiveID(response.data._id);
//                 navigation.navigate('RenderLivestream', { liveID: response.data._id, callID: randomId, StreamType: "Stream", client: client });
//             })
//             setVisible(false);
//         } catch (error) {
//             console.error('Error creating live:', error.response.data);
//         }
//     };

//     const getLives = async () => {
//         try {
//             const response = await axios.get(`http://${IP_ADDRESS}:3001/getAllLives`);
//             console.log("lives", response.data);
//             setCurrentLives(response.data);
//         } catch (error) {
//             console.error('Error fetching lives:', error.response.data);
//         }
//     };

//     useEffect(() => {
//         const initialize = async () => {
//             const email = await fetchEmail();
//             setEmail(email);
//             await loginForStream(email);
//         };
//         initialize();
//     }, []);

//     useFocusEffect(
//         useCallback(() => {
//             if (isFirstLoad) {
//                 loginForStream(email);
//                 setIsFirstLoad(false);
//             }
//             getLives();
//         }, [])
//     );

//     useEffect(() => {
//         if (authState?.authenticated && authState.token) {
//             const user = { id: authState.user_id };
//             try {
//                 const streamClient = new StreamVideoClient({ apiKey: STREAM_KEY, user, token: authState.token });
//                 setClient(streamClient);
//             } catch (error) {
//                 console.error('Error creating client:', error);
//             }
//         }
//     }, [authState]);

//     const watchStream = (id) => {
//         if (client) {
//             navigation.navigate('RenderLivestream', { liveID: id, callID: id, StreamType: "Watch", client: client });
//         }
//     };

//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <View style={styles.container}>
//                 <OverlayProvider>
//                     <View style={styles.buttonsView}>
//                         <TouchableOpacity style={styles.buttonsStyle} onPress={showDialog}>
//                             <Text style={styles.buttonTextStyle}>Start live</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.buttonsStyle}>
//                             <Text style={styles.buttonTextStyle}>Create room</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <Text style={styles.onGoingLiveText}>On going lives:</Text>
//                     {currentLives.length > 0 ? (
//                         currentLives.map((item, key) => (
//                             <TouchableOpacity key={key} style={styles.card} onPress={() => watchStream(item.liveID)}>
//                                 <View style={styles.redCircle} />
//                                 <Text style={styles.cardTitle}>{item.liveTitle}</Text>
//                                 <Text style={styles.cardOwner}><Text style={{ fontWeight: 'bold' }}>Host:</Text> {item.liveOwner.username}</Text>
//                             </TouchableOpacity>
//                         ))
//                     ) : (
//                         <Text>No lives for now!</Text>
//                     )}
//                     <View style={styles.dialogContainer}>
//                         <Dialog.Container visible={visible}>
//                             <Dialog.Title>Enter a title for your live</Dialog.Title>
//                             <Dialog.Input onChangeText={(text) => setLiveTitle(text)} placeholder='Title' />
//                             <Dialog.Button label="Cancel" onPress={handleCancel} />
//                             <Dialog.Button label="Start Live" onPress={handleCreate} />
//                         </Dialog.Container>
//                     </View>
//                 </OverlayProvider>
//             </View>
//         </GestureHandlerRootView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff"
//     },
//     buttonsView: {
//         flexDirection: 'row',
//         justifyContent: "flex-end",
//         marginBottom: hp(2)
//     },
//     buttonsStyle: {
//         backgroundColor: "#800e13",
//         borderRadius: hp(1),
//         padding: hp(1),
//         width: hp(10),
//         alignItems: "center",
//         marginRight: hp(2),
//         alignSelf: "flex-end",
//         elevation: 2, // This property is for Android
//         overflow: 'scroll',
//     },
//     buttonTextStyle: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     onGoingLiveText: {
//         left: hp(1.5),
//         fontSize: hp(2.4),
//         fontWeight: "bold"
//     },
//     dialogContainer: {
//         flex: 1,
//         backgroundColor: "#fff",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     card: {
//         backgroundColor: "#f8f8f8",
//         padding: hp(2),
//         margin: hp(1),
//         borderRadius: hp(1),
//         elevation: 3,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.8,
//         shadowRadius: 2,
//     },
//     cardTitle: {
//         fontSize: hp(2.2),
//         fontWeight: "bold",
//     },
//     cardOwner: {
//         fontSize: hp(1.9),
//         color: "#555",
//     },
//     redCircle: {
//         width: hp(1),
//         height: hp(1),
//         borderRadius: hp(1),
//         backgroundColor: "red",
//         position: 'absolute',
//         top: hp(3),
//         right: hp(2),
//     }
// });

 

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Dialog from 'react-native-dialog'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { login } from '../service/AuthService';
import * as SecureStore from "expo-secure-store"
import { useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StreamVideoClient, StreamVideo, useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { OverlayProvider } from 'stream-chat-expo';
import Toast from 'react-native-toast-message';
import { AuthContext } from './AuthContext';
import RenderLivestream from './RenderLivestream';
import LiveStreamRoom from './LiveStreamRoom';
  

export default function Livestreams({ navigation }) {

    const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS
    const { loginForStream, authState, initialized } = useContext(AuthContext);

    const [client, setClient] = useState(null);
    const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;
    // const TOKEN_KEY = "1"
    // const apiKey = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY;
   
    const [currentLives, setCurrentLives] = useState([]);
    const [visible, setVisible] = useState(false); 
    const [liveTitle, setLiveTitle] = useState("")
    // const [client, setClient] = useState(null)
        
    const [email, setEmail] = useState(null)    
    // const client = useStreamVideoClient() 
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [whatVideoIsThis, setWhatVideoIsThis] = useState("")
    const [liveID, setLiveID] = useState("")
    const [callID, setCallID] = useState("")

    // const [authState, setAuthState] = useState({
    //     token: null,
    //     authenticated: null,
    //     user_id: null
    // })
    // const [initialized, setInitialized] = useState(false)

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
                    setCallID(randomId)
                    setLiveID(response.data._id)
                    setVisible(false);
                    navigation.navigate('RenderLivestream', { liveID: response.data._id, callID: randomId, StreamType: "Stream", client: client });
                    // navigation.navigate('Livestream room', { id: randomId, liveId: response.data._id, client: client });
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
            console.log("fetching", storedEmail);
            setEmail(storedEmail)
            return storedEmail;
        } catch (error) {
            console.error('Error fetching email:', error);  
            return null;
        }
    };

    // const loadStreamToken = async () => {
    //     const data = await SecureStore.getItemAsync(TOKEN_KEY);
    //     // console.log("dataaaaaaa", data);

    //     if (data) {
    //         const object = JSON.parse(data);
    //         // console.log("token", object.data.token);
    //         AsyncStorage.removeItem('authState');

    //         // Set our context state
    //         setAuthState({
    //             token: object.data.token,
    //             authenticated: true,
    //             user_id: object.data.user.id,
    //         });
    //         setInitialized(true);
    //         //   console.log("authstate",authState);
    //     }
    //     console.log("authState", authState);

    // };

    // const loginForStream = async () => {
    //     const email = await fetchEmail();
    //     console.log("email", email);
    //     try {
    //         await login(email, email)
    //             .then(result => {
    //                 console.log("done");
    //                 loadStreamToken();
    //                 console.log(client);
    //             })
    //     } catch (error) {
    //         Alert.alert('Error', 'Could not log in');
    //         console.log(e);
    //     }
    // }

    // useEffect(() => {
    //     if (authState.token && authState.user_id) {
    //         const initializeClient = async () => {
    //             try {
    //                 const user = { id: authState.user_id };
    //                 const client = new StreamVideoClient({ apiKey, user, token: authState.token });
    //                 setClient(client);
    //             } catch (error) {
    //                 console.log("Error initializing client or joining call:", error);
    //             }
    //         };
    //         initializeClient();
    //     }
    // }, [authState]);

    // useEffect(()=>{
    //     AsyncStorage.setItem('authState', JSON.stringify(authState));
    //     AsyncStorage.setItem('initialized', JSON.stringify(initialized));
    // })

    useEffect(() => {
        fetchEmail();  
        // const email = fetchEmail();
        // console.log("The email", email);
        // console.log(AsyncStorage.getItem('email')); 
        // setEmail(email)
        // getLives()
    }, [])
    useFocusEffect(  
        useCallback(() => {  
            loginForStream(email)
            if (isFirstLoad) { 
                loginForStream(email);
                setIsFirstLoad(false);
            }   
            getLives();
        }, [])
    );

    // useEffect(() => {
    //     if (!initialized) return;

    //     if (authState?.authenticated) {
    //         if (navigationContainerRef.current) {
    //             navigationContainerRef.current.navigate("Livestreams");
    //         } // Replace with the name of your inside screen
    //     } else {
    //         client?.disconnectUser();
    //         if (navigationContainerRef.current) {
    //             navigationContainerRef.current.navigate("SignupScreen");
    //         }
    //         // navigation.navigate(); // Replace with the name of your login screen
    //     }
    // }, [initialized, authState]);

    useEffect(() => {
        if (authState?.authenticated && authState.token) {
            const user = { id: authState.user_id };
            try {
                const client = new StreamVideoClient({ apiKey: STREAM_KEY, user, token: authState.token });
                setClient(client);
            } catch (e) {
                console.log('Error creating client: ', e);
            }
        } 
        console.log("clllllllll", client);
        console.log("authState", authState); 
    }, [authState]); 
         
    // useEffect(() => { 
    //     if (authState.token && authState.user_id) {
    //         const initializeClient = async () => {
    //             try {
    //                 const user = { id: authState.user_id };
    //                 const client = new StreamVideoClient({ apiKey, user:authState.user_id, token: authState.token });
    //                 setClient(client);
    //                 console.log('====================================');
    //                 console.log("cliennnnnttttt", client);
    //                 console.log('====================================');
    //             } catch (error) {
    //                 console.log("Error initializing client or joining call:", error);
    //             }
    //         };
    //         initializeClient();
    //     }
    // }, [authState]);
   
    const watchStream = async (id) => {
        if (client) {
            navigation.navigate('RenderLivestream', { live_ID: liveID, call_ID: id, StreamType: "Watch", client: client });
            // setWhatVideoIsThis("Watch")
        }
        // <StreamVideo client={client}>
        //     <OverlayProvider>
        //         <LiveStreamRoom />
        //     </OverlayProvider>
        // </StreamVideo>
        // console.log('====================================');
        // console.log("ey eyyy",client);
        // console.log('====================================');
    };



    return (
        <>
            {/* {client && ( */}
                <GestureHandlerRootView>
                    <View style={styles.container}>
                        {/* <StreamVideo client={client}>*/}
                        <OverlayProvider>
                            <View style={styles.buttonsView}>
                                <TouchableOpacity style={styles.buttonsStyle} onPress={showDialog}>
                                    <Text style={styles.buttonTextStyle}>Start live</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={styles.buttonsStyle}>
                                    <Text style={styles.buttonTextStyle}>Create room</Text>
                                </TouchableOpacity> */}
                            </View>
                            <Text style={styles.onGoingLiveText}>On going lives:</Text>
                            {currentLives.length > 0 ? (
                                currentLives.map((item, key) => {
                                    return (
                                        <TouchableOpacity key={key} style={styles.card} onPress={() => watchStream(item.liveID)}>
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
                        </OverlayProvider>
                        {/*  </StreamVideo> */}
                    </View>
                </GestureHandlerRootView>
            {/* )} */}

          
        </>


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