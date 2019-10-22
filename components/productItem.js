import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card,} from "react-native-elements";
import {colors} from '../colors/colors';
import removeAddress from '../util/removeAddress';
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

export default function ProductItem(props) {

    return (
      <Card style={styles.container}>
        <View style={styles.leftWrapper}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{props.product.brand} {props.product.name}</Text>
        </View>
        <Text style={styles.text1}>Quantity : <Text style={styles.quantity}>{props.product.quantity}</Text></Text>
        </View>
        <View style={styles.rightWrapper}>
          <Button title="Remove" type="outline" buttonStyle={styles.btn} titleStyle={styles.btnTitle} onPress={()=>props.removeItem(props.product.id)}/>           
        </View>
      </Card>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop : 20,
    flexDirection : 'row'
  },
  rightWrapper : {
    flex : 1
  },
  leftWrapper : {
    flex : 3
  },
  btn : {
    borderColor : colors.danger,
    borderWidth : 1
  },
  btnTitle : {
    color : colors.danger
  },
  titleWrapper : {
    marginBottom : 5
  },
  title : {
      fontSize : 15,
      color : colors.primary,
      fontFamily : 'Rubik-Bold',
  },
  text1 : {
      fontSize : 15,
      margin : 1,
      color : colors.text
  },
  btnTitle : {
      color : colors.danger,
      textAlign : 'left',
      fontFamily : 'Rubik-Bold'
  },
  btn : {
      marginTop : 5
  },
  quantity : {
      color : colors.brandPrimary,
      fontFamily : 'Rubik-Bold'
  }
  
});