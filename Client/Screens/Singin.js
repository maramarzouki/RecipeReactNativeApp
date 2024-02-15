import { View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios';
import { IP_ADDRESS } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Singin({ navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");


    const signinUser = () => {
        setEmailError("");
        setPasswordError("");

        if (!email) {
            setEmailError("Email cannot be empty!");
        } else if (!password) {
            setPasswordError("Password cannot be empty!");
        } else {
            Axios.post(`http://${IP_ADDRESS}:3001/signin`, {
                email, password
            }).then(response => {
                // console.log(response.data.Token);
                navigation.navigate('Profile')
                // localStorage.setItem('TOKEN', response.data.Token)
                AsyncStorage.setItem('TOKEN', response.data.Token)
            }).catch(error => {
                console.log(error.response.data.ERROR);
                const errorMessage = error.response.data.ERROR;

                if (errorMessage.includes("Password is not correct!")) {
                    setPasswordError("Password is not correct!");
                } else if (errorMessage.includes("User doesn't exist!")) {
                    setEmailError("User doesn't exist, please verify your email!")
                }
            })
        }
    }

    return (
        <ImageBackground style={styles.image} source={require('../assets/background14.jpg')}>
            <View style={styles.innerFrame}>
                <Text style={styles.signinText}>SIGN IN</Text>
                <View style={styles.formContainer}>
                    <View>
                        <FontAwesomeIcon icon={faEnvelope} style={styles.icons} size={16} />
                        <TextInput
                            placeholder="Email"
                            style={styles.textInput}
                            onChangeText={(text) => setEmail(text)} />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>
                    <View>
                        <FontAwesomeIcon icon={faLock} style={styles.icons} size={16} />
                        <TextInput
                            secureTextEntry={true}
                            placeholder="Password"
                            style={styles.textInput}
                            onChangeText={text => setPassword(text)} />
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        <Text style={styles.forgotPasswordText} onPress={() => { navigation.navigate('EnterEmailScreen') }}>Forgot password?</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.buttonStyle}
                        onPress={() => { signinUser() }}
                    >
                        <Text style={styles.buttonText}>Sing in</Text>
                    </TouchableOpacity>
                    <Text style={styles.belowSigninButtonText}>
                        Don't have an account yet? <Text style={styles.signupText} onPress={() => { navigation.navigate('SignupScreen') }}>Sign up</Text>
                    </Text>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
    signinText: {
        alignSelf: 'center',
        bottom: 100,
        fontSize: 40,
        color: "#fff",
    },
    innerFrame: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    textInput: {
        borderColor: '#D3D3D3',
        backgroundColor: '#F6F6F6',
        width: 300,
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize: 15,
        borderRadius: 20,
        marginTop: 20,
        paddingLeft: 47, // Adjust the paddingLeft to accommodate the icon
        padding: 10,
        position: 'relative', // Make sure the position is relative
        zIndex: 1, // Set a higher zIndex for the TextInput
    },
    icons: {
        color: '#000000',
        position: 'absolute',
        left: 20, // Adjust the left position to place the icon within the TextInput,
        zIndex: 2, // Set a higher zIndex for the icon
        top: 36,
    },
    formContainer: {
        bottom: 55,
    },
    buttonStyle: {
        backgroundColor: "#800e13",
        borderRadius: 50,
        top: 40,
        padding: 12,
        width: 200,
        alignSelf: "center",
    },
    buttonText: {
        color: 'white',
        alignSelf: 'center',
    },
    belowSigninButtonText: {
        alignSelf: 'center',
        color: 'white',
        top: 50,
        fontWeight: 'bold',
    },
    signupText: {
        color: '#800e13',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
    forgotPasswordText: {
        color: '#800e13',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        left: 7,
        top: 7
    },
})