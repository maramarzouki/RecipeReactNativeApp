import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function InstructionsForm({ navigation, route }) {
  
  const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS

  const recipeID = route.params.recipeID
  const isToCreate = route.params.isToCreate

  const [instructionFields, setInstructionFields] = useState([{ number: 1, details: '' }]);

  const addInstructionField = () => {
    setInstructionFields([...instructionFields, { number: instructionFields.length + 1, details: '' }]);
  };

  const saveInstructions = async () => {
    for (const instruction of instructionFields) {
      const { number, details } = instruction;
      const num = parseInt(number, 10)
      await axios.post(`http://${IP_ADDRESS}:3001/addInstruction`, {
        stepNum: num, stepDesc: details, recipeID
      }).then((response) => {
        if (isToCreate) {
          ToastAndroid.show('Recipe created successfully!', ToastAndroid.SHORT)
          navigation.navigate('Profile')
        } else {
          navigation.navigate('Recipe details', { recipeID: recipeID })
        }
      }).catch((error) => {
        console.log({ num, details, recipeID });
        console.log("ERRORRRRR", error);
      })
    }
  }

  const removeInstructionField = (index) => {
    const newFields = instructionFields.filter((_, idx) => idx !== index)
    newFields.forEach((field, idx) => field.number = idx + 1)
    setInstructionFields(newFields);
  };

  return (
    <View style={styles.container}>
      <View style={{  }}>
        {/* <Text style={styles.pageTitle}>Add new instruction:</Text> */}
        <TouchableOpacity style={styles.addInstruction} onPress={addInstructionField}>
          <Text style={styles.buttonText}>Add new instruction</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {instructionFields.map((field, index) => (
          <View key={index} style={styles.instructionField}>
            <View style={styles.instructionNumberView}>
              <Text style={{ fontSize: hp(1.8), fontWeight: 'bold' }}>Instruction number: {field.number}</Text>
              <TouchableOpacity onPress={() => { removeInstructionField(index) }}>
                <FontAwesomeIcon icon={faXmark} color='#fff' style={styles.xmarkIcon} />
              </TouchableOpacity>
            </View>
            <Text style={{ top: hp('1%'), left: hp('1.5%'), fontSize: hp('1.8%'), fontWeight: 'bold' }}>Instruction details:</Text>
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
      <TouchableOpacity style={styles.saveButton} onPress={saveInstructions}>
        <Text style={styles.buttonText}>Save Instructions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => { navigation.goBack() }}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    top: hp('1%'),
    paddingLeft: hp('1.5%'),
    paddingRight: hp('1.5%')
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
    width: hp(20),
    backgroundColor: "#800e13",
    borderRadius: hp(1),
    padding: hp('1%'),
    right: hp('1%'),
    alignSelf: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#800e13',
    fontWeight: 'bold',
    marginLeft: hp('1%'),
    alignSelf:'flex-end'
  },
  saveButton: {
    backgroundColor: '#800e13',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: hp('3%'),
    borderRadius: hp('2%'),
    marginVertical: hp('1%'),
    alignItems: 'center',
    alignSelf: 'center',
  },
  cancelButton: {
    backgroundColor: '#800e13',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: hp('3%'),
    borderRadius: hp('2%'),
    marginVertical: hp('1%'),
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
  xmarkIcon: {
    backgroundColor: "#800e13",
    padding: hp(1),
    borderRadius: hp(2),
  },
})




// import { View, Text, StyleSheet, TextInput, Button, TouchableHighlight, ScrollView, ToastAndroid } from 'react-native'
// import React, { useState } from 'react'
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import axios from 'axios';

// export default function InstructionsForm({ navigation, route }) {
  
//   const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS

//   const recipeID = route.params.recipeID
//   const isToCreate = route.params.isToCreate

//   const [instructionFields, setInstructionFields] = useState([{ number: '', details: '' }]);


//   const addInstructionField = () => {
//     console.log("addInstructionField");
//     setInstructionFields([...instructionFields, { number: '', details: '' }]);
//   };

//   const saveInstructions = async () => {
//     for (const instruction of instructionFields) {
//       console.log("instructions");
//       // Destructure the ingredient object
//       const { number, details } = instruction;
//       console.log(number, details);
//       const num = parseInt(number, 10)
//       await axios.post(`http://${IP_ADDRESS}:3001/addInstruction`, {
//         stepNum: num, stepDesc: details, recipeID
//       }).then((response) => {
//         console.log("responseeeee", response.data);
//         if (isToCreate) {
//           ToastAndroid.show('Recipe created successfully!', ToastAndroid.SHORT)
//           navigation.navigate('Profile')
//         } else {
//           navigation.navigate('Recipe details', { recipeID: recipeID })
//         }
//       }).catch((error) => {
//         console.log({ num, details, recipeID });
//         console.log("ERRORRRRR", error);
//       })

//     }
//   }

//   const removeInstructionField = (index) => {
//     console.log("removeInstructionField");
//     const newFields = [...instructionFields];
//     newFields.splice(index, 1);
//     setInstructionFields(newFields);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={{ flexDirection: 'row', }}>
//         <Text style={styles.pageTitle}>Add new instruction:</Text>
//         <TouchableHighlight
//           style={styles.addInstruction}
//           onPress={addInstructionField}
//         >
//           <Text>Add</Text>
//         </TouchableHighlight>
//       </View>

//       <ScrollView>
//         {instructionFields.map((field, index) => (
//           <View key={index} style={styles.instructionField}>
//             <View style={styles.instructionNumberView}>
//               <Text style={{ fontSize: hp(1.8), fontWeight: 'bold' }}>Instruction number:</Text>
//               <TextInput
//                 keyboardType='numeric'
//                 style={styles.numberInput}
//                 placeholder='0'
//                 textAlign='center'
//                 value={field.number}
//                 onChangeText={(text) => {
//                   const newFields = [...instructionFields];
//                   newFields[index].number = text;
//                   setInstructionFields(newFields);
//                 }}
//               />
//               <TouchableHighlight onPress={() => { removeInstructionField(index) }}>
//                 <Text>X</Text>
//               </TouchableHighlight>
//             </View>
//             <Text style={{ top: hp('1%'), left: hp('1.5'), fontSize: hp('1.8'), fontWeight: 'bold' }}>Instruction details:</Text>
//             <TextInput
//               multiline={true}
//               numberOfLines={5}
//               style={styles.instructionDesc}
//               value={field.details}
//               onChangeText={(text) => {
//                 const newFields = [...instructionFields];
//                 newFields[index].details = text;
//                 setInstructionFields(newFields);
//               }}
//             />
//           </View>
//         ))}
//       </ScrollView>
//       <Button title='Save instructions' onPress={saveInstructions}></Button>
//       <Button title="cancel" onPress={() => { navigation.goBack() }} />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: hp('8%'),
//     flex: 1,
//   },
//   pageTitle: {
//     fontSize: hp('2%'),
//     left: hp('2%'),
//   },
//   instructionNumberView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     top: hp('1%'),
//     paddingLeft: hp('1.5%')
//   },
//   numberInput: {
//     width: hp('6%'),
//     borderColor: '#D3D3D3',
//     backgroundColor: '#F6F6F6',
//     borderWidth: hp('0.1%'),
//     borderStyle: 'solid',
//     fontSize: hp('1.7%'),
//     borderRadius: hp('2%'),
//     padding: hp('1%'),
//     left: hp('1%')
//   },
//   instructionDesc: {
//     width: hp('40%'),
//     borderColor: '#D3D3D3',
//     backgroundColor: '#F6F6F6',
//     borderWidth: hp('0.1%'),
//     borderStyle: 'solid',
//     fontSize: hp('1.7%'),
//     borderRadius: hp('2%'),
//     top: hp('2%'),
//     left: hp('1.5%'),
//   },
//   instructionField: {
//     backgroundColor: '#fff',
//     borderColor: '#ddd',
//     borderWidth: hp('0.1%'),
//     borderStyle: 'solid',
//     alignSelf: 'center',
//     width: hp('45%'),
//     height: hp('23%'),
//     borderRadius: hp('3%'),
//     elevation: hp('0.5'),
//     padding: hp('1%'),
//     margin: hp('1%'),
//   },
//   addInstruction: {
//     width: hp(5),
//     backgroundColor: "#fff",
//     borderRadius: hp(1),
//     padding: hp('1%'),
//     right: hp('1%'),
//     alignSelf: 'flex-end'
//   }
// })