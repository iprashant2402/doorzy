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
      brand: "",
      quantity: 1,
      id : this.props.id
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
        this.props.getProduct(item);
    }

  render() {
    return (
      <View style={styles.container&&styles.orderItem}>
        <View style={styles.inputRowWrapper}>
          <View style={styles.leftInputWrapper}>
            <Text style={styles.formText}> What do you want to buy?</Text>
            <TextInput
              style={styles.input}
              placeholder="Maggi, Facewash, Ice-cream etc."
              value={this.state.name}
              onChangeText = {text => {this.setState({name : text},() => {
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
        <View style={styles.inputRowWrapper}>
          <View style={styles.leftInputWrapper}>
          <Text style={styles.formText}> Brand <Text style={styles.txt}>(Optional)</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Lays, Gillete, Marlboro etc."
              value={this.state.brand}
              onChangeText = {text => {this.setState({brand : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
          <View style={styles.rightBtnWrapper}>
          </View>
        </View>
        <View style={styles.inputRowWrapper}>
          <Text style={styles.formText}>Quantity</Text>
        </View>
        <View style={styles.inputRowWrapper}>
          <View style={styles.btnWrapper}>
            <Button
              type="clear"
              buttonStyle={styles.btn}
              icon={
                <Icon
                  type="antdesign"
                  name="minus"
                  color={colors.primary}
                />
              }
              onPress = {()=>this.decrementQuantity()}
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
              onPress= {()=>this.incrementQuantity()}
            />
          </View>
          <View style={styles.btnWrapper}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: colors.greyBorder
  },
  inputWrapper: {
    margin: 10
  },
  inputRowWrapper: {
    flexDirection: "row",
    margin: 10
  },
  btnWrapper: {
    flex: 1
  },
  btn: {
    borderWidth: 0,
    borderColor: colors.primary,
  },
  quantityWrapper: {
    flex: 2,
    justifyContent: "center"
  },
  quantity: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary
  },
  leftInputWrapper: {
    flex: 4
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
    padding : 20
  },
});
