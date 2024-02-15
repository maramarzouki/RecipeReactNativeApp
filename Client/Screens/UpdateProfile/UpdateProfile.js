import { View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import axios, { Axios } from 'axios'
import { IP_ADDRESS } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { decode, encode } from 'base-64';
import Toast from 'react-native-toast-message';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

export default function UpdateProfile({ navigation }) {

    // const [userID, setUserID] = useState('');

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const fetchToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('TOKEN');
            return storedToken;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    };

    const dislayUserInfo = async () => {
        try {
            const token = await fetchToken();
            const decodedToken = jwtDecode(token);
            const userID = decodedToken._id

            axios.get(`http://${IP_ADDRESS}:3001/getUserDetails/${userID}`)
                .then(response => {
                    console.log(response.data);
                    console.log(userID);
                    setUsername(response.data.User.username);
                    setEmail(response.data.User.email)
                })
                .catch(error => {
                    console.log('Error fetching user info:', error.response);
                });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const updateUserInfo = async () => {
        const token = await fetchToken();
        const decodedToken = jwtDecode(token);
        const userID = decodedToken._id

        setUsernameError("");
        setEmailError("");

        if (!username) {
            setUsernameError("This input cannot be empty!");
        } else if (!email) {
            setEmailError("This input cannot be empty!");
        } else {
            axios.put(`http://${IP_ADDRESS}:3001/updateUserDetails/${userID}`, {
                username, email
            })
                .then(response => {
                    ToastAndroid.show('Profile updated!', ToastAndroid.SHORT);
                    navigation.navigate('Profile');
                    console.log("success");
                    console.log(response.data);
                }).catch(err => {
                    console.log(err.response.data);
                    if (err.response.data.username) {
                        setUsernameError(err.response.data.username.message+"!")
                    } else if (err.response.data.email) {
                        setEmailError(err.response.data.email.message+"!")
                    }

                    if ((err.response.data).includes("Username already in use!")) {
                        setUsernameError("Username already in use!");
                    } else if ((err.response.data).includes("Email already exists!")) {
                        setEmailError("Email already exists!");
                    }
                })
        }
    }

    const resetPasword = async () => {
        const token = await fetchToken();
        const decodedToken = jwtDecode(token);
        const userID = decodedToken._id

        setPasswordError("");
        setConfirmPasswordError("");

        if (!password) {
            setPasswordError("Password cannot be empty!");
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match!");
        } else if (password.length < 8) {
            setPasswordError("Passwords must be at least 8 characters!")
        } else {
            axios.put(`http://${IP_ADDRESS}:3001/resetpassword/${userID}`, {
                password
            }).then(response => {
                ToastAndroid.show('Password changed!', ToastAndroid.SHORT);
                navigation.navigate('Profile')
                console.log(response.data);
            }).catch(err => {
                console.log(err.response.data);
            })
        }
    }

    useEffect(() => {
        dislayUserInfo();
    }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Username:</Text>
            <View>
                <FontAwesomeIcon icon={faUser} style={styles.icons} size={16} />
                <TextInput
                    placeholder="Username"
                    style={styles.textInput}
                    defaultValue={username}
                    onChangeText={text => setUsername(text)} />
                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            </View>
            <Text style={styles.text}>Email:</Text>
            <View>
                <FontAwesomeIcon icon={faEnvelope} style={styles.icons} size={16} />
                <TextInput
                    placeholder="Email"
                    style={styles.textInput}
                    defaultValue={email}
                    onChangeText={(text) => setEmail(text)} />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonStyle}
                onPress={() => { updateUserInfo() }}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <View style={styles.lineContainer}>
                <View style={styles.line} />
                <Text style={styles.resetPasswordText}>Reset password</Text>
                <View style={styles.line} />
            </View>
            <View style={{ marginTop: 117 }}>
                <FontAwesomeIcon icon={faLock} style={styles.icons} size={16} />
                <TextInput
                    secureTextEntry={true}
                    placeholder="Password"
                    style={styles.textInput}
                    onChangeText={text => setPassword(text)} />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>
            <View style={{ marginTop: 20 }}>
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
                onPress={() => { resetPasword() }}>
                <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30
    },
    textInput: {
        borderColor: '#D3D3D3',
        backgroundColor: '#F6F6F6',
        width: 350,
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize: 15,
        borderRadius: 20,
        marginTop: 5,
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
        top: 22,
    },
    text: {
        marginTop: 15,
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonStyle: {
        backgroundColor: '#800e13',
        top: 50,
        width: 100,
        padding: 7,
        alignSelf: 'center',
        borderRadius: 25,
    },
    buttonText: {
        alignSelf: 'center',
        color: "#fff",
        fontWeight: 'bold',
        fontSize: 16.5,
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        top: 100,
    },
    resetPasswordText: {
        marginHorizontal: 10,
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    line: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        flex: 1,
        marginHorizontal: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
})

