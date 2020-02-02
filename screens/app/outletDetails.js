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
  FlatList,
  ActivityIndicator
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
import { categoriesDB } from "../../util/categoriesDB";
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
import FoodItem from "../../components/foodItem";
import * as Segment from "expo-analytics-segment";
const productId = require("uuid/v4");
if (Platform.OS !== "web") {
  window = undefined;
}

function CatItem({cat, items, addProductToArray, getProduct, alterQuantity}){
  menuList = items.map((l,i)=>(
    <FoodItem
         item={l}
         key={i}
         addProductToArray={addProductToArray}
         getProduct={getProduct}
         alterQuantity={alterQuantity}
       />
  ));
  return(
    <View style={styles.itemRow&&styles.paddingScore}>
      <Text style={styles.catTitle}>{categoriesDB[cat]}</Text>
      {menuList}
    </View>
  );
}

@inject("mainStore")
@observer
class OutletMenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
      menu: [],
      products: [],
      showIndicator: true
    };
  }

  getCurrentTime = () => {
    var d = new Date(+new Date());
    var hours = d.getHours();
    console.log(hours);
    return hours;
  };

  addToCart = async products => {
    console.log("LINE 66 outlet Details");
    console.log(products);
    this.props.mainStore.setCart(products);
    await this.props.mainStore.setRoute("OutletMenuScreen");
    console.log("HOMESCREEN:" + this.props.mainStore.cartCount);
    this.props.navigation.navigate("CartScreen");
  };

  getProduct = product => {
    console.log(product);
    const tempArray = this.state.menu;
    const tempArray2 = this.state.products;
    tempArray.map(p => {
      if (p.id === product.id) {
        p.quantity = product.quantity;
      } else {
        p = p;
      }
    });
    tempArray2.map(p => {
      if (p.id === product.id) {
        p.quantity = product.quantity;
      } else {
        p = p;
      }
    });
    this.setState({
      menu: tempArray,
      products: tempArray2
    });
  };

  addProductToArray = product => {
    const tempArray = this.state.products;
    product.quantity = product.quantity + 1;
    tempArray.push(product);
    this.setState({
      products: tempArray
    });
  };

  alterQuantity = (product, inc) => {
    const tempArray1 = this.state.products;
    const tempArray2 = this.state.menu;
    const cart = this.props.mainStore.cart;
    var found = false;
    var item_index = 0;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === product.id) {
        found = true;
        item_index = i;
        break;
      }
    }
    if (inc) {
      product.quantity = product.quantity + 1;
      if (found) {
        this.props.mainStore.alterQuantity(item_index, true);
      }
    } else {
      if (product.quantity != 0) {
        product.quantity = product.quantity - 1;
        if (found) {
          this.props.mainStore.alterQuantity(item_index, false);
        }
      }
    }
    if (product.quantity === 0) {
      for (var i = 0; i < tempArray1.length; i++) {
        if (tempArray1[i].id === product.id) {
          tempArray1.splice(i, 1);
        }
      }
      if (found) {
        this.props.mainStore.removeItemFromCart(product.id);
      }
    }
    for (var i = 0; i < tempArray1.length; i++) {
      if (tempArray1[i].id === product.id && product.quantity != 0)
        tempArray1[i] = product;
    }
    for (var i = 0; i < tempArray2.length; i++) {
      if (tempArray2[i].id === product.id) tempArray2[i] = product;
    }
    this.setState({
      products: tempArray1,
      menu: tempArray2
    });
  };

  handleSubmit = () => {
    const products = this.state.products;
    for (var i = 0; i < products.length; i++) {
      const brand = this.props.mainStore.selectedOutlet.title;
      const name = products[i].name;
      const id = products[i].id;
      const quantity = products[i].quantity;
      const cost = products[i].cost * quantity;
      products[i] = {};
      products[i].brand = brand;
      products[i].name = name;
      products[i].id = id;
      products[i].quantity = quantity;
      products[i].amount = cost;
      products[i].estAmt = cost;
    }
    this.addToCart(products);
  };

  componentDidMount() {
    Segment.screen(this.props.mainStore.selectedOutlet.title+" Menu Screen");
    const thisRef = this;
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      if(this.props.mainStore.selectedOutlet.id==="gNh5tRkgCaoDG14kjv5Z"){
      alert("Use coupon DOORZYIT and get 10% off up to Rs.100 on orders above Rs.100");
      }
      if(this.props.mainStore.selectedOutlet.id==="1LfXLUiWlagIOEmdG9WT"){
        
      alert("Use coupon DOORZYHART and get 20% off up to Rs.100 on orders above Rs.100");
      }
      this.setState({
        menu: [],
        products: []
      });
      const menuRef = firebase
        .firestore()
        .collection("menus")
        .doc(this.props.mainStore.selectedOutlet.id)
        .collection("items");
      console.log("MENU SCREEN FOCUSED : LINE 82");
      menuRef
        .get()
        .then(function(snap) {
          console.log(
            "INSIDE MENUREF.GET() FUNCTION LINE 84 : OUTLETDETAILS.JS"
          );
          if (snap) {
            console.log(
              "INSIDE MENUREF.GET() FUNCTION LINE 86(SNAP IS PRESENT) : OUTLETDETAILS.JS"
            );
            const foodItems = [];
            snap.forEach(function(doc) {
              foodItems.push(doc.data());
            });
            foodItems.sort(function(a, b) {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            });
            foodItems.forEach(function(item) {
              const cart = thisRef.props.mainStore.cart;
              var found = false;
              for (var i = 0; i < cart.length; i++) {
                if (cart[i].id === item.id) {
                  item.quantity = cart[i].quantity;
                  found = true;
                  break;
                }
              }
              if (!found) {
                item.quantity = 0;
              }
            });
            thisRef.setState(
              {
                menu: foodItems
              },
              () => {
                thisRef.setState({
                  showIndicator: false
                });
                // const tempCart = thisRef.props.mainStore.cart;
                // console.log("OUTLET DETAILS : LINE 187 :");
                // console.log(tempCart);
                // const tempMenu = thisRef.state.menu;
                // const tempProducts = thisRef.state.products;
                // for(var i=0;i<tempMenu.length;i++){
                //   tempCart.forEach(cartItem => {
                //     if(tempMenu[i].id === cartItem.id){
                //       //tempProducts.push(cartItem);
                //       tempMenu[i].quantity = cartItem.quantity;
                //     }
                //   })
                // }
                // thisRef.setState({
                //   menu : tempMenu,
                //   products : tempProducts
                // },()=>{console.log(thisRef.state.menu)});
              }
            );
          }
        })
        .catch(err => console.log(err));
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  categorize = (items, key) => {
    // get unique values for grouping key
    const unique = [...new Set(items.map(item => item[key]))];

    // will be ascending by default
    unique.sort();

    // sorting all of the results by title field
    const sortFn = (a, b) => a.name > b.name;

    const sortItems = val => {
      // filters the result set to items sharing the current group field value
      let sorted = items.filter(item => item[key] === val);
      // sort by title
      sorted.sort(sortFn);
      return sorted;
    };

    // reduce to a Map (which preserves insertion order and maintains the group key sorting)
    return unique.reduce((map, cur) => map.set(cur, sortItems(cur)), new Map());
  };

  renderMenu = () => {
    const categorizedMenu = this.categorize(this.state.menu,'cid');
    const temp = [];
    for(let[cat,items] of categorizedMenu){
      // const catCom = (function(){
      //   return ();
      // })(); 
      temp.push(<CatItem cat={cat} items={items} addProductToArray={this.addProductToArray} getProduct={this.getProduct} alterQuantity={this.alterQuantity} />);
    }
    return temp; 
  }

  render() {
    const outlet = this.props.mainStore.selectedOutlet;
    const categorizedMenu = this.categorize(this.state.menu,'cid');
    console.log(categorizedMenu);
    //menuList = this.renderMenu();
     menuList = this.state.menu.map((l, i) => (
       <FoodItem
         item={l}
         key={i}
         addProductToArray={this.addProductToArray}
         getProduct={this.getProduct}
         alterQuantity={this.alterQuantity}
       />
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
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.menuTitle}>Menu</Text>
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <ActivityIndicator
                  animating={this.state.showIndicator}
                  size="large"
                  color={colors.primary}
                />
              </View>
              {menuList}
            </View>
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
  paddingScore : {
    padding: 10,
    marginBottom: 20
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
    flex: 2
  },
  inputBox: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder
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
    margin: 10
  },
  inputRowWrapperCustom: {
    flexDirection: "row",
    marginVertical: 10
  },
  btnWrapper: {
    flex: 1
  },
  quantityWrapper: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 1
  },
  quantityContainer: {
    flex: 1,
    marginHorizontal: 7.5
  },
  quantitylabel: {
    textAlign: "center",
    color: colors.primary
  },
  catTitle: {
    fontFamily: "Rubik-Bold",
    fontSize: 15,
    color: colors.primary,
    margin: 5
  },
});
