import {Platform} from 'react-native';
import firebase from 'firebase';
import "firebase/firestore";

if (Platform.OS !== "web") {
  window = undefined;
}

export default function removeAddress(id,uid,addressArray){
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(uid);

    userRef.update({
        addresses : addressArray.filter(address => address.id !== id)
    }).catch(err => console.log(err));
}