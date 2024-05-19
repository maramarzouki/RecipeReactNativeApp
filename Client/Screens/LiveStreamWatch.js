import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Call, StreamCall, useStreamVideoClient, ViewerLivestream } from '@stream-io/video-react-native-sdk';

import { OverlayProvider } from 'stream-chat-expo';

export default function LiveStreamWatch({ navigation, route }) {
  const liveID = route.params.id;

  useEffect(() => {
    console.log(liveID);
  })

  const [call, setCall] = useState(null)
  const client = useStreamVideoClient()

  useEffect(() => {
    console.log("client", client)
  }, [client])

  useEffect(() => {
    console.log("the id sama7ni?", liveID)
    const joinCall = async () => {
      if (!client || call) return

      try {
        const call = client.call("livestream", liveID)
        await call.join()
        setCall(call)
      } catch (error) {
        console.error("Error joining call:", error)
      }
    }

    joinCall()
  }, [call, client, liveID])

  const goToHomeScreen = async () => {
    navigation.goBack();
  }

  return (
      <View style={styles.container}>
        <StreamCall call={call}>
          <ViewerLivestream onLeaveStreamHandler={goToHomeScreen} />
        </StreamCall>
      </View>
  )
}


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000" // Adjust background color as needed
  }
})