import {Platform} from 'react-native';
import firebase from 'firebase';
import "firebase/firestore";
const notifId = require('uuid/v4');

if (Platform.OS !== "web") {
  window = undefined;
}

export default async function sendNotification(uid,content,title){
    const db = firebase.firestore();
    var nid = notifId();
    var notifBucket = db.collection('notifications').doc(uid).collection('notifs');

    await notifBucket.doc(nid).set({
        id : nid,
        timestamp : + new Date(),
        read : false,
        content : content,
        title : title
      }).catch(function(err){
        console.log(err);
      });

}