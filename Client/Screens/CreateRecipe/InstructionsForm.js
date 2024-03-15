import { View, Text, StyleSheet, TextInput, Button, TouchableHighlight, ScrollView, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { IP_ADDRESS } from '@env'

export default function InstructionsForm({ navigation, route }) {

  const recipeID = route.params.recipeID

  const [instructionFields, setInstructionFields] = useState([{ number: '', details: '' }]);


  const addInstructionField = () => {
    setInstructionFields([...instructionFields, { number: '', details: '' }]);
  };

  const saveInstructions = async () => {
    for (const instruction of instructionFields) {
      // console.log("instructions");
      // Destructure the ingredient object
      const { number, details } = instruction;
      console.log(number, details);
      const num = parseInt(number, 10)
      await axios.post(`http://${IP_ADDRESS}:3001/addInstruction`, {
        stepNum: num, stepDesc: details, recipeID
      }).then((response) => {
          console.log("responseeeee", response.data);
          navigation.navigate('Profile')
          ToastAndroid.show('Recipe created successfully!', ToastAndroid.SHORT)
      }).catch((error) => {
          console.log({ num, details, recipeID });
          console.log("ERRORRRRR", error);
      })

    }
  }

  const removeInstructionField = (index) => {
    const newFields = [...instructionFields];
    newFields.splice(index, 1);
    setInstructionFields(newFields);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', }}>
        <Text style={styles.pageTitle}>Add new instruction:</Text>
        <TouchableHighlight
          style={styles.addInstruction}
          onPress={addInstructionField}
        >
          <Text>Add</Text>
        </TouchableHighlight>
      </View>

      <ScrollView>
        {instructionFields.map((field, index) => (
          <View key={index} style={styles.instructionField}>
            <View style={styles.instructionNumberView}>
              <Text style={{ fontSize: hp(1.8), fontWeight: 'bold' }}>Instruction number:</Text>
              <TextInput
                keyboardType='numeric'
                style={styles.numberInput}
                placeholder='0'
                textAlign='center'
                value={field.number}
                onChangeText={(text) => {
                  const newFields = [...instructionFields];
                  newFields[index].number = text;
                  setInstructionFields(newFields);
                }}
              />
              <TouchableHighlight onPress={()=>{removeInstructionField(index)}}>
                <Text>X</Text>
              </TouchableHighlight>
            </View>
            <Text style={{ top: hp('1%'), left: hp('1.5'), fontSize: hp('1.8'), fontWeight: 'bold' }}>Instruction details:</Text>
            <TextInput
              multiline={true}
              numberOfLines={5}
              style={styles.instructionDesc}
              value={field.details}
              onChangeText={(text) => {
                const newFields = [...instructionFields];
                newFields[index].details = text;
                setInstructionFields(newFields);
              }}
            />
          </View>
        ))}
      </ScrollView>
      <Button title='Save instructions' onPress={saveInstructions}></Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: hp('8%'),
    flex: 1,
  },
  pageTitle: {
    fontSize: hp('2%'),
    left: hp('2%'),
  },
  instructionNumberView: {
    flexDirection: 'row',
    alignItems: 'center',
    top: hp('1%'),
    paddingLeft: hp('1.5%')
  },
  numberInput: {
    width: hp('6%'),
    borderColor: '#D3D3D3',
    backgroundColor: '#F6F6F6',
    borderWidth: hp('0.1%'),
    borderStyle: 'solid',
    fontSize: hp('1.7%'),
    borderRadius: hp('2%'),
    padding: hp('1%'),
    left: hp('1%')
  },
  instructionDesc: {
    width: hp('40%'),
    borderColor: '#D3D3D3',
    backgroundColor: '#F6F6F6',
    borderWidth: hp('0.1%'),
    borderStyle: 'solid',
    fontSize: hp('1.7%'),
    borderRadius: hp('2%'),
    top: hp('2%'),
    left: hp('1.5%'),
  },
  instructionField: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: hp('0.1%'),
    borderStyle: 'solid',
    alignSelf: 'center',
    width: hp('45%'),
    height: hp('23%'),
    borderRadius: hp('3%'),
    elevation: hp('0.5'),
    padding: hp('1%'),
    margin: hp('1%'),
  },
  addInstruction: {
    width: hp(5),
    backgroundColor: "#fff",
    borderRadius: hp(1),
    padding: hp('1%'),
    right: hp('1%'),
    alignSelf: 'flex-end'
  }
})