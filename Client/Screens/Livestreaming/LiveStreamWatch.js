import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Call, StreamCall, StreamVideo, useStreamVideoClient, ViewerLivestream } from '@stream-io/video-react-native-sdk';

import { OverlayProvider } from 'stream-chat-expo';
import { useNavigation } from '@react-navigation/native';

export default function LiveStreamWatch({ liveID }) {
  // const liveID = route.params.id;

  const navigation = useNavigation();

  useEffect(() => {
    console.log("liveeeeeeeeiddddddddd", liveID);
  })

  // const [call, setCall] = useState(null)
  const client = useStreamVideoClient()
  // const client = route.params.client;

  useEffect(() => {
    console.log("client", client)
  }, [client])

  // useEffect(() => {   
  //   console.log("the id sama7ni?", liveID)
  //   const joinCall = async () => {
  //     if (!client || call) return

  //     try {
  const call = client.call("livestream", liveID)
  call.join()
  //     setCall(call)
  //   } catch (error) {
  //     console.error("Error joining call:", error)
  //   }
  // } 

  // console.log('====================================');
  // console.log("the calllll", call);
  // console.log('====================================');
  //   joinCall()
  // }, [call, client, liveID])

  const goToHomeScreen = async () => {
    console.log("..");
    navigation.navigate('Navbar')
  }

  // if (!call) return null;
  return (
    // <StreamVideo client={client}>
    <View style={styles.container}>
      <StreamCall call={call}>
        <ViewerLivestream onLeaveStreamHandler={goToHomeScreen} />
      </StreamCall>
    </View>
    // {/* </StreamVideo> */}
  )
}


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000" // Adjust background color as needed
  }
})