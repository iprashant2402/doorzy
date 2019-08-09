import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button,} from "react-native-elements";
import {colors} from '../colors/colors';
import removeAddress from '../util/removeAddress';
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

export default function AddressItem(props) {

    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{props.address.label.toUpperCase()}</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.text1}>{props.address.addLine1}</Text>
          <Text style={styles.text1}>{props.address.addLine2}</Text>
          <Text style={styles.text1}>{props.address.landmark}</Text>
          
          <TouchableOpacity style={styles.btn} onPress={()=>removeAddress(props.address.id,props.uid,props.addressArray)}>
              <Text style={styles.btnTitle}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop : 20
  },
  titleWrapper : {
    marginBottom : 5
  },
  title : {
      fontSize : 16,
      color : colors.primary,
      fontWeight : 'bold'
  },
  text1 : {
      fontSize : 16,
      margin : 1,
      color : colors.text
  },
  btnTitle : {
      color : colors.danger,
      textAlign : 'left',
      fontWeight : 'bold'
  },
  btn : {
      marginTop : 5
  }
  
});
