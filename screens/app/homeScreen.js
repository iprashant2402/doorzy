/*
This View is responsible for displaying form to take user inputs for placing order 
e.g. what product? which brand? quantity? ....
*/ 

import React, { Component } from 'react';
import {View,Text,Platform,StyleSheet,ScrollView} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import firebase from 'firebase';
import { createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator} from 'react-navigation';
import {colors} from '../../colors/colors';
import {HeaderComponent} from '../../components/header';
import ProductForm from '../../components/productForm';
import {Button} from 'react-native-elements';
import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const productId = require('uuid/v4');
if (Platform.OS !== 'web') {
    window = undefined
  }

@inject('mainStore')
@observer
class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      products : [{name : '', brand : '', quantity : 1, id : productId()}],
      time : 10
    };
  }
    onSignOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (e) {
            console.warn(e)
        }
    }

    addProduct = () => {
      const newProduct = {name:'',brand:'',quantity:1,id : productId()};
      this.setState((prevState)=>({
        products : [...prevState.products,newProduct]
      }));
      console.log(this.state.time);
    }

    removeProduct = (id) => {
      this.setState({
        products : this.state.products.filter(product => product.id !== id)
      });
    }

    getProduct = (product) => {
      console.log(product);
      const tempArray = this.state.products;
      tempArray.map((p)=>{
        if(p.id===product.id){
          p.name = product.name;
          p.brand = product.brand;
          p.quantity = product.quantity;
        }else{
          p = p;
        }
      });
      this.setState({
        products : tempArray
      });
    }

    addToCart = (products) => {
      this.props.mainStore.setCart(products);
      console.log("HOMESCREEN:"+this.props.mainStore.cartCount);
      this.props.navigation.navigate('CartScreen');
    }

    getCurrentTime = () => {
      var d = new Date(+ new Date);
      var hours = d.getHours();
      console.log(hours);
      return hours;
    }

    handleSubmit = () => {
      const products = this.state.products.filter(product => product.name !== '');
      this.addToCart(products);
    }

    componentDidMount(){
      this.setState({
        time : this.getCurrentTime()
      });
    }

    render() {
      if(this.state.time>23 || this.state.time<9){  
      addProductForm = 
      <View style={{marginTop:30,height:300,justifyContent:"center",alignItems:'center'}}>
        <Text style={styles.text1}>Sorry, we do not deliver at this time.</Text>
        <Text style={styles.text1}>Operational Hours - 9:00 AM to 11:00 PM</Text>
      </View>
      }
      else{
        addProductForm = this.state.products.map((l,i) => (
          <ProductForm id={l.id} removeProduct={this.removeProduct} getProduct={this.getProduct}/>
        ));
      }
        return (
          <View style={styles.container}>
          <HeaderComponent title="Home" navigation={this.props.navigation} />
          <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={50}>
          <ScrollView>
            {addProductForm}
            <View style={styles.btnWrapper}>
              <Button disabled={(this.state.time>23 || this.state.time<9)?true:false} title="ADD MORE ITEMS" onPress={()=>this.addProduct()} buttonStyle={styles.btn} titleStyle={styles.btnTitle} type="clear"/>
            </View>
          </ScrollView>
          </KeyboardAwareScrollView>
          <Button disabled={(this.state.time>23 || this.state.time<9)?true:false} title="PROCEED TO CART" buttonStyle={styles.orderbtn} type='solid' onPress={()=>this.handleSubmit()}/>
          </View>
        )
    }
}

export const HomeScreenNavigator = createStackNavigator({
    Home : HomeScreen,
  },{
    headerMode : 'none',
    mode : 'modal',
    defaultNavigationOptions : {
      headerStyle : {
        borderBottomWidth: 0,
            shadowOpacity: 0,
            shadowOffset: {
                  height: 0,
                },
            shadowRadius: 0,
            elevation: 0,
            backgroundColor : colors.brandPrimary
      },
      headerTintColor : colors.white,
      headerTitleStyle : {
        fontFamily : 'Rubik-Regular',
        textAlign : 'center'
      }
    }
    }
  
  );

  const styles = StyleSheet.create({
    headerLeftButton : {
      padding : 5
    },
    text1:{
      fontFamily : 'Rubik-Bold',
      fontSize : 15,
      color : colors.text,
      margin : 5
    },
    container : {
      flex : 1,
      backgroundColor : colors.greyBackground,
    },
    orderbtn : {
      backgroundColor : colors.brandPrimary,
      borderRadius : 0,
      height : 50
    },
    btn : {
      ///borderWidth : 2,
      ///borderColor : colors.primarySupport
    },
    btnTitle : {
      color : colors.successButton
    },
    btnWrapper : {
      padding : 20,
      marginTop : 10
    }
  });
