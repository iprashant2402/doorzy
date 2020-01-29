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
  Modal,
  SegmentedControlIOS
} from "react-native";
import { colors } from "../../colors/colors";
import { Button, ListItem, Divider, Icon,Card } from "react-native-elements";
import * as Segment from "expo-analytics-segment";
import firebase from "firebase";
import "firebase/firestore";
import addAddress from "../../util/addAddress";
import ProductItem from "../../components/productItem";
import { TouchableOpacity } from "react-native-gesture-handler";
import placeOrder from "../../util/placeOrder";
const addressId = require("uuid/v4");

if (Platform.OS !== "web") {
  window = undefined;
}

@inject("mainStore")
@observer
export default class CartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      couponCode: "NILL",
      address: undefined,
      showIndicator: false,
      showModal: false,
      instruction: ''
    };
  }

  componentDidMount(){
    if(this.props.mainStore.user.addresses){
      const address = this.props.mainStore.user.addresses[0];
      this.setState({
        address : address
      });
    }
    Segment.screen('Cart Screen');
  }

  setDeliveryAddress = address => {
    this.setState(
      {
        address: address
      },
      () => {
        console.log(this.state.address);
      }
    );
  };

  setModalVisible(visible) {
    this.setState({ showModal: visible });
  }

  removeItem = id => {
    this.props.mainStore.removeItemFromCart(id);
  }

  handleInstructionText = (text) => {
    this.setState({
      instruction : text
    });
  }

  submitOrder = () => {
    if (!(this.state.address === "" || this.state.address === undefined) && !(this.props.mainStore.cart.length<1)) {
      this.setState({ showIndicator: true }, () => {
        if (
          placeOrder(
            this.state.address,
            this.state.couponCode,
            this.props.mainStore.uid,
            this.props.mainStore.user.phone,
            this.props.mainStore.cart,
            this.state.instruction
          )
        ) {
          this.setState({ showIndicator: false }, () => {
            this.setState({ showModal: true });
            this.props.mainStore.resetCart();
          });
          Segment.trackWithProperties("Order Placed", {
            time: +new Date()
          });
        } else {
          console.log("FAILED TO PLACE ORDER");
        }
      });
    } else {
      console.log("ADDRESS ISSUE");
      alert("Please Select An Address");
    }
  };

  render() {
    if(this.props.mainStore.cart.length<1){
      productItem = <View><Card style={styles.productItem && styles.titleContainer}><Text style={styles.text1}>Your cart is empty :(</Text></Card><Divider style={{ height: 20, backgroundColor: colors.white }} /></View>
      estTotal = null;
      }
    else{
    productItem = this.props.mainStore.cart.map((l, i) => (
      <ProductItem product={l} key={i} style={styles.productItem} removeItem = {this.removeItem} />
    ));
    var total = 0;
    this.props.mainStore.cart.map((l,i)=>{
      if(l.estAmt){
        console.log("cart:"+l.estAmt)
        total = total + parseInt(l.estAmt);
      }
    });
    estTotal = <View style={styles.titleContainer}><Text style={styles.total}>Estimated Total : {total} <Text style={styles.text1}>(excl. delivery & packing charges)</Text></Text></View>
    
  }
    const user = this.props.mainStore.user;
    if (user.addresses) {
      addressComponent = user.addresses.map((l, i) => (
        <TouchableOpacity
          style={
            this.state.address === l
              ? styles.selectedAddress
              : styles.addressContainer
          }
          onPress={() => this.setDeliveryAddress(l)}
        >
          <View style={styles.addressTitleWrapper}>
            <Text style={styles.addressTitle}>{l.label.toUpperCase()}</Text>
          </View>
          <View style={styles.addressTextWrapper}>
            <Text style={styles.text1}>{l.addLine1}</Text>
            <Text style={styles.text1}>{l.addLine2}</Text>
            <Text style={styles.text1}>{l.landmark}</Text>
          </View>
        </TouchableOpacity>
      ));
    } else {
      addressComponent = <View style={styles.generalTextWrapper}>
        <Text style={styles.text1}>You don't have any saved address.</Text>
        </View>;
    }
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
              onPress={() => this.props.navigation.navigate(this.props.mainStore.route)}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>CART</Text>
          </View>
        </View>
        <Divider style={{ height: 10, backgroundColor: colors.white }} />
        <View style={styles.ph20}>
            <Text style={styles.textHeading}>Items in your cart</Text>
          </View>
        <ScrollView style={{ marginTop: 15 }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showModal}
          >
            <View style={styles.container}>
              <View style={{flex:1,backgroundColor:colors.successButton,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              <Icon
              name="checkcircleo"
              type="antdesign"
              size={100}
              color={colors.white}/>
              </View>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                
                <Text style={styles.successText}>Your order has been placed <Text style={{color:colors.successButton}}>successfully</Text>.</Text>
                <Text style={styles.successText}>Thank You for ordering with <Text style={{color:colors.brandPrimary,fontFamily:'josephine'}}>doorzy</Text>.</Text>

                <Button buttonStyle={styles.brandBtn} title="CONTINUE SHOPPING" titleStyle={styles.btnFont} onPress={() => {
                    this.setModalVisible(!this.state.showModal);
                    this.props.navigation.navigate('OrderHistoryScreen');
                  }}/>
              </View>
            </View>
          </Modal>
          
          {productItem}
          {estTotal}

          <View style={styles.ph20}>
              <TextInput placeholder="Any specific instructions? Add ciggaretes here." style={styles.instructionBox} onChangeText={(text)=>{this.handleInstructionText(text)}} value={this.state.instruction}/>
          </View>
          
          <View style={styles.ph20}>
            <Text style={styles.textHeading}>Tap the Address to proceed:</Text>
          </View>
          <Divider style={{ height: 10, backgroundColor: colors.white }} />

          {addressComponent}
          <View style={styles.generalTextWrapper}>
          <Button title='ADD NEW ADDRESS' onPress={()=>{this.props.mainStore.setRoute("CartScreen");console.log(this.props.mainStore.route);this.props.navigation.navigate('AddLocationScreen')}} buttonStyle={{marginTop : 20,borderColor:colors.successButton,borderWidth:2}} type='outline' icon={{name:'add-location',color:colors.successButton}} titleStyle={{color:colors.successButton,fontWeight: 'bold'}}/>
          </View>
        </ScrollView>
        <Button
          title="Place Order"
          buttonStyle={styles.btn}
          titleStyle={styles.btnTitle}
          type="solid"
          loading={this.state.showIndicator}
          onPress={() => this.submitOrder()}
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
  instructionBox: {
    borderColor: colors.greyBorder,
    borderWidth: 1,
    borderRadius: 5,
    padding : 10,
    height: 70,
    backgroundColor: colors.white
  },
  total : {
    fontSize : 20,
    fontFamily : 'Rubik-Bold',
    color : colors.text
  },
  selectedAddress: {
    backgroundColor: "#e7f3f7",
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
    fontSize: 20,
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
    backgroundColor: colors.brandPrimary,
    borderRadius: 0,
    height: 50
  },
  btnTitle: {
    color: colors.white,
    fontWeight: 'bold'
  },
  error: {
    color: colors.errorMessage
  }
});
