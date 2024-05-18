import * as SecureStore from "expo-secure-store"
import axios from "axios"

const TOKEN_KEY = "1"
// export const API_URL = process.env.EXPO_PUBLIC_SERVER_URL;
export const API_URL = "http://192.168.1.16:3001"

export async function login(email, password) {
  try {
    const result = await axios.post(`${API_URL}/loginUserToStream`, { email, password })

    // Write the JWT to our secure storage
    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(result))
    return result;
  } catch (e) {
    return { error: true, msg: e }
  }
}

export async function register(email, password) {
  try {
    const result = await axios.post(`${API_URL}/register`, { email, password })

    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(result))

    return result
  } catch (e) {
    return { error: true, msg: e.response?.data.msg }
  }
}

export async function logout() {
  // Delete token from storage
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}
