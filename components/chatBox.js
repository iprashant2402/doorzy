import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput,Alert,Platform } from "react-native";
import { Button, Icon, Card } from "react-native-elements";
import { colors } from "../colors/colors";
import {
  TouchableHighlight,
  TouchableOpacity
} from "react-native-gesture-handler";
import firebase from "firebase";
import "firebase/firestore";
import { inject, observer } from "mobx-react/native";
const messageId = require('uuid/v4');

if (Platform.OS !== "web") {
    window = undefined;
  }

@inject('mainStore')  
@observer
export default class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  sendMessage = async () => {
      if(this.state.message.trim()!==""){
        console.log("CALLED sendMessage")
          const db = firebase.firestore();
          const mid = messageId();
          const thisRef = this;
          const messagesRef = db.collection('chat').doc(this.props.mainStore.uid).collection('messages').doc(mid);
          const message = {
              content : this.state.message,
              id : mid,
              timestamp : + new Date(),
              active : true,
              sender : "user"
          };
          console.log(message);
          messagesRef.set(message).then(function(){
              thisRef.setState({
                  message : ""
              });
              Alert.alert("We have recieved your message and are looking into the matter. We will get back to you as soon as possible. Sorry for any inconvenience caused.");
          }).catch(err=>console.log(err));
          fetch('https://powerful-wave-93367.herokuapp.com/newMessageNotification');
      }
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
        <TextInput 
        value={this.state.message} 
        placeholder="Please tell us your concern."
        style={styles.chatInput}
        onChangeText={(text)=>this.setState({message:text})}
        />
        </View>
        <View style={styles.btnWrapper}>
            <Button type="solid" title="SUBMIT" onPress={()=>this.sendMessage()} buttonStyle={styles.btn} icon={<Icon name="send" type="feather" color={colors.white}/>} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
container : {
    flex : 1,
    backgroundColor : colors.white
},
inputWrapper : {
    paddingVertical : 5,
    paddingHorizontal : 20
},
btnWrapper : {
    paddingVertical : 5,
    paddingHorizontal : 20
},
btn : {
    borderRadius : 0,
    backgroundColor : colors.successButton,
    height : 50
},
chatInput : {
    padding : 10,
    height : 60,
    borderWidth : 1,
    borderColor : colors.greyBorder
}
});