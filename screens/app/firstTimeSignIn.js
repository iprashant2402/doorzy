/*
This View is responsible for displaying form to take user inputs for placing order 
e.g. what product? which brand? quantity? ....
*/

import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity
} from "react-native";
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
import { Dimensions } from "react-native";
import { colors } from "../../colors/colors";
import { TextInput } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import { WebView } from "react-native-webview";
import generateInviteCode from "../../util/generateInviteCode";
import registerForPushNotificationsAsync from "../../util/registerPushNotification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Segment from "expo-analytics-segment";

const notifId = require("uuid/v4");
const captchaUrl = "https://virestore-ae149.firebaseapp.com/";

export const DEVICE_WIDTH = Dimensions.get("window").width;
export const DEVICE_HEIGHT = Dimensions.get("window").height;

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
      loading: false,
      sendOtp: false,
      verificationCode: "",
      phoneSubmitted: false
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
    } else {
      this.setState({ error: "" });
      return true;
    }
  };
  // validatePhoneNumber = async () => {
  //   var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
  //   return regexp.test(this.state.phone)
  // };
  // handleVerifyCode = async () => {
  //   const { confirmResult, verificationCode } = this.state;
  //   if (verificationCode.length == 6) {
  //     confirmResult
  //       .confirm(verificationCode)
  //       .then(this.onSubmit())
  //       .catch(error => {
  //         alert(error.message);
  //         console.log(error);
  //       });
  //   } else {
  //     alert("Please enter a 6 digit OTP code.");
  //   }
  //   console.log("yohoooo");
  // };
  detailSubmit = async () => {
    if (this.validate(this.state.fname, this.state.lname, this.state.phone)) {
      const { phone } = this.state;
      var newPhone = "+91" + phone;
      this.setState({ phone: newPhone });
      this.setState({ phoneSubmitted: true });
    } else {
      console.log(this.state.error);
      this.setState({ loading: false });
    }
  };
  testFunc = async event => {
    const { phone } = this.state;
    const message = event.nativeEvent.data;
    switch (message) {
      case "DOMLoaded":
        this.webviewRef.injectJavaScript(`getToken('${phone}')`);
        return;
      case "ErrorSmsCode":
        // SMS Not sent or Captcha verification failed. You can do whatever you want here
        return;
      case "":
        return;
      default: {
        this.setState({
          sendOtp: true,
          verificationId: message
        });
      }
    }
    console.log("saksham");
  };
  // verifyOtp = async event => {
  //   if (this.validate(this.state.fname, this.state.lname, this.state.phone)) {
  //     const { phone } = this.state;
  //     const message = event.nativeEvent.data;

  //     switch (message) {
  //       case "DOMLoaded":
  //         this.webviewRef.injectJavaScript(`getToken('${phone}')`);
  //         return;
  //       case "ErrorSmsCode":
  //         // SMS Not sent or Captcha verification failed. You can do whatever you want here
  //         return;
  //       case "":
  //         return;
  //       default: {
  //         this.setState({
  //           promptSmsCode: true,
  //           verificationId: message
  //         });
  //       }
  //     }

  //     // firebase
  //     //   .auth()
  //     //   .signInWithPhoneNumber(this.state.phone)
  //     //   .then(confirmResult => {
  //     //     this.setState({ confirmResult });
  //     //   })
  //     //   .catch(error => {
  //     //     alert(error.message);
  //     //     console.log(error);
  //     //   });
  //     this.setState({ sendOtp: true });
  //   } else {
  //     console.log(this.state.error);
  //     this.setState({ loading: false });
  //   }
  // };
  onSignIn = async () => {};
  onSubmit = async () => {
    this.setState({ loading: true });
    const db = firebase.firestore();
    var uid = this.props.mainStore.uid;
    var nid = notifId();
    console.log("reached here");
    const { verificationCode, verificationId } = this.state;
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    var notifBucket = db
      .collection("notifications")
      .doc(uid)
      .collection("notifs");
    var rootRef = this.props.navigation;
    var storeRef = this.props;
    var thisRef = this;
    const inviteCode = generateInviteCode(6);
    const user = {
      fname: this.state.fname,
      lname: this.state.lname,
      phone: this.state.phone,
      inviteCode: inviteCode,
      invitesLeft: 10,
      regTimestamp: +new Date()
    };
    Segment.identifyWithTraits(uid, {
      firstName: user.fname,
      lastName: user.lname,
      phone: user.phone,
      createdAt: new Date(user.regTimestamp)
    });
    Segment.trackWithProperties("Sign Up", {
      firstName: user.fname,
      lastName: user.lname,
      phone: user.phone
    });
    await registerForPushNotificationsAsync(uid);

    await notifBucket
      .doc(nid)
      .set({
        id: nid,
        timestamp: +new Date(),
        read: false,
        content:
          "Hi " +
          this.state.fname +
          ", Welcome to the doorzy family. You are one of our first customers and you are special for us. I personally thank you for choosing doorzy as your doorstep delivery companion. Also, we are open to feedbacks and appreciate any kind of feedback or criticism.",
        title: "Welcome aboard!"
      })
      .catch(function(err) {
        this.setState({ loading: false });
        console.log(err);
      });

    await db
      .collection("inviteCodes")
      .doc(uid)
      .set({ code: inviteCode, uid: uid })
      .then(() => {})
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });

    await db
      .collection("users")
      .doc(uid)
      .set(user, { merge: true })
      .then(function() {
        storeRef.mainStore.setUser(user);
        rootRef.navigate("App");
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  render() {
    const { phoneSubmitted, sendOtp, phone } = this.state;
    if (!phoneSubmitted)
      return (
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <ScrollView contentContainerStyle={styles.body}>
            <View style={styles.formTitleWrapper}>
              <Text style={styles.h3}>
                Welcome to doorzy{" "}
                <Text style={styles.secondaryColor}>FAMILY.</Text>
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
                  onPress={this.detailSubmit}
                  title="Next"
                  loading={this.state.loading}
                  disabled={this.state.loading}
                />
              </View>
            </View>
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{this.state.error}</Text>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      );
    if (!sendOtp)
      return (
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <ScrollView contentContainerStyle={styles.body}>
            <View style={styles.formTitleWrapper}>
              <Text style={styles.h3}>
                Welcome to doorzy{" "}
                <Text style={styles.secondaryColor}>FAMILY.</Text>
              </Text>
            </View>
            <WebView
              injectedJavaScript={`getToken('${phone}')`}
              ref={r => (this.webviewRef = r)}
              source={{ uri: captchaUrl }}
              style={styles.video}
              onMessage={this.testFunc}
            />
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{this.state.error}</Text>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      );
    return (
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.formTitleWrapper}>
            <Text style={styles.h3}>
              Welcome to doorzy{" "}
              <Text style={styles.secondaryColor}>FAMILY.</Text>
            </Text>
          </View>

          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Verification code"
              value={this.state.verificationCode}
              keyboardType="numeric"
              onChangeText={verificationCode => {
                this.setState({ verificationCode });
              }}
              maxLength={6}
            />
          </View>

          <Button
            buttonStyle={styles.btn}
            type="solid"
            raised={false}
            onPress={this.onSubmit}
            title="Verify"
            loading={this.state.loading}
            disabled={this.state.loading}
          />

          <View style={styles.errorContainer}>
            <Text style={styles.error}>{this.state.error}</Text>
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
  video: {
    flex: 1,
    width: DEVICE_WIDTH,
    height: 800,
    position: "relative",
    top: 0
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
