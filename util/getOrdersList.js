import {Platform} from 'react-native';
import firebase from 'firebase';
import "firebase/firestore";
import { inject, observer } from 'mobx-react/native';
const orderId = require('uuid/v4');

if (Platform.OS !== "web") {
  window = undefined;
}

function populateOrdersArray(uid){
    return new Promise(resolve=>{
        const orders = [];
        const ordersRef = firebase.firestore().collection('orders');
        ordersRef.where("uid","==",uid).onSnapshot(function(snap){
            snap.forEach(order => {
                orders.push(order.data());
            });
        }).then(function(){
            resolve(orders);
        });    
    });
}

export default async function getOrdersList(uid){
    const orders = await populateOrdersArray(uid);
    return orders;

}