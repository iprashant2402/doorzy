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
import ProductFormUpdate from "../../components/productFormUpdate";
import { Button, Divider, ListItem, Avatar, Card } from "react-native-elements";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const productId = require("uuid/v4");
if (Platform.OS !== "web") {
  window = undefined;
}

async function goToMenu(id, navigate, title, active, store) {
  if (active) {
    let outlet = {
      id: id,
      title: title,
      active: active
    };
    await store.setOutlet(outlet);
    navigate.navigate("OutletMenuScreen");
  }
}

function OutletItem({ title, active, id, navigate, store, offer, image }) {
  return (
    <Card
      style={styles.outletItem}
      wrapperStyle={styles.outletItemWrapper}
      containerStyle={styles.outletItemWrapper}
    >
      <Avatar
        onPress={() => {
          goToMenu(id, navigate, title, active, store);
        }}
        placeholderStyle={{ backgroundColor: colors.primary }}
        source={{
          uri: image
        }}
        size="xlarge"
      />
      <Text
        style={styles.itemTitle}
        onPress={() => {
          goToMenu(id, navigate, title, active, store);
        }}
      >
        {title}
      </Text>
      <Text style={active ? styles.itemActive : styles.itemInactive}>
        {active ? "Open" : "Closed"}
      </Text>
      <Text style={styles.offer}>{offer > 0 ? offer + "% OFF" : ""}</Text>
    </Card>
  );
}

