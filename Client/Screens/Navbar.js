import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native';
import Homepage from './Homepage';
import SearchPage from './SearchPage';
import RecipeInfoForm from './MyRecipes/RecipeInfoForm';
import Profile from './Profile/Profile';
import UpdateProfile from './Profile/UpdateProfile';
import { TabBarIndicator } from 'react-native-tab-view';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, faHouse, faPlus, faSatellite, faSatelliteDish, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
// import Livestreams from '../livestream/app/livestream'; 
import Livestreams from './Livestreaming/Livestreams'; 

const Tab = createBottomTabNavigator();

export default function Navbar({ navigation }) {
    const [showButton, setShowButton] = useState(true)
    const CustomTabBarButton = ({ children, onPress }) => (
        <TouchableOpacity
            style={{
                top: hp(-3),
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: "#7f5df0",
                shadowOffset: { width: 0, height: hp(0.1) },
                shadowOpacity: hp(0.025),
                shadowRadius: hp(0.35),
                elevation: hp(0.5),
            }}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={{
                width: hp(5.8),
                height: hp(5.8),
                borderRadius: hp(3.5),
                backgroundColor: "#800e13"
            }}>
                {children}
            </View>
        </TouchableOpacity>
    )
    return (
        <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarStyle: styles.navBar }}>
            <Tab.Screen
                name='Home'
                component={Homepage}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabBarIcon}>
                            <FontAwesomeIcon icon={faHouse} style={{
                                color: focused ? '#800e13' : "#748c94",
                                bottom: hp(0.5)
                            }} />
                            <Text style={{
                                color: focused ? '#800e13' : "#748c94",
                                fontSize: hp(1.3)
                            }}>Home</Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name='Livestream'
                component={Livestreams}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabBarIcon}>
                            <FontAwesomeIcon icon={faSatelliteDish} style={{
                                color: focused ? '#800e13' : "#748c94",
                                bottom: hp(0.5)
                            }} />
                            <Text style={{
                                color: focused ? '#800e13' : "#748c94",
                                fontSize: hp(1.3)
                            }}>Livestream</Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name='Create recipe'
                component={RecipeInfoForm}
                options={({ route }) => ({
                    tabBarStyle: { display: route.name === 'Create recipe' ? 'none' : 'flex' },// Hide the entire tab bar when on "Create recipe"
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabBarIcon}>
                            <FontAwesomeIcon icon={faPlus} style={{
                                color: "#fff",
                                top: hp(-1)
                            }} />
                        </View>
                    ),
                    tabBarButton: (props) => {
                        return <CustomTabBarButton {...props} />
                    }
                })}
            />
            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabBarIcon}>
                            <FontAwesomeIcon icon={faUser} style={{
                                color: focused ? '#800e13' : "#748c94",
                                bottom: hp(0.5)
                            }} />
                            <Text style={{
                                color: focused ? '#800e13' : "#748c94",
                                fontSize: hp(1.3)
                            }}>Profile</Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name='Settings'
                component={UpdateProfile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabBarIcon}>
                            <FontAwesomeIcon icon={faGear} style={{
                                color: focused ? '#800e13' : "#748c94",
                                bottom: hp(0.5)
                            }} />
                            <Text style={{
                                color: focused ? '#800e13' : "#748c94",
                                fontSize: hp(1.3)
                            }}>Settings</Text>
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        // bottom: hp(2.7),
        // left: hp(2),
        // right: hp(2),
        backgroundColor: "#ffffff",
        borderRadius: hp(1),
        height: hp(7.5),
        shadowColor: "#7f5df0",
        shadowOffset: { width: 0, height: hp(0.1) },
        shadowOpacity: hp(0.025),
        shadowRadius: hp(0.35),
        elevation: hp(0.5)
    },
    tabBarIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        top: hp(1)
    },
    // icon: {
    //     width: hp(2.5),
    //     height: hp(2.5),
    //     tintColor: focused ? '#AD2831' : "#748c94"
    // },
    // tabText: {
    //     color: focused ? '#AD2831' : "#748c94",
    //     fontSize: hp(1)
    // }
})