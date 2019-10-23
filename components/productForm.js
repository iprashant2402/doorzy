import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Icon, Card } from "react-native-elements";
import { colors } from "../colors/colors";
import {
  TouchableHighlight,
  TouchableOpacity
} from "react-native-gesture-handler";

export default class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      quantity: 1,
      id : this.props.id,
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
      item.quantity = this.state.quantity;
      item.id = this.state.id;
      this.props.getProduct(item);
  }

  render() {
    return (
      <View style={styles.container && styles.orderItem}>
        <View style={styles.inputRowWrapper}>
          <View style={styles.quantityContainer}>
            <Text style={styles.formText}> <Text style={{color:colors.danger}}>*</Text>What do you want to buy?</Text>
            <TextInput
              style={styles.input}
              placeholder="Maggi, Facewash, Ice-cream etc."
              value={this.state.name}
              onChangeText = {text => {this.setState({name : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
          <View style={styles.quantityContainer}>
          <Text style={styles.quantitylabel}>Quantity</Text>
          <View style={styles.inputRowWrapperCustom}>
          <View style={styles.quantityWrapper}>
          <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={this.state.quantity}
              onChangeText = {number => {this.setState({quantity : number.toString()},() => {
                this.props.getProduct(this.state);
              })}}
            />
            </View>
          </View>
          </View>
        </View>
          <View style={styles.rightBtnWrapper}>
            <Button 
              onPress={() => this.props.removeProduct(this.props.id)}
              type="clear"
              icon={
                <Icon type = "antdesign" name = "delete" color={colors.danger} />
              }
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputBox: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
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

  },
  estAmtWrapper: {
    flex: 1,
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
    padding : 5
  },
});