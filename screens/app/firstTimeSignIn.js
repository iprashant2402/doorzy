/*
This View is responsible for displaying form to take user inputs for placing order 
e.g. what product? which brand? quantity? ....
*/

import React, { Component } from "react";
import { View, ScrollView, Text, Platform, StyleSheet } from "react-native";
import { inject, observer } from "mobx-react/native";
import firebase from "firebase";
import "firebase/firestore";
import FullWidthImage from "react-native-fullwidth-image";
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator
} from "react-navigation";
import { colors } from "../../colors/colors";
import { TextInput } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import generateInviteCode from '../../util/generateInviteCode';
import registerForPushNotificationsAsync from '../../util/registerPushNotification';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const notifId = require('uuid/v4');

if (Platform.OS !== "web") {
  window = undefined;
}

@inject("mainStore")
@observer
class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      phone: "",
      error: "",
      loading : false
    };
  }

  validate = (fname, lname, phone) => {
    if (fname == "" || lname == "" || phone == "") {
      this.setState({
        error: "One or more fields left blank."
      });
      return false;
    }
    var nameReg = /^[a-zA-Z ]{2,30}$/;
    var phoneReg = /^\d{10}$/;
    if (!nameReg.test(fname)) {
      this.setState({
        error: "Enter a valid First Name"
      });
      return false;
    }
    if (!nameReg.test(lname)) {
      this.setState({
        error: "Enter a valid Last Name"
      });
      return false;
    }
    if (!phoneReg.test(phone)) {
      this.setState({
        error: "Enter a valid 10-digit phone number."
      });
      return false;
    }else {
      this.setState({error:''});
      return true;
    }
  };

   onSubmit = async () => {
    if (this.validate(this.state.fname, this.state.lname, this.state.phone)) {
      this.setState({loading:true});
      const db = firebase.firestore();
      var uid = this.props.mainStore.uid;
      // var nid = notifId();
      // var notifBucket = db.collection('notifications').doc(uid).collection('notifs');
      var rootRef = this.props.navigation;
      var storeRef = this.props;
      var thisRef = this;
      const inviteCode = generateInviteCode(6);
      const user = {
        fname : this.state.fname,
        lname : this.state.lname,
        phone : this.state.phone,
        inviteCode : inviteCode,
        invitesLeft : 10,
        regTimestamp : + new Date()
      };

      // await registerForPushNotificationsAsync(uid);

      // await notifBucket.doc(nid).set({
      //   id : nid,
      //   timestamp : + new Date(),
      //   read : false,
      //   content : "Hi "+this.state.fname+", Welcome to the doorzy family. You are one of our first customers and you are special for us. I personally thank you for choosing doorzy as your doorstep delivery companion. Also, we are open to feedbacks and appreciate any kind of feedback or criticism.",
      //   title : "Welcome aboard!"
      // }).catch(function(err){
      //   this.setState({loading:false});
      //   console.log(err);
      // });

      await db.collection("inviteCodes").doc(uid).set({code : inviteCode,uid : uid}).then(()=>{
        
      }).catch(err=>{console.log(err);this.setState({loading:false});});

      await db.collection('users').doc(uid).set(user,{merge:true}).then(function(){
        storeRef.mainStore.setUser(user);
        rootRef.navigate('App');
      }).catch(err =>{console.log(err);this.setState({loading:false});});

    } else {
      console.log(this.state.error);
      this.setState({loading:false});
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid={true}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.formTitleWrapper}>
          <Text style={styles.h3}>
            Welcome to doorzy <Text style={styles.secondaryColor}>FAMILY.</Text>
          </Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="First name"
              value={this.state.fname}
              onChangeText={text => {
                this.setState({ fname: text });
              }}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Last name"
              value={this.state.lname}
              onChangeText={text => {
                this.setState({ lname: text });
              }}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Mobile Number"
              value={this.state.phone}
              onChangeText={text => {
                this.setState({ phone: text });
              }}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <Button
              buttonStyle={styles.btn}
              type="solid"
              raised={false}
              onPress={this.onSubmit}
              title="Next"
              loading={this.state.loading}
              disabled={this.state.loading}
            />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{this.state.error}</Text>
          </View>
        </View>
      </ScrollView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: colors.greyBackground
  },
  error: {
    color: colors.errorMessage
  },
  errorContainer: {
    padding: 23
  },
  logoContainer: {
    marginTop: 50,
    marginBottom: 20
  },
  formTitleWrapper: {
    padding: 23,
    backgroundColor: colors.brandPrimary,
    flex: 1,
    justifyContent: "center"
  },
  h3: {
    fontFamily: "Rubik-Regular",
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 20,
    textAlign: "center"
  },
  h6: {
    fontFamily: "Rubik-Regular",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center"
  },
  secondaryColor: {
    color: colors.brandSecondary
  },
  formContainer: {
    flex: 3,
    marginTop: 20
  },
  textInputWrapper: {
    paddingHorizontal: 23,
    marginTop: 15
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 10,
    backgroundColor: colors.white
  },
  btn: {
    backgroundColor: colors.successButton,
    height: 50,
    marginTop: 15
  }
});

export const RegisterScreenNavigator = createStackNavigator(
  {
    Register: RegisterScreen
  },
  {
    headerMode: "none",
    mode: "modal",
    defaultNavigationOptions: {
      headerStyle: {
        borderBottomWidth: 0,
        shadowOpacity: 0,
        shadowOffset: {
          height: 0
        },
        shadowRadius: 0,
        elevation: 0,
        backgroundColor: colors.brandPrimary
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontFamily: "Rubik-Regular",
        textAlign: "center"
      }
    }
  }
);
