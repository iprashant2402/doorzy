import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card, Icon} from "react-native-elements";
import {colors} from '../colors/colors';
import removeAddress from '../util/removeAddress';
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

function AddButton({quantity, addProduct, product}){
   return(
    <Button
    title="Add"
    type="outline"
    buttonStyle={styles.greenOutline}
    titleStyle={styles.btnOutlineTitle}
    onPress={()=>{addProduct(product)}}
  />
  );
}

function QuantityButton({quantity, alterQuantity, product}) {
  return(
  <View style={styles.inputRowWrapperCustom}>
    <View style={styles.btnWrapper}>
      <Button
        type="clear"
        buttonStyle={styles.btn}
        icon={<Icon type="antdesign" name="minus" color={colors.primary} />}
        onPress={()=>{alterQuantity(product, false)}}
      />
    </View>
    <View style={styles.quantityWrapper}>
      <Text style={styles.quantity}>{quantity}</Text>
    </View>
    <View style={styles.btnWrapper}>
      <Button
        type="clear"
        buttonStyle={styles.btn}
        icon={{ name: "add", color: colors.primary }}
        onPress={()=>{alterQuantity(product, true)}}
      />
    </View>
  </View>
  );
}

export default class FoodItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            name : this.props.item.name,
            veg : this.props.item.veg,
            quantity : this.props.item.quantity,
            cost : this.props.item.cost,
            id : this.props.item.id,
            active : this.props.item.active
        }
    }

    render(){
    return (
        <View style={styles.panel}>
        <View style={styles.itemRow}>
          <View style={styles.leftWrapper}>
            <Icon
              type="material-community"
              name="checkbox-intermediate"
              color={this.state.veg ? colors.successButton : colors.danger}
            />
            <Text style={styles.itemName}>{this.state.name}</Text>
          </View>
          {(this.state.active)? <View style={styles.rightWrapper}>
            {(this.state.quantity===0)?<AddButton addProduct={this.props.addProductToArray} product={this.state} quantity={this.state.quantity}/>:<QuantityButton quantity={this.state.quantity} product={this.state} alterQuantity={this.props.alterQuantity}/>}
          </View> : <View><Text style={styles.redText}>Unavailable</Text></View>}
        </View>
        <Text style={styles.itemCost}>Rs.{this.state.cost}</Text>
      </View>
    );
    }
  
}

const styles = StyleSheet.create({
      btnOutlineTitle: {
        color: colors.successButton
      },
      quantity: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: colors.primary
      },
      redText: {
        color: colors.danger
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
        fontSize: 18,
        flex : 1,
        flexWrap: 'wrap'
      },
      itemCost: {
        fontSize: 15,
        color: colors.primary
      },
      panel: {
        marginBottom: 10,
        backgroundColor: colors.white,
        padding: 10
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
        textAlign : 'center',
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
