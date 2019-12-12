import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Icon, Card } from "react-native-elements";
import { colors } from "../colors/colors";
import {
  TouchableHighlight,
  TouchableOpacity
} from "react-native-gesture-handler";

export default class ProductFormUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      brand: "",
      quantity: 1,
      preferredShop : "",
      id : this.props.id,
      estAmt : 0
    };
  }

  incrementQuantity = () => {
      this.setState((prevState)=>({
         quantity : prevState.quantity+1 
      }),()=>{
          this.props.getProduct(this.state);
      });
  }

  decrementQuantity = () => {
      if(this.state.quantity>1){
    this.setState((prevState)=>({
       quantity : prevState.quantity-1 
    }),()=>{
        this.props.getProduct(this.state);
    });
    }
}

    returnProduct = () => {
        const item = {};
        item.name = this.state.name;
        item.brand = this.state.brand;
        item.quantity = this.state.quantity;
        item.id = this.state.id;
        item.preferredShop = this.state.preferredShop;
        item.estAmt = this.state.estAmt;
        this.props.getProduct(item);
    }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.orderItem}>
        <View style={styles.inputRowWrapper}>
          <View style={styles.flexThree}>
            <TextInput
              style={styles.input&&styles.productName}
              placeholder="Product Name"
              value={this.state.name}
              onChangeText = {text => {this.setState({name : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
          <View style={styles.flexOne}>
              <Text style={{fontWeight:'bold',color:colors.primary}}>X</Text>
          </View>
          <View style={styles.quantityContainer}>
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={this.state.quantity}
              onChangeText = {text => {this.setState({quantity : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
        </View>
        <View style={styles.inputRowWrapper}>
          <View style={styles.quantityContainer}>
            <TextInput
              style={styles.input}
              placeholder="Brand(optional)"
              value={this.state.brand}
              onChangeText = {text => {this.setState({brand : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
          <View style={styles.quantityContainer}>
            <TextInput
              style={styles.input}
              placeholder="Preferred Shop(optional)"
              value={this.state.preferredShop}
              onChangeText = {text => {this.setState({preferredShop : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
        </View>
        <View style={styles.inputRowWrapper}>
          <View style={styles.quantityContainer}>
            <TextInput
              style={styles.inputBox}
              placeholder="Estimated Cost per item"
              keyboardType="numeric"
              value={this.state.estAmt}
              onChangeText = {text => {this.setState({estAmt : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
          <View style={styles.rightBtnWrapper}>
            <Button 
              onPress={() => this.props.removeProduct(this.props.id)}
              type="clear"
              icon={
                <Icon type
                ="antdesign" name="delete" color={colors.danger} />
              }
            />
          </View>
        </View>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  inputBox: {
    height: 30,
    borderBottomWidth: 0,
    fontWeight: 'bold',
    fontSize: 13
  },
  input: {
    height: 30,
    borderBottomWidth: 0,
    fontWeight: 'bold',
    fontSize: 13
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
  },
  flexOne : {
    flex : 1,
    justifyContent: "center",
    alignItems: "center"
  },
  flexThree : {
    flex : 2,
  },
  quantitylabel : {
    textAlign: "center",
    color: colors.primary,

  },
  estAmtWrapper: {
    flex: 1,
    //borderWidth : 1,
    //borderColor : colors.greyBorder,
    //padding : 10,
    marginHorizontal : 2.5
  },
  btn: {
    borderWidth: 0
  },
  quantity: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary
  },
  leftInputWrapper: {
    flex: 1
  },
  rightBtnWrapper: {
    flex: 1
  },
  formText : {
      fontFamily : 'Rubik-Regular',
  },
  txt : {
      fontStyle : 'italic'
  },
  orderItem : {
    marginBottom : 10,
    backgroundColor : colors.white,
    padding : 5,
    borderRadius: 10,
    shadowColor: '#D0CFCF',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 1.0,
    borderTopColor: colors.primary,
    borderTopWidth: 4
  },
});
