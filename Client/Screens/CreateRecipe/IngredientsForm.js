import { View, Text, StyleSheet, TextInput, Button, Platform, FlatList, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import IngredientsUnits from './Units'
import { Picker } from '@react-native-picker/picker';
import IngredientQuantities from './IngredientsQuantity'
import axios from 'axios';
import { IP_ADDRESS } from '@env'


export default function IngredientsForm({ navigation, route }) {

    const recipeID = route.params.recipeID
    const isToCreate = route.params.isToCreate

    const apiKey = "8f3fa11090d045108b8323a310b231fe"

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('tablespoon');
    const [optional, setOptional] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [ingredients, setIngredients] = useState([
        { id: '1', name: '', quantity: '', unit: 'tablespoon', optional: false }
    ]);

    const addIngredientField = () => {
        setIngredients([...ingredients, { id: String(ingredients.length + 1), name: '', quantity: '', unit: 'tablespoon', optional: false }]);
    };

    const updateIngredient = (index, property, value) => {
        const updatedIngredients = ingredients.map((ingredient, i) => {
            if (i === index) {
                return { ...ingredient, [property]: value };
            }
            return ingredient;
        });
        setIngredients(updatedIngredients);
    };

    const deleteIngredientField = (id) => {
        const updatedIngredients = ingredients.filter((ingredient) => ingredient.id !== id);
        setIngredients(updatedIngredients);
    };

    // const addIngredientField = () => {
    //     const newIngredient = { id: String(ingredients.length + 1), name: '', quantity: '', unit: 'tablespoon', optional: false };
    //     setIngredients([...ingredients, newIngredient]);
    //   };

    //   const updateIngredient = (index, property, value) => {
    //     const updatedIngredients = [...ingredients];
    //     updatedIngredients[index] = { ...updatedIngredients[index], [property]: value };
    //     setIngredients(updatedIngredients);
    //   };

    const searchIngredients = async () => {
        try {
            console.log("search");
            const response = await axios.get(`https://api.spoonacular.com/food/ingredients/search?query=${searchQuery}&number=10&apiKey=${apiKey}`);
            setSearchResults(response.data.results);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };



    const saveIngredients = async () => {
        //   console.log("instructions");
        for (const ingredient of ingredients) {
            // Destructure the ingredient object
            const { name, quantity, unit, optional } = ingredient;
            await axios.post(`http://${IP_ADDRESS}:3001/addIngredient`, {
                name, quantity, unit, recipeID
            }).then((response) => {
                console.log("responseeeee", response.data);
                if (isToCreate) {
                    navigation.navigate('Add recipe instructions', { recipeID: recipeID })
                }else{
                    navigation.navigate('Recipe details', { recipeID: recipeID })
                }
            }).catch((error) => {
                console.log({ name, quantity, unit, recipeID });
                console.log("ERRORRRRR", error);
            })

            // setIngredients([{ id: '1', name: '', quantity: '', unit: 'tablespoon', optional: false }]);
        }
    }


    return (
        <View style={styles.container}>
            <Button title='Add ingredient field' onPress={addIngredientField}></Button>
            <FlatList
                style={{ width: hp('45%'), height: hp('50%') }}
                data={ingredients}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={styles.ingredientContainer}>
                        {/* <View style={styles.inputContainer}>
                            <Text style={{ width: hp('7.7%') }}>Name:</Text>
                            <TextInput
                                placeholder="Ingredient"
                                style={styles.textInput}
                                onChangeText={(text) => updateIngredient(index, 'name', text)}
                            />
                            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                        </View> */}

                        {item.name !== "" ? (
                            <View>
                                <Text>{item.name}</Text>
                                <Button
                                    title="Delete this ingredient"
                                    onPress={() => deleteIngredientField(item.id)}
                                />
                            </View>
                        ) : (
                            <View>
                                <TextInput
                                    placeholder="Search ingredient"
                                    style={styles.textInput}
                                    onChangeText={(text) => setSearchQuery(text)}
                                    defaultValue={item.name}

                                />
                                <Button title="Search" onPress={searchIngredients} />
                            </View>
                        )}


                        {/* Modal for displaying search results */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showModal}
                            onRequestClose={() => setShowModal(false)}
                        >
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Search Results</Text>
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <Pressable
                                            onPress={() => {
                                                updateIngredient(index, 'name', item.name);
                                                setShowModal(false);
                                            }}
                                            style={styles.modalItem}
                                        >
                                            <Text style={styles.modalItemText}>{item.name}</Text>
                                            {/* You can add an icon or any other content on the right side if needed */}
                                        </Pressable>
                                    )}
                                />
                                <Button title="Close" onPress={() => setShowModal(false)} style={styles.closeButton} />
                            </View>
                        </Modal>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerText}>Quantity:</Text>
                            <Picker
                                selectedValue={item.quantity}
                                onValueChange={(itemValue) => updateIngredient(index, 'quantity', itemValue)}
                                style={styles.picker}
                            >
                                {IngredientQuantities.map((quantity, index) => (
                                    <Picker.Item key={index} label={quantity} value={quantity} />
                                ))}
                            </Picker>
                            {/* {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null} */}

                            <Text style={styles.pickerText}>Unit:</Text>
                            <Picker
                                selectedValue={item.unit}
                                onValueChange={(itemValue) => updateIngredient(index, 'unit', itemValue)}
                                style={styles.picker}
                            >
                                {IngredientsUnits.map((unit, index) => (
                                    <Picker.Item key={index} label={unit} value={unit} />
                                ))}
                            </Picker>
                            {/* {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null} */}
                        </View>
                        {/* <View style={styles.inputContainer}>
                    <Text style={{ width: hp('7.7%') }}>Optional:</Text>
                    <TextInput
                        placeholder="Optional"
                        style={styles.textInput}
                        onChangeText={text => setOptional(text)} />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View> */}
                    </View>
                )}
            />
            <Button title="Save Ingredients" onPress={saveIngredients} />
            <Button title="cancel" onPress={()=>{navigation.goBack()}} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('7%'),
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    textInput: {
        borderColor: '#D3D3D3',
        backgroundColor: '#F6F6F6',
        width: hp('40%'),
        borderWidth: hp('0.1%'),
        borderStyle: 'solid',
        fontSize: hp('1.7%'),
        borderRadius: hp('2%'),
        marginTop: hp('0.5%'),
        padding: hp('1.3%'),
        alignSelf: 'center',
    },
    picker: {
        width: hp('13%'),
        backgroundColor: '#F6F6F6',
        borderRadius: hp('2%'),
        borderWidth: hp('0.1%'),
        borderColor: '#D3D3D3',
        alignSelf: 'center',
        margin: hp('1%'),
        top: hp('1%'),
        borderRadius: hp('2%'),
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Center the pickers vertically
        alignItems: 'center', // Center the pickers horizontally
    },
    pickerText: {
        top: hp('1%'),
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    inputContainer: {
        // flexDirection: 'row', // Set direction to column
        // alignItems: 'center',
        // marginBottom: 15, // Optional: Add some margin between input fields
    },
    ingredientContainer: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: hp('0.1%'),
        borderStyle: 'solid',
        alignSelf: 'center',
        width: hp('45%'),
        borderRadius: hp('3%'),
        elevation: hp('0.5'),
        padding: hp('1%'),
        margin: hp('1%'),
        // backgroundColor: Platform.OS === 'ios' ? '#fff' : null,
        // borderColor: '#ddd',
        // shadowColor: Platform.OS === 'ios' ? 'green' : '#fff',
        // shadowOffset: {
        //   width: Platform.OS === 'ios' ? 3 : 0,
        //   height: Platform.OS === 'ios' ? 3 : 2,
        // },
        // shadowOpacity: Platform.OS === 'ios' ? 1 : 0.8,
        // shadowRadius: Platform.OS === 'ios' ? null : 40,
        // elevation: Platform.OS === 'ios' ? null : 4,
    },
    modalContainer: {
        backgroundColor: 'white',
        marginTop: hp('25%'), // Adjust the marginTop to center the modal vertically
        padding: hp('2%'), // Add padding to the modal content
        borderRadius: hp('3%'), // Add borderRadius for rounded corners
        elevation: hp('2'), // Add elevation for a shadow effect
    },

    modalTitle: {
        fontSize: hp('2%'), // Set the font size for the modal title
        fontWeight: 'bold',
        marginBottom: hp('2%'), // Add margin bottom to separate title from items
    },

    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp('1%'), // Add padding for vertical spacing
        borderBottomWidth: hp('0.1%'), // Add a border at the bottom of each item
        borderBottomColor: '#ddd', // Set the border color
    },

    modalItemText: {
        fontSize: hp('1.8%'), // Set the font size for modal item text
    },

    closeButton: {
        marginTop: hp('2%'), // Add margin top to separate items from close button
    },
})