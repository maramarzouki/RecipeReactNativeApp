import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Categories from '../assets/data/Categories'

export default function AllCategories({ navigation }) {
    const goToRecipesByCategory = (category) => {
        navigation.navigate('Category', { category: category })
    }
    return (
        <ScrollView style={{ padding: hp(0), backgroundColor: "#fff" }}>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                {Categories.map((item, key) => (
                    <TouchableOpacity
                        style={styles.category}
                        onPress={() => { goToRecipesByCategory(item) }}
                        key={key}
                    >
                        <Text style={styles.categoryText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    category: {
        width: hp(20),
        height: hp(5),
        borderWidth: hp(0.15),
        borderColor: "#fff",
        borderRadius: hp(5),
        left: hp(3),
        backgroundColor: "#720026",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
        justifyContent: 'center',
        margin: hp(0.2)
    },
    categoryText: {
        alignSelf: "center",
        color: "#FFFFFF",
        fontWeight: "bold",
    }
})