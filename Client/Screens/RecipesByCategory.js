import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Categories from './CreateRecipe/Categories'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { faAngleRight, faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default function RecipesByCategory({ navigation, route }) {

    const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS

    const category = route.params.category;

    const [recipesList, setRecipesList] = useState([])

    const getRecipesListByCategory = () => {
        console.log("Getting recipes list...");
        axios.get(`http://${IP_ADDRESS}:3001/getRecipesByCategory/${category}`)
            .then(response => {
                console.log(response.data);
                console.log(response.status);
                console.log(category);
                console.log(Categories);
                setRecipesList(response.data)
            })
    }

    useEffect(() => {
        getRecipesListByCategory()
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: hp(1) }}>
                {recipesList.map((item, key) => {
                    return (
                        <TouchableOpacity
                            style={styles.recipeList}
                            activeOpacity={0.9}
                            key={key}
                            onPress={() => { navigation.navigate('Recipe details', { recipeID: item._id }) }}
                        >
                            <Image
                                // source={require('../assets/smallbackground5.jpg')}
                                source={{ uri: item.image }}
                                style={styles.recipeListImg}
                            />
                            {/* <View style={{ flexDirection: 'row', paddingLeft: hp(2.2) }}> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: hp(1.7), paddingRight: hp(1.5) }}>
                                <Text style={styles.recipeListText}>{item.title}</Text>
                                <FontAwesomeIcon icon={faAngleRight} size={15} style={styles.recipeListIcon} />
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    recipeList: {
        width: hp(20),
        borderColor: '#ddd',
        borderWidth: hp(0.12),
        height: hp(22),
        backgroundColor: '#fff',
        borderRadius: hp(5),
        marginLeft: hp(2),
        elevation: hp(0.3),
        marginBottom: hp(1)
    },
    recipeListImg: {
        width: hp(19.8),
        height: hp(16),
        borderTopRightRadius: hp(5),
        borderTopLeftRadius: hp(5),
        // opacity: hp(0.1)
    },
    recipeListText: {
        top: hp(1.3),
        fontSize: hp(1.9),
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        // left: hp(2)
    },
    recipeListIcon: {
        textAlign: 'center',
        top: hp(2),
        fontSize: hp(1.9),
        fontWeight: 'bold',
        // left: hp(2.3)
    },
    category: {
        width: hp(20),
        height: hp(5),
        borderWidth: hp(0.15),
        borderColor: "#000",
        borderRadius: hp(5),
        left: hp(3),
        backgroundColor: "#fff",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
        justifyContent: 'center',
    },
    categoryText: {
        alignSelf: "center",
    }
})