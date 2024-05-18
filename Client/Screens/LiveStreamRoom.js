import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
    Call,
    StreamVideoClient,
    User,
    StreamVideo,
    StreamCall,
    HostLivestream
} from '@stream-io/video-react-native-sdk';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { IP_ADDRESS } from '@env';
import { OverlayProvider } from 'stream-chat-expo';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function LiveStreamRoom({ navigation, route }) {
    const callId = route.params.id;
    const liveId = route.params.liveId;

    const [authState, setAuthState] = useState({
        token: null,
        authenticated: null,
        user_id: null
    })

    const fetchAuthState = async () => {
        try {
            const storedAuthState = await AsyncStorage.getItem('authState');
            if (storedAuthState) {
                const parsedAuthState = JSON.parse(storedAuthState);
                setAuthState(parsedAuthState)
            }
        } catch (error) {
            console.error('Error fetching email:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchAuthState();
        console.log("authState", authState);
    }, [])
    const apiKey = 'ya7d29hmmd9m';
    const userId = authState.user_id;
    const token = authState.token;
    const user = { id: userId };

    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call('livestream', callId);
    call.join({ create: true });

    const leaveLivestream = () => {
        axios.delete(`http://${IP_ADDRESS}:3001/deleteLive/${liveId}`)
            .then((res) => {
                navigation.goBack();
            }).catch((err) => {
                console.log(err);
            })
    }

    // const shareMeeting = async () => {
    //     Share.share({
    //         message: `Join my meeting: myapp://(inside)/(room)/${id}`,
    //     });
    // };

    // useEffect(() => {
    //     console.log("client from room id", client)

    //     navigation.setOptions({
    //       headerRight: () => (
    //         <TouchableOpacity onPress={shareMeeting}>
    //           <Ionicons name="share-outline" size={24} color="white" />
    //         </TouchableOpacity>
    //       )
    //     })

    //     const unsubscribe = client.on("all", event => {
    //       console.log(event)

    //       if (event.type === "call.reaction_new") {
    //         console.log(`New reaction: ${event.reaction}`)
    //       }

    //       if (event.type === "call.session_participant_joined") {
    //         console.log(`New user joined the call: ${event.participant}`)
    //         const user = event.participant.user.name
    //         Toast.show({
    //           text1: "User joined",
    //           text2: `Say hello to ${user} 👋`
    //         })
    //       }

    //       if (event.type === "call.session_participant_left") {
    //         console.log(`Someone left the call: ${event.participant}`)
    //         const user = event.participant.user.name
    //         Toast.show({
    //           text1: "User left",
    //           text2: `Say goodbye to ${user} 👋`
    //         })
    //       }
    //     })

    //     return () => {
    //       unsubscribe()
    //     }
    //   }, [])



    return (
        <StreamVideo client={client}>
            <OverlayProvider>
                <StreamCall call={call}>
                    <View style={styles.videoContainer}>
                        <HostLivestream onEndStreamHandler={leaveLivestream} />
                    </View>
                </StreamCall>
                {/* <Toast/> */}
            </OverlayProvider>
        </StreamVideo>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: WIDTH > HEIGHT ? 'row' : 'column',
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: '#fff',
    },
});