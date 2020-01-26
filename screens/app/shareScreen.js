import React, { Component } from "react";
import { inject, observer } from "mobx-react/native";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Platform,
  TextInput,
  ActivityIndicator,
  Modal
} from "react-native";
import { colors } from "../../colors/colors";
import { Button, ListItem, Divider, Icon,Card } from "react-native-elements";
import firebase from "firebase";
import "firebase/firestore";
import addAddress from "../../util/addAddress";
import ProductItem from "../../components/productItem";
import { TouchableOpacity } from "react-native-gesture-handler";
import placeOrder from "../../util/placeOrder";
import * as Segment from "expo-analytics-segment";
const addressId = require("uuid/v4");

if (Platform.OS !== "web") {
  window = undefined;
}

@inject("mainStore")
@observer
export default class ShareScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      couponCode: "NILL",
      address: "",
      showIndicator: false,
      showModal: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerButtonContainer}>
            <Button
              type="clear"
              icon={
                <Icon
                  name="arrowleft"
                  type="antdesign"
                  size={18}
                  color={colors.white}
                />
              }
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>CART</Text>
          </View>
        </View>
        <Divider style={{ height: 10, backgroundColor: colors.white }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  selectedAddress: {
    backgroundColor: "#f1ecf6",
    padding: 20,
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1
  },
  successText : {
      fontFamily : 'Rubik-Bold',
      fontSize : 15,
      textAlign : 'center',
      color:colors.text     
  },
  brandBtn : {
    backgroundColor : colors.primary,
    borderRadius : 0,
    padding : 10,
    height : 50,
    marginTop : 30
  },
  btnFont : {
      fontFamily : 'Rubik-Regular',
  },
  productItem: {
    marginBottom: 20
  },
  addressTitle: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "bold",
    fontFamily: "Rubik-Bold"
  },
  addressTitleWrapper: {
    marginBottom: 5
  },
  generalTextWrapper: {
    paddingHorizontal : 20
  },
  text1: {
    fontSize: 15,
    margin: 1,
    color: colors.text,
    fontFamily: "Rubik-Regular"
  },
  addressContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1
  },
  textHeading: {
    fontFamily: "Rubik-Bold",
    fontSize: 15,
    color: colors.text,
    marginBottom: 15,
    marginTop: 35
  },
  ph20: {
    paddingHorizontal: 20
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
    backgroundColor: colors.primarySupport,
    borderRadius: 0,
    height: 50
  },
  btnTitle: {
    fontFamily: "Rubik-Regular",
    color: colors.white
  },
  error: {
    color: colors.errorMessage
  }
});
