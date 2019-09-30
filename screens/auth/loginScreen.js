/*
This View is responsible for signing in user via OTP
*/

import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Keyboard, Platform
} from "react-native";
import { Linking, WebBrowser } from "expo";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { colors } from "../../colors/colors";
import FullWidthImage from 'react-native-fullwidth-image';
import { Input,Button } from 'react-native-elements';
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


if (Platform.OS !== "web") {
  window = undefined;
}

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inviteCode : '',
      error : '',
      loading : false
    }
  }

  signIn = () => {
    this.setState({loading:true});
    firebase.auth().signInAnonymously().then(()=>{
      this.setState({loading:false});
    }).catch(err=>console.log(err));
  }

  logIn = () => {
    this.setState({loading:true});
    const db = firebase.firestore();
    const inviteCode = this.state.inviteCode.trim();
    const thisRef = this;
    db.collection('inviteCodes').where("code","==",inviteCode).get().then(function(snap){
      var inviteCodesArray = [];
      snap.forEach(code=>{
        inviteCodesArray.push(code.data().code);
      });
      if(inviteCodesArray.includes(inviteCode)){
        thisRef.signIn();
      }
      else{
        thisRef.setState({
          error : "Sorry, you need an invite code to register.",
          loading : false
        });
      }

    });
  }

  render() {
     return (
       
        <View style={styles.body}>
          <View style={styles.logoContainer}>
          <FullWidthImage source={require('../../assets/images/header-logo.png')} ratio={1/3}/>
          </View>
          <View style={styles.masterFormContainer}>
          <FullWidthImage source={require('../../assets/images/login_page_graphic.png')} ratio={3/3}/>
          {/*<View style={styles.formContainer&&styles.textWrapper}>
            <Text style={styles.text1}>
              We want to provide best service to our customers and in order to do so we are currently accepting invite based login only.
              You must have an invite code to sign in.
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={{color:colors.white,textAlign : 'center'}}>Enter your friend's invite code</Text>
          </View>
        
          {/*<View style={styles.formContainer}>
            <TextInput style={styles.textInput} placeholder="INVITE CODE" value={this.state.inviteCode} onChangeText={(text)=>{this.setState({
              inviteCode : text
            })}}/>
          </View>*/}
          
          {/*<View style={styles.formContainer}>
            <Text style={{color:colors.danger}}>{this.state.error}</Text>
        </View>*/}
          </View>
          <View style={styles.btnWrapper}> 
          <Button buttonStyle={styles.btn} disabled={this.state.loading} loading={this.state.loading} type='solid' raised={false} onPress={()=>this.signIn()} title="NEXT"/>
          </View>
        </View>
        
      );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 0,
    backgroundColor: colors.brandPrimary,
    //justifyContent : 'center'
  },
  masterFormContainer : {
    flex : 3
  },
  textWrapper : {
    backgroundColor : colors.primarySupport,
    padding : 23
  },
  text1 : {
    fontFamily : 'Rubik-Regular',
    fontSize : 16,
    color : colors.white
  },
  formContainer: {
    paddingHorizontal : 23,
    marginTop : 20
  },
  logoSecondary : {
    color : colors.brandSecondary,
    fontWeight : 'bold'
  },
  logoContainer : {
    marginTop : 50,
    marginBottom : 20,
    flex : 1
  },
  btnWrapper : {
      paddingHorizontal : 23,
    //  paddingHorizontal : 50
    flex : 1
  },
  btn : {
      backgroundColor : '#ffcc00',
      height : 50,
      borderRadius : 0       
  },
  textInput : {
      height : 50,
      backgroundColor : colors.primarySupport,
      padding : 10,
      color : colors.white
  },
  subHeading : {
      fontFamily : 'Rubik-Regular',
      color : colors.white,
      fontSize : 20,
      textAlign : 'center'
  },
  subHeadingWrapper : {
      textAlign : 'center',
      marginTop : 50
  }
});
