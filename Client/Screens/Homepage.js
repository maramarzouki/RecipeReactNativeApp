import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { faArrowRight, faEllipsis, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default function Homepage({ navigation }) {

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <View>
                <View style={{ marginLeft: hp(1.5) }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={styles.icons} />
                    <TextInput
                        placeholder='Search'
                        style={styles.searchInput}
                        onPressIn={() => { navigation.navigate('Search') }}
                    />
                </View>
                <TouchableOpacity style={styles.profileImageView} onPress={() => { navigation.navigate('Profile') }}>
                    <Image
                        source={require('../assets/chefavatr.jpg')}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Categories</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', padding: hp(1.2) }}>
                    <TouchableOpacity
                        style={styles.category}
                        onPress={() => { navigation.push('My recipes') }}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={require('../assets/sweetsBG.jpg')}
                            style={styles.categoriyImg}
                        />
                        <Text style={styles.categoryText}>Sweets</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.category}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={require('../assets/pastaBG.jpg')}
                            style={styles.categoriyImg}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.categoryText}>Pasta</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.category}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={require('../assets/drinksBG.jpg')}
                            style={styles.categoriyImg}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.categoryText}>Drinks</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.category}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={require('../assets/soupBG.jpg')}
                            style={styles.categoriyImg}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.categoryText}>Soups</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.category}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={require('../assets/riceBG.jpg')}
                            style={styles.categoriyImg}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.categoryText}>Rice</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreBtn}>
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    searchInput: {
        borderColor: '#D3D3D3',
        backgroundColor: '#F6F6F6',
        width: hp(36),
        // width: 300,
        borderWidth: hp('0.05%'),
        borderStyle: 'solid',
        fontSize: hp(1.7),
        borderRadius: hp(2),
        marginTop: hp(2),
        paddingLeft: hp(5),
        padding: hp(1),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2, // This property is for Android
    },
    icons: {
        color: '#7B7171',
        position: 'absolute',
        left: hp(2),
        zIndex: hp(1),
        top: hp(3.7),
    },
    profileImage: {
        width: hp(6),
        height: hp(6),
        borderRadius: hp(30),
        borderWidth: hp(0.3),
        borderColor: 'white',
    },
    profileImageView: {
        backgroundColor: '#F6F6F6',
        width: hp(6),
        height: hp(6),
        borderRadius: hp(30),
        position: 'absolute',
        top: hp(1.7),
        right: hp(2.1),
        borderColor: 'white',
        //shadow props
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2, // This property is for Android
        overflow: 'hidden', // Ensure the shadow is not clipped
    },
    title: {
        margin: hp(2),
        fontSize: hp(2),
        fontWeight: 'bold',
    },
    category: {
        width: hp(18),
        borderColor: '#ddd',
        borderWidth: hp(0.12),
        height: hp(13),
        backgroundColor: '#fff',
        borderRadius: hp(5),
        marginLeft: hp(0.9),
        elevation: hp(0.3),
    },
    categoriyImg: {
        width: hp(18),
        height: hp(13),
        borderRadius: hp(5),
        opacity: hp(0.1),
    },
    categoryText: {
        textAlign: 'center',
        top: hp(-4),
        color: "#fff",
        fontSize: hp(1.8),
        fontWeight: '800',
        left: hp(3),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    moreBtn:{
        borderRadius: hp(5),
        borderWidth: hp(0.14),
        borderColor: "#000",
        padding: hp(1),
        height: hp(4),
        width: hp(4),
        top: hp(5),
        left: hp(1.2)
    }
})