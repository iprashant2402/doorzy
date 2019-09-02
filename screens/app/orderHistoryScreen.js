/*
This View is responsible for showing previous orders' history
*/

import React, { Component } from "react";
import { View, Text, Platform,StyleSheet ,ActivityIndicator,TouchableOpacity} from "react-native";
import { inject, observer } from "mobx-react/native";
import firebase from "firebase";
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator
} from "react-navigation";
import { colors } from "../../colors/colors";
import { HeaderComponent } from "../../components/header";
import getOrdersList from '../../util/getOrdersList';
import {Button} from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import { extendObservable } from "mobx";
if (Platform.OS !== "web") {
  window = undefined;
}

@inject("mainStore")
@observer
class OrderHistoryScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      orders : [],
      showIndicator : true
    };
  }

  getNotifDate=(timestamp)=>{
    var d =new Date(timestamp);
    if(d.getHours()>=12)
    return (d.getHours()+':'+d.getMinutes()+ ' PM'+'  '+d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear());
    else 
    return (d.getHours()+':'+d.getMinutes()+ ' AM'+'  '+d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear());
}

  showPaymentLink = (order) => {
    if(order.paymentLinkActive)
    return(<View style={styles.btnWrapper}><Button type="solid" titleStyle={styles.paymentBtn} title="PAY NOW" buttonStyle={styles.paymentBtn}/></View>);
    else
    return(null);
  }

  /*getDeliveryExecNumber = (order) => {
    if(order.deliveryExecId){
      const deliveryExecRef = firebase.firestore().collection('deliveryExecs').doc(order.deliveryExecId);
      deliveryExecRef.get().then(function(doc){
        const exec = doc.data();
        return("+91-"+exec.phone);
      }).catch(err=>console.log(err));
    }else{
      return("Not Assigned");
    }
  }*/

  getItemAmount = (item) => {
    if(item.amount)
    return ("INR "+item.amount);
    else
    return(null);
  }

  getTotal = (order) => {
    if(order.total){
    return (<View style={styles.btnWrapper}>
      <Text style={styles.total}>Order Total : INR {order.total}</Text>
    </View>);
    }
    else 
    return(null);
  }

  getPaymentStatus = (order) => {
    if(order.paymentRecieved){
      return(<View style={styles.btnWrapper}>
        <Text style={styles.activeOrderTitle}>PAID</Text>
      </View>);
    }
  }
  componentDidMount = () => {
    const thisRef = this;
        const ordersRef = firebase.firestore().collection('orders');
        ordersRef.where("uid","==",this.props.mainStore.uid).onSnapshot(function(snap){
          const ordersArray = [];
            snap.forEach(order => {
                ordersArray.push(order.data());
            });
            thisRef.setState({
              orders : ordersArray.sort(function(x, y) {
                return y.regTime - x.regTime;
              })
            },()=>{
              console.log("CALLBACK OF setState");
              console.log(thisRef.state.orders);
              thisRef.setState({showIndicator:false});
            });
        });
  }
  render() {

    ordersList = this.state.orders.map((l,i)=>(
      <TouchableOpacity
          style={
            l.active 
              ? styles.activeOrder
              : styles.orderItem
          }
          onPress={() => console.log(l.oid)}
        >
         <View style={styles.orderTitleWrapper}>
          <Text style={l.active?styles.activeOrderTitle:styles.orderTitle}>ORDER # {l.oid}</Text>
         </View>
         <View style={styles.productList}>
           {l.products.map((p,j)=>(
             <Text style={styles.productItem}>
               {p.brand} {p.name} x {p.quantity} <Text style={{fontFamily : 'Rubik-Bold'}}>{this.getItemAmount(p)}</Text>
             </Text>
           ))}
         </View>
         {this.getTotal(l)}
         <View style={styles.timeWrapper}>
            <Text style={styles.status}>STATUS : {l.statusCode}</Text>
         </View>
         {this.showPaymentLink(l)} 
         {this.getPaymentStatus(l)}
         <View style={styles.timeWrapper}>
           <Text style={styles.time}>Placed at : {this.getNotifDate(l.regTime)}</Text>
         </View>
        </TouchableOpacity>
    ));
    return (
      <View style={styles.container}>
        <HeaderComponent title="Home" navigation={this.props.navigation} />
        <ActivityIndicator animating={this.state.showIndicator} size="large" color={colors.primary} />
        <ScrollView>
          <View style={styles.h1Wrapper}>
            <Text style={styles.h1}>Your Orders</Text>
          </View>
          {ordersList}
        </ScrollView>
      </View>
    );
  }
}

export const OrderHistoryScreenNavigator = createStackNavigator(
  {
    OrderHistory: OrderHistoryScreen
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
  headerLeftButton : {
    padding : 5
  },
  container : {
    flex : 1,
    backgroundColor : colors.greyBackground,
  },
  h1Wrapper : {
    padding : 20,

  },
  btnWrapper: {
    paddingHorizontal : 20,
    paddingVertical : 10
  },
  paymentBtn : {
    backgroundColor : colors.primary,
    borderRadius : 0 
  },
  timeWrapper : {
    paddingHorizontal : 20,
    paddingVertical : 5
  },
  time : {
    fontFamily : 'Rubik-Regular',
    fontSize : 12,
    color : colors.text
  },
  h1 : {
    fontFamily : 'Rubik-Bold',
    fontSize : 15,
    color : colors.text
  },
  activeOrder : {
    marginBottom : 10,
    backgroundColor : colors.white,
    paddingVertical : 20
  },
  orderItem : {
    marginBottom : 10,
    backgroundColor : colors.white,
    paddingVertical : 20
  },
  orderTitleWrapper : {
    paddingHorizontal : 20,
    marginBottom : 10
  },
  activeOrderTitle : {
    fontFamily : 'Rubik-Regular',
    fontSize : 15,
    color : colors.successButton
  },
  total : {
    fontSize : 20,
    fontFamily : 'Rubik-Bold',
    color : colors.text
  },
  orderTitle : {
    fontFamily : 'Rubik-Regular',
    fontSize : 15,
    color : colors.primary},
  productList : {
    paddingHorizontal : 20
  },
  productItem : {
    fontFamily : 'Rubik-Regular',
    fontSize : 12,
    color : colors.text
  },
  status : {
    textTransform : 'uppercase',
    fontSize : 12,
    color : colors.primary,
    fontFamily : 'Rubik-Bold'
  }     
});
