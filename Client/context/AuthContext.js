import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../service/AuthService';
import * as SecureStore from "expo-secure-store"


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const TOKEN_KEY = "1"

    const [authState, setAuthState] = useState({
        token: null,
        authenticated: null,
        user_id: null
    });
    const [initialized, setInitialized] = useState(false);

    // useEffect(()=>{
        const loadStreamToken = async () => {
            const data = await SecureStore.getItemAsync(TOKEN_KEY);
            // console.log("dataaaaaaa", data);
    
            if (data) {
                const object = JSON.parse(data);
                // console.log("token", object.data.token);
                AsyncStorage.removeItem('authState');
    
                // Set our context state
                setAuthState({
                    token: object.data.token,
                    authenticated: true,
                    user_id: object.data.user.id,
                });
                setInitialized(true);
                //   console.log("authstate",authState); 
            }
            // console.log("authState", authState);
    
        };
    //     loadStreamToken();
    // })

    const loginForStream = async (email) => {
        // const email = await fetchEmail();
        // console.log("email", email);
        try {
            await login(email, email)
                .then(result => {
                    console.log("done logging in for stream", authState);
                    loadStreamToken();
                })
        } catch (error) {
            Alert.alert('Error', 'Could not log in to stream');
            console.log(e);
        }
    }


    return (
        <AuthContext.Provider value={{ authState, setAuthState, initialized, setInitialized, loginForStream }}>
            {children}
        </AuthContext.Provider>
    );
};
