import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch, faMagnifyingGlass, faPlay, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import axios from 'axios'
import { IP_ADDRESS } from '@env'

export default function SearchPage({ navigation }) {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const searchRecipe = async () => {
    setSearchResults([])
    const response = await axios.get(`http://${IP_ADDRESS}:3001/searchRecipe?query=${query}`)
    setSearchResults(response.data)
    console.log(response.data);
    console.log("search...");
  }


  useEffect(() => {
  }, [searchResults, query])
  

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View>
        <View style={{ marginLeft: hp(1.5) }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={styles.inputIcon} />
          <TextInput
            placeholder='Search'
            style={styles.searchInput}
            clearButtonMode='always'      
            onChangeText={(text) => { setQuery(text) }}
          />
        </View>
        <TouchableOpacity style={styles.profileImageView} onPress={searchRecipe}>
          <FontAwesomeIcon icon={faPlay} style={styles.buttonIcon} size={hp(1.7)} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', top: hp(5) }}>
        {searchResults.map((item, index) => {
          return (
            <TouchableOpacity
              style={styles.recipeList}
              activeOpacity={0.9}
              key={index}
              onPress={() => { navigation.navigate('Recipe details', { recipeID: item._id }) }}
            >
              <Image
                // source={require('../assets/smallbackground5.jpg')}
                source={{ uri: item.image }}
                style={styles.recipeListImg}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
  searchInput: {
    borderColor: '#D3D3D3',
    backgroundColor: '#F6F6F6',
    width: hp(36),
    // width: 300,
    borderWidth: hp('0.05%'),
    borderStyle: 'solid',
    fontSize: hp(1.7),
    borderRadius: hp(2),
    top: hp(2.1),
    paddingLeft: hp(5),
    padding: hp(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, // This property is for Android
  },
  inputIcon: {
    color: '#7B7171',
    position: 'absolute',
    left: hp(2),
    zIndex: hp(1),
    top: hp(3.7),
  },
  profileImageView: {
    backgroundColor: '#800e13',
    width: hp(5),
    height: hp(5),
    borderRadius: hp(30),
    position: 'absolute',
    top: hp(2.1),
    right: hp(2.5),
    borderColor: 'white',
    //shadow props
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, // This property is for Android
    overflow: 'hidden', // Ensure the shadow is not clipped
  },
  buttonIcon: {
    color: '#fff',
    position: 'absolute',
    left: hp(1.8),
    top: hp(1.7),
  },
  recipeList: {
    width: hp(18),
    borderColor: '#ddd',
    borderWidth: hp(0.12),
    height: hp(20),
    backgroundColor: '#fff',
    borderRadius: hp(5),
    marginLeft: hp(2),
    elevation: hp(0.3),
    marginBottom: hp(1)
  },
  recipeListImg: {
    width: hp(17.8),
    height: hp(14),
    borderTopRightRadius: hp(5),
    borderTopLeftRadius: hp(5),
    // opacity: hp(0.1)
  },
  recipeListText: {
    top: hp(1.3),
    fontSize: hp(1.9),
    fontWeight: 'bold',
    right: hp(2.5)
  },
  recipeListIcon: {
    textAlign: 'center',
    top: hp(2),
    fontSize: hp(1.9),
    fontWeight: 'bold',
    left: hp(3.5)
  },
})