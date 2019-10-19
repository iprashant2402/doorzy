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
      <View style={styles.container&&styles.orderItem}>
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
          {/*<View style={styles.btnWrapper}>
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
            </View>*/}
          <View style={styles.quantityWrapper}>
          <TextInput
              style={styles.input}
              value={this.state.quantity}
              onChangeText = {text => {this.setState({quantity : number},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
          <View style={styles.btnWrapper}>
          <Button 
              onPress={() => this.props.removeProduct(this.props.id)}
              type="clear"
              icon={
                <Icon type
                ="antdesign" name="plus" color={colors.danger} />
              }
            />
            <Button 
              onPress={() => this.props.removeProduct(this.props.id)}
              type="clear"
              icon={
                <Icon type
                ="antdesign" name="minus" color={colors.danger} />
              }
            />
            {/*<Button
              type="clear"
              buttonStyle={styles.btn}
              icon={{ name: "add", color: colors.primary }}
              onPress= {()=>this.incrementQuantity()}
            />*/}
            </View>
          </View>
          </View>
        </View>
        {/*<View style={styles.inputRowWrapper}>
          <View style={styles.quantityContainer}>
          <Text style={styles.formText}> Brand <Text style={styles.txt}></Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Lays, Gillete, Marlboro etc."
              value={this.state.brand}
              onChangeText = {text => {this.setState({brand : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
          <View style={styles.quantityContainer}>
          <Text style={styles.formText}> Preferred Shop <Text style={styles.txt}></Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Tara Maa, All Mart, Limra etc."
              value={this.state.preferredShop}
              onChangeText = {text => {this.setState({preferredShop : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
          </View>
            </View>*/}
        <View style={styles.inputRowWrapper}>
          {/*<View style={styles.quantityWrapper}>
        <Text style={styles.formText}>Quantity</Text>
          <View style={styles.inputRowWrapperCustom}>
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
          </View>
            </View>*/}
          {/*<View style={styles.estAmtWrapper}>
          <Text style={styles.formText}> Estimated Cost</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="0.00 Cost per Item"
              keyboardType="numeric"
              value={this.state.estAmt}
              onChangeText = {text => {this.setState({estAmt : text},() => {
                this.props.getProduct(this.state);
              })}}
            />
            </View>*/}
          <View style={styles.rightBtnWrapper}>
            <Button 
              onPress={() => this.props.removeProduct(this.props.id)}
              type="clear"
              icon={
                <Icon type
                ="antdesign" name="plus" color={colors.danger} />
              }
            />
            <Button 
              onPress={() => this.props.removeProduct(this.props.id)}
              type="clear"
              icon={
                <Icon type
                ="antdesign" name="minus" color={colors.danger} />
              }
            />
          </View>
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
    padding : 0.5
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
    padding : 5
  },
});
