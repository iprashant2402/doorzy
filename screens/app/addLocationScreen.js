import React, { Component } from "react";
import { inject, observer } from "mobx-react/native";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Platform,
  TextInput
} from "react-native";
import { colors } from "../../colors/colors";
import { Button, ListItem, Divider,Icon } from "react-native-elements";
import firebase from "firebase";
import "firebase/firestore";
import addAddress from "../../util/addAddress";
const addressId = require("uuid/v4");
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

if (Platform.OS !== "web") {
  window = undefined;
}

@inject("mainStore")
@observer
export default class AddLocationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: {
        addLine1: "",
        addLine2: "",
        label: "",
        landmark: ""
      },
      errorMessage: {
        addLine1: "",
        landmark: "",
        label: ""
      },
      routeName : this.props.mainStore.route,
      loading : false
    };
  }

  validateAddressForm = () => {
    if (
      this.state.address.addLine1 != "" &&
      this.state.address.label != "" &&
      this.state.address.landmark != ""
    ) {
      const nameReg = /^[a-zA-Z0-9\s,'-]*$/;
      if (!nameReg.test(this.state.address.addLine1)) {
        this.setState(previousState => ({
          address: previousState.address,
          errorMessage: {
            addLine1: "Enter a valid address",
            landmark: "",
            label: ""
          }
        }));
        return false;
      }
      if (!nameReg.test(this.state.address.landmark)) {
        this.setState(previousState => ({
          address: previousState.address,
          errorMessage: {
            addLine1: "",
            landmark: "Enter a valid landmark",
            label: ""
          }
        }));
        return false;
      }
      if (!nameReg.test(this.state.address.label)) {
        this.setState(previousState => ({
          address: previousState.address,
          errorMessage: {
            addLine1: "",
            landmark: "",
            label: "Please provide a valid label."
          }
        }));
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  handleAddressUpdate = async () => {
    if (this.validateAddressForm()) {
      this.setState({loading:true});
      const uid = this.props.mainStore.uid;
      const address = this.state.address;
      const thisRef = this;
      const db = firebase.firestore()
      address.id = addressId();
      await addAddress(uid,address);
      db.collection('users').doc(uid).get().then(function(snap){
        thisRef.props.mainStore.setUser(snap.data());
        thisRef.setState({loading:false},()=>thisRef.props.navigation.navigate("CartScreen"));
      }).catch(err=>console.log(err));
    } else {
      this.setState({loading:false});
      console.log(this.state.errorMessage);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerButtonContainer}>
            <Button type="clear" icon={<Icon
                name="arrowleft"
                type="antdesign"
                size={18}
                color={colors.white}
                />} onPress={()=>this.props.navigation.navigate("CartScreen")}
             />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>ADD NEW ADDRESS</Text>
          </View>
        </View>
        <Divider style={{ height: 10, backgroundColor: colors.white }} />
        <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={50}>
        <ScrollView style={{ marginTop: 15, paddingHorizontal: 23 }}>
          <Text style={styles.label}>
            ADDRESS LINE 1*
            <Text style={styles.error}>
              {" "}
              {this.state.errorMessage.addLine1}
            </Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={text =>
                this.setState(p => ({
                  address: {
                    addLine1: text,
                    addLine2: p.address.addLine2,
                    landmark: p.address.landmark,
                    label: p.address.label
                  }
                }))
              }
              style={styles.input}
              value={this.state.address.addLine1}
              placeholder="HOUSE/FLAT NO."
            />
          </View>
          <Text style={styles.label}>ADDRESS LINE 2</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={text =>
                this.setState(p => ({
                  address: {
                    addLine1: p.address.addLine1,
                    addLine2: text,
                    landmark: p.address.landmark,
                    label: p.address.label
                  }
                }))
              }
              style={styles.input}
              value={this.state.address.addLine2}
              placeholder="LOCALITY/AREA"
            />
          </View>
          <Text style={styles.label}>
            LANDMARK*
            <Text style={styles.error}>
              {" "}
              {this.state.errorMessage.landmark}
            </Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={text =>
                this.setState(p => ({
                  address: {
                    addLine1: p.address.addLine1,
                    addLine2: p.address.addLine2,
                    landmark: text,
                    label: p.address.label
                  }
                }))
              }
              style={styles.input}
              value={this.state.address.landmark}
              placeholder="NEARBY BUILDING etc."
            />
          </View>
          <Text style={styles.label}>
            LABEL*
            <Text style={styles.error}> {this.state.errorMessage.label}</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              onChangeText={text =>
                this.setState(p => ({
                  address: {
                    addLine1: p.address.addLine1,
                    addLine2: p.address.addLine2,
                    landmark: p.address.landmark,
                    label: text
                  }
                }))
              }
              style={styles.input}
              value={this.state.address.label}
              placeholder="PRIMARY, WORK, HOME etc."
            />
          </View>
        </ScrollView>
        </KeyboardAwareScrollView>
        <Button
          title="SAVE AND PROCEED"
          onPress={() => this.handleAddressUpdate()}
          buttonStyle={styles.btn}
          titleStyle={styles.btnTitle}
          type="solid"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  header: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.brandPrimary
  },
  headerButtonContainer: {
    padding: 10
  },
  titleContainer: {
    padding: 20
  },
  title: {
    fontFamily: "Rubik-Regular",
    fontSize: 18,
    color: colors.white
  },
  contentStyle: {
    padding: 5
  },
  inputWrapper: {
    padding: 0,
    marginBottom: 23
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
    padding: 10
  },
  label: {
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    marginBottom: 10
  },
  btn: {
    backgroundColor: colors.successButton,
    borderRadius: 0
  },
  btnTitle: {
    fontFamily: "Rubik-Regular",
    color: colors.white
  },
  error: {
    color: colors.errorMessage
  }
});
