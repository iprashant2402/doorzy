import {Platform} from 'react-native';
import firebase from 'firebase';
import "firebase/firestore";
import sendNotification from './sendNotification';

if (Platform.OS !== "web") {
  window = undefined;
}

export default function addAddress(uid,address){
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(uid);
    const content = "You have successfully added a new address under the label "+address.label;
    const title = "New Address Added";
    
    userRef.update({
        addresses : firebase.firestore.FieldValue.arrayUnion(address)
    }).then(function(){
        sendNotification(uid,content,title);
    }).catch(err => console.log(err));


}