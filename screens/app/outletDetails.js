/*
This View is responsible for displaying form to take user inputs for placing order 
e.g. what product? which brand? quantity? ....
*/

import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ScrollView,
  FlatList
} from "react-native";
import { inject, observer } from "mobx-react/native";
import firebase from "firebase";
import "firebase/firestore";
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator
} from "react-navigation";
import { colors } from "../../colors/colors";
import { HeaderComponent } from "../../components/header";
import ProductForm from "../../components/productForm";
import {
  Button,
  Divider,
  ListItem,
  Avatar,
  Card,
  Icon
} from "react-native-elements";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const productId = require("uuid/v4");
if (Platform.OS !== "web") {
  window = undefined;
}

@inject("mainStore")
@observer
class OutletMenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
      menu: [],
      products: []
    };
  }

  getCurrentTime = () => {
    var d = new Date(+new Date());
    var hours = d.getHours();
    console.log(hours);
    return hours;
  };

  addToCart = products => {
    this.props.mainStore.setCart(products);
    console.log("HOMESCREEN:" + this.props.mainStore.cartCount);
    this.props.navigation.navigate("CartScreen");
  };

  handleSubmit = () => {
    const products = this.state.products;
    this.addToCart(products);
  };

  componentDidMount() {
    console.log("LINE 54 : outletDetails.js");
    const menuRef = firebase
      .firestore()
      .collection("menus")
      .doc(this.props.mainStore.selectedOutlet.id)
      .collection("items");
    const thisRef = this;
    this.focusListener = this.props.navigation.addListener('didFocus',()=>{
      console.log("MENU SCREEN FOCUSED : LINE 82")
      menuRef.get().then(function(snap) {
        console.log("INSIDE MENUREF.GET() FUNCTION LINE 84 : OUTLETDETAILS.JS");
        if (snap) {
          console.log("INSIDE MENUREF.GET() FUNCTION LINE 86(SNAP IS PRESENT) : OUTLETDETAILS.JS");
          const foodItems = [];
          snap.forEach(function(doc) {
            foodItems.push(doc.data());
          });
          foodItems.forEach(function(item) {
            item.quantity = 0;
          });
          thisRef.setState({
            menu: foodItems
          });
        }
      }).catch(err=>console.log(err));
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  incrementQuantity = () => {
    this.setState(
      prevState => ({
        quantity: prevState.quantity + 1
      }),
      () => {
        this.props.getProduct(this.state);
      }
    );
  };

  decrementQuantity = () => {
    if (this.state.quantity > 1) {
      this.setState(
        prevState => ({
          quantity: prevState.quantity - 1
        }),
        () => {
          this.props.getProduct(this.state);
        }
      );
    }
  };

  render() {
    const outlet = this.props.mainStore.selectedOutlet;
    addButton = (
      <Button
        title="Add"
        type="outline"
        buttonStyle={styles.greenOutline}
        titleStyle={styles.btnOutlineTitle}
      />
    );
    quantityButton = (
      <View style={styles.inputRowWrapperCustom}>
        <View style={styles.btnWrapper}>
          <Button
            type="clear"
            buttonStyle={styles.btn}
            icon={<Icon type="antdesign" name="minus" color={colors.primary} />}
            onPress={() => this.decrementQuantity()}
          />
        </View>
        <View style={styles.quantityWrapper}>
          <Text style={styles.quantity}>{this.state.quantity}</Text>
        </View>
        <View style={styles.btnWrapper}>
          <Button
            type="clear"
            buttonStyle={styles.btn}
            icon={{ name: "add", color: colors.primary }}
            onPress={() => this.incrementQuantity()}
          />
        </View>
      </View>
    );
    menuList = this.state.menu.map((l, i) => (
      <View style={styles.panel}>
        <View style={styles.itemRow}>
          <View style={styles.leftWrapper}>
            <Icon
              type="material-community"
              name="checkbox-intermediate"
              color={l.veg ? colors.successButton : colors.danger}
            />
            <Text style={styles.itemName}>{l.name}</Text>
          </View>
          <View style={styles.rightWrapper}>
            {quantityButton}
          </View>
        </View>
        <Text style={styles.itemCost}>Rs.{l.cost}</Text>
      </View>
    ));
    return (
      <View style={styles.container}>
        <HeaderComponent title="Home" navigation={this.props.navigation} />
        <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={50}>
          <ScrollView>
            <Divider style={{ backgroundColor: "transparent", height: 30 }} />
            <View style={styles.panel}>
              <Text style={styles.outletTitle}>{outlet.title}</Text>
              <Text
                style={outlet.active ? styles.itemActive : styles.itemInactive}
              >
                {outlet.active ? "Open" : "Closed"}
              </Text>
            </View>
            <Divider style={{ backgroundColor: "transparent", height: 10 }} />
            <View style={{ padding: 20 }}>
              <Text style={styles.menuTitle}>Menu</Text>
            </View>
            <View>{menuList}</View>
          </ScrollView>
        </KeyboardAwareScrollView>
        <Button
          title="PROCEED TO CART"
          buttonStyle={styles.orderbtn}
          type="solid"
          onPress={() => this.handleSubmit()}
        />
      </View>
    );
  }
}

export const OutletMenuScreenNavigator = createStackNavigator(
  {
    OutletMenu: OutletMenuScreen
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

const styles = StyleSheet.create({
  headerLeftButton: {
    padding: 5
  },
  btnOutlineTitle: {
    color: colors.successButton
  },
  greenOutline: {
    borderColor: colors.successButton,
    borderWidth: 1
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: colors.white
  },
  itemName: {
    fontSize: 18
  },
  itemCost: {
    fontSize: 15,
    color: colors.primary
  },
  panel: {
    marginBottom: 10,
    backgroundColor: colors.white,
    padding: 20
  },
  outletTitle: {
    fontFamily: "Rubik-Bold",
    fontSize: 25
  },
  menuTitle: {
    fontFamily: "Rubik-Bold",
    fontSize: 20
  },
  itemActive: {
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    color: colors.successButton,
    margin: 5
  },
  itemInactive: {
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    color: colors.danger,
    margin: 5
  },
  outletItem: {
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  itemTitle: {
    fontFamily: "Rubik-Bold",
    fontSize: 15,
    color: colors.brandPrimary,
    margin: 5
  },
  text1: {
    fontFamily: "Rubik-Bold",
    fontSize: 15,
    color: colors.text,
    margin: 5
  },
  textPrimary: {
    color: colors.brandPrimary
  },
  text2: {
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    color: colors.primary,
    margin: 5
  },
  container: {
    flex: 1,
    backgroundColor: colors.greyBackground
  },
  orderbtn: {
    backgroundColor: colors.successButton,
    borderRadius: 0,
    height: 50
  },
  logoTextPrimary: {
    color: colors.brandPrimary,
    fontFamily: "josephine",
    fontSize: 18
  },
  logoTextSecondary: {
    color: colors.brandSecondary,
    fontFamily: "josephine"
  },
  originals: {
    paddingHorizontal: 20
  },
  btnTitle: {
    color: colors.successButton
  },
  btnWrapper: {
    padding: 20,
    marginTop: 10
  },
  leftWrapper: {
    flex: 3,
    flexDirection: "row"
  },
  rightWrapper: {
    flex: 1
  },
  inputBox: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
    //padding: 10
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder
  },
  inputWrapper: {
    margin: 10
  },
  inputRowWrapper: {
    flexDirection: "row",
    margin: 10,
  },
  inputRowWrapperCustom: {
    flexDirection: "row",
    marginVertical: 10
  },
  btnWrapper: {
    flex: 1
  },
  quantityWrapper : {
    flex: 1,
    justifyContent: "center",
    borderWidth : 1,
    borderColor : colors.primary,
    padding : 1
  },
  quantityContainer : {
    flex : 1,
    marginHorizontal : 7.5,
  },
  quantitylabel : {
    textAlign: "center",
    color: colors.primary,

  }
});
