import { View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios';
import { IP_ADDRESS } from '@env'

export default function ResetPassword({ navigation, route }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const code = route.params.codeToNum;

    const changePasswordThenLogin = async () => {
        // console.log("change password");
        setPasswordError("");
        setConfirmPasswordError("");

        if (!password) {
            setPasswordError("Password cannot be empty!");
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match!");
        } else if (password.length < 8) {
            setPasswordError("Passwords must be at least 8 characters!")
        } else {
            Axios.put(`http://${IP_ADDRESS}:3001/resetPassword`, {
                code, password
            }).then((response) => {
                console.log(response.data);
                navigation.navigate('SigninScreen')
            }).catch((error) => {
                console.log(error.response);
            })
        }

    }

    return (
        <ImageBackground style={styles.image} source={require('../../assets/background14.jpg')}>
            <View style={styles.innerFrame}>
                <Text style={styles.changePasswordText}>You can now change your password:</Text>
                <View style={styles.formContainer}>
                    <View style={{ top: 5 }}>
                        <FontAwesomeIcon icon={faLock} style={styles.icons} size={16} />
                        <TextInput
                            secureTextEntry={true}
                            placeholder="Password"
                            style={styles.textInput}
                            onChangeText={text => setPassword(text)} />
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    </View>
                    <View style={{ top: 20 }}>
                        <FontAwesomeIcon icon={faLock} style={styles.icons} size={16} />
                        <TextInput
                            secureTextEntry={true}
                            placeholder="Confirm password"
                            style={styles.textInput}
                            onChangeText={text => setConfirmPassword(text)} />
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                    </View>
                    <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.buttonStyle}
                            onPress={() => { changePasswordThenLogin() }}
                        >
                            <Text style={styles.buttonText}>Login</Text>
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
    changePasswordText: {
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
        padding: 10,
        position: 'relative', // Make sure the position is relative
        zIndex: 1, // Set a higher zIndex for the TextInput
    },
    icons: {
        color: '#000000',
        position: 'absolute',
        left: 20, // Adjust the left position to place the icon within the TextInput,
        zIndex: 2, // Set a higher zIndex for the icon
        top: 17,
    },
    formContainer: {
        bottom: 55,
    },
    buttonStyle: {
        backgroundColor: "#800e13",
        borderRadius: 25,
        top: 40,
        padding: 12,
        width: 100,
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