import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { StreamVideo } from '@stream-io/video-react-native-sdk'
import { OverlayProvider } from 'stream-chat-expo'
import LiveStreamRoom from './LiveStreamRoom'
import LiveStreamWatch from './LiveStreamWatch'

export default function RenderLivestream({ navigation, route }) {
  // const type = route.params.StreamType
  // const client = route.params.client
  // const liveId = route.params.liveId
  // const callId = route.params.callId
  // const call_Id = route.params.call_Id 
  // const live_Id = route.params.live_Id

  if (!route || !route.params) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: No route parameters found.</Text>
      </View>
    );
  }

  const { StreamType, client, liveID, callID, live_ID, call_ID } = route.params;

  useEffect(() => {
    console.log('====================================');
    console.log(StreamType, client, liveID, callID, live_ID, call_ID);
    console.log("lllllllllll", client);
    console.log('====================================');
  })
  return (
    <StreamVideo client={client}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <OverlayProvider>
          {StreamType === "Stream" && (
            <LiveStreamRoom liveId={liveID} callId={callID} />
          )}
          {StreamType == "Watch" && (
            <LiveStreamWatch liveID={call_ID} />
          )}
        </OverlayProvider>
        {/* <Text>{type}</Text> */}
      </View>
    </StreamVideo>
  )
}