@inject("mainStore")
@observer
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        {
          name: "",
          brand: "",
          quantity: 1,
          preferredShop: "",
          id: productId(),
          estAmt: 0
        }
      ],
      time: 10,
      outlets: []
    };
  }
  onSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      console.warn(e);
    }
  };

  addProduct = async () => {
    if(this.state.products.length<=6)
    {
      const newProduct = {
        name: "",
        brand: "",
        quantity: 1,
        preferredShop: "",
        id: productId(),
        estAmt: 0
      };
      this.setState(prevState => ({
        products: [...prevState.products, newProduct]
      }));
    }
    else{
      alert("You cannot order more than 7 items in one order.");
    }
  };

  removeProduct = id => {
    this.setState({
      products: this.state.products.filter(product => product.id !== id)
    });
  };

  getProduct = product => {
    console.log(product);
    const tempArray = this.state.products;
    tempArray.map(p => {
      if (p.id === product.id) {
        p.name = product.name;
        p.brand = product.brand;
        p.quantity = product.quantity;
        p.preferredShop = product.preferredShop;
        p.estAmt = product.estAmt;
      } else {
        p = p;
      }
    });
    this.setState({
      products: tempArray
    });
  };

  checkItemUpdate(item,product){
    if(product.id === item.id){
      if(product.name !== item.name || product.quantity !== item.quantity){
        this.props.mainStore.removeItemFromCart(item.id);
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return true;
    }
  }

  addToCart = async products => {
    const thisRef = this;
    this.props.mainStore.cart.forEach(function(item) {
      products = products.filter(product => thisRef.checkItemUpdate(item,product));
    });
    this.props.mainStore.setCart(products);
    await this.props.mainStore.setRoute("HomeScreen");
    console.log("HOMESCREEN:" + this.props.mainStore.cartCount);
    this.props.navigation.navigate("CartScreen");
  };

  getCurrentTime = () => {
    var d = new Date(+new Date());
    var hours = d.getHours();
    console.log(hours);
    return hours;
  };

  validateQuantity = (q) => {
    if(q>0){
      return true;
    }
    else return false;
  }

  handleSubmit = () => {
    const products = this.state.products.filter(product => product.name !== "");
    this.addToCart(products);
  };

  componentDidMount() {
    this.setState({
      time: this.getCurrentTime()
    });
    console.log("LINE 164 : homeScreen.js");
    const outletRef = firebase.firestore().collection("outlets");
    const thisRef = this;
    let outlets = [];
    outletRef.onSnapshot(function(snap) {
      if (snap) {
        const outletsTemp = [];
        snap.forEach(function(doc) {
          outletsTemp.push(doc.data());
        });
        outletsTemp.sort(function(x, y) {
          return x.active === y.active ? 0 : x.active ? -1 : 1;
        });
        thisRef.setState(
          {
            outlets: outletsTemp
          },
          () => {
            console.log(thisRef.state.outlets);
          }
        );
      }
    });
  }

  render() {
    if (this.state.time >= 5 && this.state.time < 9) {
      addProductForm = (
        <View
          style={{
            marginTop: 30,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20
          }}
        >
          {/* <Text style={styles.text1}>
            We are accepting orders only for doorzy Food Partners after 11:00 PM.
          </Text> */}
          <Text style={styles.text1}>
            Sorry, we are closed for now. We will be back live at 9 am.
          </Text>
        </View>
      );
      /*nightDeliveryDisclaimer = (
        <View
          style={{
            marginTop: 10,
            padding: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={styles.text1}>
            Introducing <Text style={styles.textPrimary}>doorzy</Text> originals
          </Text>
          <Text style={styles.text2}>
            We are accepting orders only for Jeetu's Kitchen after 11:00 PM.
          </Text>
        </View>
      );*/
      nightDeliveryDisclaimer = null;
    } else {
      addProductForm = this.state.products.map((l, i) => (
        <ProductFormUpdate
          id={l.id}
          removeProduct={this.removeProduct}
          getProduct={this.getProduct}
        />
      ));
      nightDeliveryDisclaimer = null;
    }
    console.log(this.state.outlets);
    return (
      <View style={styles.container}>
        <HeaderComponent title="Home" navigation={this.props.navigation} />
        <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={50}>
          <ScrollView>
            <Divider style={{ backgroundColor: "transparent", height: 10 }} />
            {/*<ListItem key="offer" subtitle="*Offer Valid for Limited Period" title="Buy 1 Milky Mist Yoghurt, Get 1 FREE*" leftIcon={{ name: "card-giftcard",color:colors.successButton }}/>
            <Divider style={{ backgroundColor: "transparent", height: 5 }} />
            <ListItem key="offer" subtitle="*Upto INR 100" title="Order from TARA MAA & Get 10% OFF*" leftIcon={{ name: "card-giftcard",color:colors.successButton }}/>
            <Divider style={{ backgroundColor: "transparent", height: 20 }} />*/}
            {nightDeliveryDisclaimer}
            <Divider style={{ backgroundColor: "transparent", height: 20 }} />
            <View style={styles.originals}>
              <Text style={styles.logoTextPrimary}>
                d<Text style={styles.logoTextSecondary}>oo</Text>rzy Food
                Partners
              </Text>
            </View>
            <FlatList
              data={this.state.outlets}
              horizontal={true}
              renderItem={({ item }) => (
                <OutletItem
                  title={item.name}
                  navigate={this.props.navigation}
                  active={item.active}
                  id={item.id}
                  store={this.props.mainStore}
                  offer={item.offer ? item.offer : 0}
                  image={item.image}
                />
              )}
              keyExtractor={item => item.id}
            />
            <Divider style={{ backgroundColor: "transparent", height: 20 }} />
            <View style={styles.originals}>
              <Text style={styles.text1}>
                What do you want to buy?
              </Text>
            </View>
            <Divider style={{ backgroundColor: "transparent", height: 20 }} />
            {addProductForm}
            <View style={styles.btnWrapper}></View>
          </ScrollView>
        </KeyboardAwareScrollView>
        <View style={styles.flexContainer}>
          <View style={styles.flexOne}>
            <Button
              title="Add new item"
              onPress={() => this.addProduct()}
              buttonStyle={styles.btn}
              titleStyle={styles.btnTitle}
              type="clear"
              disabled={
                this.state.time >= 5 && this.state.time < 9 ? true : false
              }
            />
          </View>
          <View style={styles.flexOne}>
            <Button
              title="Proceed to cart"
              buttonStyle={styles.orderbtn}
              type="solid"
              titleStyle={styles.orderbtnTitle}
              onPress={() => this.handleSubmit()}
            />
          </View>
        </View>
      </View>
    );
  }
}

export const HomeScreenNavigator = createStackNavigator(
  {
    Home: HomeScreen
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
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white
  },
  flexOne: {
    flex: 1,
  },

  flexTwo: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  outletItem: {
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  outletItemWrapper: {
    backgroundColor: colors.white,
  },
  itemTitle: {
    fontFamily: "Rubik-Bold",
    fontSize: 15,
    color: colors.primary,
    margin: 5
  },
  itemActive: {
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    color: colors.successButton,
    margin: 5
  },
  offer: {
    fontFamily: "Rubik-Bold",
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
  originals: {},
  text1: {
    fontFamily: "Rubik-Bold",
    fontSize: 20,
    color: colors.primary,
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
    backgroundColor: colors.white
  },
  orderbtn: {
    backgroundColor: colors.successButton,
    borderRadius: 0,
    marginVertical: 0,
    height: 50,
  },
  btn: {
    backgroundColor: colors.brandPrimary,
    borderWidth: 2,
    borderColor: colors.brandPrimary,
    borderRadius: 0,
    marginVertical: 0,
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
    color: colors.white,
    fontWeight: 'bold'
  },
  orderbtnTitle: {
    color: colors.white,
    fontWeight: 'bold'
  },
  btnWrapper: {
    padding: 20,
    marginTop: 10
  }
});
