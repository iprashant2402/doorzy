import {Platform} from 'react-native';
import firebase from 'firebase';
import "firebase/firestore";
import { inject, observer } from 'mobx-react/native';
import sendNotification from './sendNotification';
const orderId = require('uuid/v4');

if (Platform.OS !== "web") {
  window = undefined;
}

export default async function placeOrder(address,couponCode,uid,phone,cart){
console.log(cart);
    let newCart = [];
    cart.forEach(element => {
      newCart.push({
        name: element.name,
        quantity: element.quantity
      })
    });
    const order = {};
    order.uid = uid;
    order.phone = phone;
    order.products = newCart;
    order.active = true;
    order.statusCode = "pending confirmation";
    order.couponCode = couponCode;
    order.regTime = + new Date();
    order.paymentRecieved = false;
    order.address = address;
    order.oid = "1001"+Math.floor(100000 + Math.random() * 900000);
    order.paymentLinkActive = false;
    const title = "Order Placed"
    const content = "Your order with Order Id #"+order.oid+" has been placed successfully and pending confirmation from our delivery executive."
    const db = firebase.firestore();
    await fetch('https://powerful-wave-93367.herokuapp.com/newOrderNotification');
    await db.collection('orders').doc(order.oid.toString()).set(order).then(function(){
      sendNotification(order.uid,content,title);
      return true;
    }).catch(function(err){console.log(err);return false;});


}