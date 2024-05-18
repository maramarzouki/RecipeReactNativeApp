import { View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios';
import { IP_ADDRESS } from '@env'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Signup({ navigation }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // const IP_ADDRESS = Config.IP_ADDRESS

    const registerUser = () => {
        // console.log("registerUser");
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        if (!username) {
            setUsernameError("Username cannot be empty!");
        } else if (!email) {
            setEmailError("Email cannot be empty!");
        } else if (!password) {
            setPasswordError("Password cannot be empty!");
        }else if(password.length < 8){
            setPasswordError("Passwords must be at least 8 characters!")
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match!");
        }else{
            console.log("button pressed!");
            console.log(IP_ADDRESS);
            Axios.post(`http://${IP_ADDRESS}:3001/signup`, {
                username, email, password
            }).then(response => {
                navigation.navigate('SigninScreen')
                setUsernameError("");
                setEmailError("");
                setPasswordError("");
                setConfirmPasswordError("");
                console.log(response.data.Token);
            }).catch(err => {
                console.log(err.response.data);
                // if(err.response.data.errors.username){
                //     setUsernameError(err.response.data.errors.username.message+": \nonly letters, numbers and _ are allowed");
                // }else if(err.response.data.errors.email){
                //     setEmailError(err.response.data.errors.email.message)
                // }
    
                // if(err.response.data.ERROR){
                //     if(err.response.data.ERROR==="Username already taken!" || err.response.data.ERROR==="Users validation failed: username: Invalid username format"){
                //         setUsernameError(err.response.data.ERROR)
                //     }else if(err.response.data.ERROR==="Email already taken!" || err.response.data.ERROR==="Users validation failed: email: Invalid email format"){
                //         setEmailError(err.response.data.ERROR);
                //     }
                // }
    
                if (err.response && err.response.data && err.response.data.ERROR) {
                    // Extract specific error message from the response
                    const errorMessage = err.response.data.ERROR;
    
                    // Handle different error messages
                    if (errorMessage.includes("Invalid username format!")) {
                        setUsernameError("Invalid username format");
                    } else if (errorMessage.includes("Invalid email format!")) {
                        setEmailError("Invalid email format");
                    } else if (errorMessage.includes("Username already taken!")) {
                        setUsernameError("Username already taken!");
                    } else if (errorMessage.includes("Email already exists!")) {
                        setEmailError("Email already exists!");
                    }
                }
            })
        }
    }

    return (
        <ImageBackground style={styles.image} source={require('../assets/background14.jpg')}>
            <View style={styles.innerFrame}>
                <Text style={styles.signupText}>SIGN UP</Text>
                <View style={styles.formContainer}>
                    <View>
                        <FontAwesomeIcon icon={faUser} style={styles.icons} size={16} />
                        <TextInput
                            placeholder="Username"
                            style={styles.textInput}
                            onChangeText={text => setUsername(text)} />
                        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
                    </View>
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
                    </View>
                    <View>
                        <FontAwesomeIcon icon={faLock} style={styles.icons} size={16} />
                        <TextInput
                            secureTextEntry={true}
                            placeholder="Confirm password"
                            style={styles.textInput}
                            onChangeText={text => setConfirmPassword(text)} />
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.buttonStyle}
                        onPress={() => registerUser()}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    <Text style={styles.belowRegisterButtonText}>
                        Already have an account? <Text style={styles.signinText} onPress={() => { navigation.navigate('SigninScreen') }}>Sign in</Text>
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
    signupText: {
        alignSelf: 'center',
        bottom: hp(10),
        fontSize: hp(4),
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
        width: hp(35),
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize: hp(1.75),
        borderRadius: hp(2.5),
        marginTop: hp(2.3),
        paddingLeft: hp(5.4), // Adjust the paddingLeft to accommodate the icon
        padding: hp(1.4),
        position: 'relative', // Make sure the position is relative
        zIndex: 1, // Set a higher zIndex for the TextInput
    },
    icons: {
        color: '#000000',
        position: 'absolute',
        left: hp(2.3), // Adjust the left position to place the icon within the TextInput,
        zIndex: 2, // Set a higher zIndex for the icon
        top: hp(4.4),
    },
    formContainer: {
        bottom: hp(6.4),
    },
    buttonStyle: {
        backgroundColor: "#800e13",
        borderRadius: hp(5),
        top: hp(3.5),
        padding: hp(1.5),
        width: hp(20),
        alignSelf: "center",
    },
    buttonText: {
        color: 'white',
        alignSelf: 'center',
    },
    belowRegisterButtonText: {
        alignSelf: 'center',
        color: 'white',
        top: hp(4.2),
        fontWeight: 'bold',
    },
    signinText: {
        color: '#800e13',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: hp(1.4),
        marginTop: hp(0.5),
    },
    // inputContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 20,
    // },
})