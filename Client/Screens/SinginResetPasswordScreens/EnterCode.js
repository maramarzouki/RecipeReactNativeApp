import { View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios';
import { IP_ADDRESS } from '@env'

export default function EnterCode({ navigation, route }) {
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");

    const email = route.params.email;

    const verifyCode = async () => {
        console.log("verifying code...");
        if (!code) {
            setCodeError("Please enter your code before!")
        }
        const codeToNum = parseInt(code, 10)
        Axios.post(`http://${IP_ADDRESS}:3001/verifyResetPasswordCode`, {
            email,
            code: codeToNum
        }).then((response) => {
            console.log(response.data);
            navigation.navigate('ResetPasswordScreen', { codeToNum })
        }).catch((error) => {
            console.log(email);
            console.log(error.response.data);
            console.log(code);
            if (code !== "") {
                setCodeError(error.response.data)
            }
        })
    }


    return (
        <ImageBackground style={styles.image} source={require('../../assets/background14.jpg')}>
            <View style={styles.innerFrame}>
                <Text style={styles.enterCodeText}>Please enter your code below:</Text>
                <View style={styles.formContainer}>
                    <View>
                        <FontAwesomeIcon icon={faKey} style={styles.icons} size={16} />
                        <TextInput
                            placeholder="Code"
                            style={styles.textInput}
                            onChangeText={(text) => setCode(text)} />
                        {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}
                    </View>
                    <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.buttonStyle}
                            onPress={() => { verifyCode() }}
                        >
                            <Text style={styles.buttonText}>Reset password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.cancelButtonStyle}
                            onPress={() => { navigation.navigate('SigninScreen') }}>
                            <Text style={styles.cancelText}>Cancel</Text>
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
    enterCodeText: {
        alignSelf: 'center',
        bottom: 70,
        fontSize: 16,
        color: "#fff",
        width: 300,
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
        top: 40,
        padding: 12,
        width: 150,
        alignSelf: "flex-start",
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
        alignSelf: "flex-end",
        bottom: 3
    }
})