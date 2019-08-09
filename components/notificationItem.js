import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button,} from "react-native-elements";
import {colors} from '../colors/colors';
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

export default function NotificationItem(props) {

    return (
      <View style={props.disabled ? styles.disabled : styles.active}>
        <View style={styles.titleWrapper}>
            <Text style={styles.title}>{props.title}</Text>
        </View>
        <View style={styles.contentWrapper}>
            <Text style={styles.content}>{props.content}</Text>
        </View>
        <View style={styles.timeWrapper}>
            <Text style={styles.time}>{props.time}</Text>
        </View>
      </View>
    );
  
}

const styles = StyleSheet.create({
  active: {
    flex: 1,
    padding : 23,
    backgroundColor : colors.white
  },
  disabled: {
    flex: 1,
    padding : 23,
    backgroundColor : colors.greyBackground
  },
  titleWrapper : {
    marginBottom : 5
  },
  title : {
      fontSize : 15,
      color : colors.primary,
      fontWeight : 'bold',
      fontFamily : 'Rubik-Regular'
  },
  contentWrapper : {
    marginBottom : 5
  },
  content : {
      fontSize : 15,
      margin : 1,
      color : colors.text,
      fontFamily : 'Rubik-Regular'
  },
  timeWrapper : {

  },
  time : {
    fontSize : 12,
    fontFamily : 'Rubik-Regular',
    color : colors.text
  }
  
  
});
