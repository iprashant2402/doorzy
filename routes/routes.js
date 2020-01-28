import React,{Component} from 'react';
import * as Font from 'expo-font';
import * as Expo from 'expo';
import firebase from 'firebase';
import LoginScreen from '../screens/auth/loginScreen';
import {HomeScreenNavigator} from '../screens/app/homeScreen';
import {OrderHistoryScreenNavigator} from '../screens/app/orderHistoryScreen';
import {MyAccountScreenNavigator} from '../screens/app/accountScreen';
import {HelpScreenNavigator} from '../screens/app/helpScreen';
import NotificationScreen from '../screens/app/notificationScreen';
import AuthLoading from '../screens/auth/authLoading';
import {SideBar} from '../screens/app/sidebar';
import {RegisterScreenNavigator} from '../screens/app/firstTimeSignIn';
import AddLocationScreen from '../screens/app/addLocationScreen';
import CartScreen from '../screens/app/cartScreen';
import ShareScreen from '../screens/app/shareScreen';
import {OfferScreenNavigator} from '../screens/app/offerScreen';
import {OutletMenuScreenNavigator} from '../screens/app/outletDetails';
import { createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator} from 'react-navigation';
import { inject } from 'mobx-react';

const AppNavigator = createDrawerNavigator({
  HomeScreen : {screen : HomeScreenNavigator, navigationOptions : {
    drawerLabel : 'Home'
  }},
  OrderHistoryScreen :  {screen : OrderHistoryScreenNavigator, navigationOptions : {
    drawerLabel : 'Orders'
  }},
  MyAccountScreen :  {screen : MyAccountScreenNavigator, navigationOptions : {
    drawerLabel : 'Your Account'
  }},
  CustomerCareScreen :  {screen : HelpScreenNavigator, navigationOptions : {
    drawerLabel : 'Customer Service'
  }},
  NotificationScreen : NotificationScreen,
  AddLocationScreen : AddLocationScreen,
  CartScreen : CartScreen,
  ShareScreen : ShareScreen,
  OfferScreen : OfferScreenNavigator,
  OutletMenuScreen : OutletMenuScreenNavigator 
},{
  contentComponent : SideBar,
  hideStatusBar : true
}
);

const RegisterScreenMainNavigator = createStackNavigator({
  RegisterScreen :  {screen : RegisterScreenNavigator}
},
  {
    initialRouteName : 'RegisterScreen',
    headerMode : 'none',
    navigationOptions : {
        headerVisible : false
    } 
  }
);

const AuthLoadingNavigator = createStackNavigator({
  AuthLoading : AuthLoading
},
{
  headerMode : 'none',
  navigationOptions : {
      headerVisible : false
  } 
});

const AuthNavigator = createStackNavigator({
  SignIn : LoginScreen
},
{
  initialRouteName : 'SignIn',
  headerMode : 'none',
  navigationOptions : {
      headerVisible : false
  }
});

const RootNavigator = createSwitchNavigator({
  AuthLoading : AuthLoadingNavigator,
  App : AppNavigator,
  Auth : AuthNavigator,
  Register : RegisterScreenMainNavigator
},
{
  initialRouteName : 'AuthLoading'
});

const AppContainer = createAppContainer(RootNavigator);

export class Routes extends Component{

  constructor(){
        super();
        this.state = {
          isFontReady : false,
        };
      }

      async componentWillMount(){
        await Font.loadAsync({
          'Rubik-Regular': require('../assets/fonts/Rubik/Rubik-Regular.ttf'),
          'montserrat' : require('../assets/fonts/Montserrat/Montserrat-Regular.ttf'),
          'rubicon-icon-font' : require('../assets/fonts/rubicon-icon-font.ttf'),
          'russo' : require('../assets/fonts/RussoOne-Regular.ttf'),
          'josephine' : require('../assets/fonts/Josefin_Sans/JosefinSans-Bold.ttf'),
          'Rubik-Bold' : require('../assets/fonts/Rubik/Rubik-Medium.ttf')
        });

        this.setState({
          isFontReady : true,
        });
      }
      

  render() {
        if(!this.state.isFontReady){
          return <Expo.AppLoading/>
        }
        return (
            <AppContainer/>
          );
      }
}
