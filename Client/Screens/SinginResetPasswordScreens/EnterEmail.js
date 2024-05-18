import { View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios';
import { IP_ADDRESS } from '@env'

export default function EnterEmail({ navigation }) {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const verifyEmail = () => {
        console.log("verifyEmail...");
        setEmailError("");

        if (!email) {
            setEmailError("Email cannot be empty!");
        }
        Axios.post(`http://${IP_ADDRESS}:3001/verifyEmailBeforeResetPassword`, {
            email
        }).then((response) => {
            console.log(response.data);
            navigation.navigate('EnterCodeScreen', { email })
        }).catch((error) => {
            console.log(error.response.data);
            if (email !== "") {
                setEmailError(error.response.data.ERROR);
            }
        })
    }

    return (
        <ImageBackground style={styles.image} source={require('../../assets/background14.jpg')}>
            <View style={styles.innerFrame}>
                <Text style={styles.enterEmailText}>Please enter your email here, to receive a code:</Text>
                <View style={styles.formContainer}>
                    <View>
                        <FontAwesomeIcon icon={faEnvelope} style={styles.icons} size={16} />
                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            onChangeText={(text) => setEmail(text)} />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>
                    <View style={{paddingLeft:20, paddingRight:20}}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.cancelButtonStyle}
                            onPress={()=>{navigation.navigate('SigninScreen')}}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.buttonStyle}
                            onPress={() => { verifyEmail() }}
                        >
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
    enterEmailText: {
        alignSelf: 'center',
        bottom: 70,
        fontSize: 16,
        color: "#fff",
        width: 300,
        textAlign: 'center'
    },
    innerFrame: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    textInput: {
        borderColor: '#D3D3D3',
        backgroundColor: '#F6F6F6',
        width: 300,
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize: 15,
        borderRadius: 20,
        paddingLeft: 47, // Adjust the paddingLeft to accommodate the icon
        padding: 12,
        position: 'relative', // Make sure the position is relative
        zIndex: 1, // Set a higher zIndex for the TextInput
    },
    icons: {
        color: '#000000',
        position: 'absolute',
        left: 20, // Adjust the left position to place the icon within the TextInput,
        zIndex: 2, // Set a higher zIndex for the icon
        top: 14,
    },
    formContainer: {
        bottom: 55,
    },
    buttonStyle: {
        backgroundColor: "#800e13",
        borderRadius: 25,
        padding: 12,
        width: 100,
        alignSelf: "flex-end",
    },
    buttonText: {
        color: 'white',
        alignSelf: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
    cancelText: {
        color: '#800e13',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    cancelButtonStyle:{
        backgroundColor: "white",
        borderRadius: 25,
        padding: 12,
        width: 100,
        alignSelf: "flex-start",
        bottom: 3,
        top: 40
    }
})