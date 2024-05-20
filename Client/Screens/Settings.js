import { faPerson, faPersonRifle, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function Settings({navigation}) {
    const goToUpdateProfile = () => {
        navigation.navigate('Edit profile')
    }

    const logout = () => {
        AsyncStorage.removeItem('TOKEN')
        navigation.navigate('SigninScreen')
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.settingItem} onPress={goToUpdateProfile}>
                <FontAwesomeIcon icon={faUser}  />
                <Text style={{left: hp(2)}}>Edit Profile</Text>
            </TouchableOpacity>
            <View style={styles.separator}></View>
            <TouchableOpacity style={styles.settingItem} onPress={logout}>
                <FontAwesomeIcon icon={faRightFromBracket}/>
                <Text style={{left: hp(2)}}>Logout</Text>
            </TouchableOpacity>
            <View style={styles.separator}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    settingItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
    },
    separator: {
        height: 1,
        backgroundColor: '#000000',
    },
});
