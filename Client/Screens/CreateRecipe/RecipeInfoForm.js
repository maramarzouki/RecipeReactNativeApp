import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, FlatList, StyleSheet, Button, Image, ScrollView } from 'react-native';
import cuisineTypes from './CuisineType';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import * as ImagePicker from 'expo-image-picker';
import categories from './Categories'
import axios from 'axios'
import { IP_ADDRESS } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { decode, encode } from 'base-64'; // Import base-64 library

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const RecipeInfoForm = ({ navigation }) => {
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [recipeHours, setRecipeHours] = useState();
  const [recipeMinutes, setRecipeMinutes] = useState();
  const [recipeLevel, setRecipeLevel] = useState('Easy');
  const [recipeImage, setRecipeImage] = useState(null);
  const [recipeTags, setRecipeTags] = useState()

  const [selectedCuisineType, setSelectedCuisineType] = useState(null);
  const [searchCuisineTypeQuery, setSearchCuisineTypeQuery] = useState('');
  const [filteredCuisineTypes, setFilteredCuisineTypes] = useState(cuisineTypes);
  const [isCuisineTypePickerModalVisible, setIsCuisineTypePickerModalVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchCategoryQuery, setSearchCategoryQuery] = useState('');
  const [filteredCategory, setFilteredCategory] = useState(categories);
  const [isCategoryPickerModalVisible, setIsCategoryPickerModalVisible] = useState(false);

  // const [recipeID, setRecipeID] = useState('');


  (async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access media library denied');
    }
  })();

  const handleGalleryClick = async () => {
    console.log("Gallery clicked");
    try {
      const cameraResp = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0];
        const fileName = uri.split("/").pop();
        // const data = `data:${fileName.mime};base64,${fileName.data}`;

        console.log(uri);
        setRecipeImage(uri)

      }
    } catch (e) {
      alert("Error Uploading Image " + e.message);
    }
  };

  const fetchToken = async () => {
    console.log("Fetching token...");
    try {
      const storedToken = await AsyncStorage.getItem('TOKEN');
      return storedToken;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };

  const saveRecipe = async () => {
    try {
      console.log("Displayin");
      const token = await fetchToken();
      const decodedToken = jwtDecode(token);
      const userID = decodedToken._id;

      // const formData = new FormData();
      // formData.append('title', recipeTitle);
      // formData.append('description', recipeDescription);
      // formData.append('durationHours', recipeHours);
      // formData.append('durationMinutes', recipeMinutes);
      // formData.append('level', recipeLevel);
      // formData.append('image', recipeImage);
      // formData.append('cuisineType', selectedCuisineType);
      // formData.append('category', selectedCategory);
      // formData.append('user', userID)

      // console.log("FORMDATA",formData);

      axios.post(`http:${IP_ADDRESS}:3001/createRecipe`, {
        title: recipeTitle,
        description: recipeDescription,
        durationHours: recipeHours,
        durationMinutes: recipeMinutes,
        level: recipeLevel,
        image: recipeImage,
        cuisineType: selectedCuisineType,
        category: selectedCategory,
        isOwnRecipe: true,
        user: userID
      }).then(response => {
        // setRecipeID(response.data._id)
        navigation.navigate('Add recipe ingredients', { recipeID: response.data._id });
        console.log(response.data._id);
      }).catch(error => {
        console.log(error.response);
      })


    } catch (error) {
      console.log("save recipe error", error.message);
    }

  }


  const handleSearchCuisineType = (query) => {
    console.log("handleSearchCuisineType");
    setSearchCuisineTypeQuery(query);
    const filtered = cuisineTypes.filter((type) =>
      type.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCuisineTypes(filtered);
  };

  const handleSearchCategory = (query) => {
    console.log("handleSearchCategory");
    setSearchCategoryQuery(query);
    const filtered = categories.filter((type) =>
      type.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategory(filtered);
  };

  const handlePickerCuisineTypeItemPress = (item) => {
    console.log("handlePickerCuisineTypeItemPress");
    setSelectedCuisineType(item);
    setIsCuisineTypePickerModalVisible(false);
  };

  const handlePickerCategoryItemPress = (item) => {
    console.log("handlePickerCategoryItemPress");
    setSelectedCategory(item);
    setIsCategoryPickerModalVisible(false);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Recipe Name:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter recipe name"
          value={recipeTitle}
          onChangeText={(text) => setRecipeTitle(text)}
        />

        <Text style={styles.text}>Recipe description:</Text>
        <TextInput
          style={styles.textInput}
          value={recipeDescription}
          onChangeText={(text) => setRecipeDescription(text)}
          multiline={true}
          numberOfLines={3}
        />
        <Text style={styles.text}>Recipe duration:</Text>
        <View style={styles.durationView}>
          <TextInput
            keyboardType='numeric'
            maxLength={2}
            placeholder='0'
            value={recipeHours}
            style={styles.durationInput}
            onChangeText={(text) => {
              setRecipeHours(text)
            }} />
          <Text>H</Text>
          <Text>   :</Text>
          <TextInput
            keyboardType='numeric'
            maxLength={2}
            placeholder='0'
            value={recipeMinutes}
            style={styles.durationInput}
            onChangeText={(text) => {
              setRecipeMinutes(text)
            }}
          />
          <Text>M</Text>
        </View>

        <Text style={styles.text}>Level:</Text>
        <Picker
          selectedValue={recipeLevel}
          onValueChange={(itemValue, itemIndex) =>
            setRecipeLevel(itemValue)
          }
          style={{ backgroundColor: '#fff', borderRadius: 0, margin: 10 }}>
          <Picker.Item label="Easy" value="Easy" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Hard" value="Hard" />
        </Picker>

        <Text style={styles.text}>Recipe image:</Text>
        <View>
          {/* {recipeImage !== "" &&
          <Image source={{ uri: recipeImage }} style={{ width: 300, height: 300 }} />} */}
          <Button title="Pick Image" onPress={handleGalleryClick} />
        </View>

        <Text style={styles.text}>Select Cuisine Type:</Text>
        <TouchableOpacity onPress={() => setIsCuisineTypePickerModalVisible(true)}>
          <View style={styles.pickerContainer}>
            <Text>{selectedCuisineType || 'Select cuisine type'}</Text>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isCuisineTypePickerModalVisible}
          onRequestClose={() => setIsCuisineTypePickerModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchCuisineTypeQuery}
              onChangeText={handleSearchCuisineType}
            />

            <FlatList
              style={styles.flatList}
              data={filteredCuisineTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePickerCuisineTypeItemPress(item)}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity onPress={() => setIsCuisineTypePickerModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Text style={styles.text}>Select Category:</Text>
        <TouchableOpacity onPress={() => setIsCategoryPickerModalVisible(true)}>
          <View style={styles.pickerContainer}>
            <Text>{selectedCategory || 'Select category'}</Text>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isCategoryPickerModalVisible}
          onRequestClose={() => setIsCategoryPickerModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchCategoryQuery}
              onChangeText={handleSearchCategory}
            />

            <FlatList
              style={styles.flatList}
              data={filteredCategory}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePickerCategoryItemPress(item)}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity onPress={() => setIsCategoryPickerModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>


        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => { navigation.goBack(); }}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { saveRecipe() }}>
            <Text style={styles.saveButton}>Next</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff'
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
    padding: 12,
  },
  text: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  durationInput: {
    borderColor: '#D3D3D3',
    backgroundColor: '#F6F6F6',
    width: 50,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 15,
    borderRadius: 20,
    padding: 7,
    margin: 10,
    textAlign: 'center',
  },
  durationView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 100,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  flatList: {
    marginBottom: 10,
  },
  itemText: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  closeButton: {
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: 'red',
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#800e13',
    top: 10,
    width: 100,
    padding: 8,
    alignSelf: 'flex-end',
    borderRadius: 25,
    textAlign: 'center',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#fff',
    top: 10,
    width: 100,
    padding: 8,
    alignSelf: 'flex-start',
    borderRadius: 25,
    textAlign: 'center',
    color: '#800e13',
  },
});

export default RecipeInfoForm;