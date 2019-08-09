import React,{Component} from 'react';
import { StyleSheet, Text, View, FlatList ,Button} from 'react-native';
import {observer,inject} from 'mobx-react';//import {mainStore} from './stores/mainStore';
import {Provider} from 'mobx-react';
import firebase from 'firebase';
import {Routes} from './routes/routes.js';
import {mainStore} from './stores/mainStore';
import {firebaseConfig} from './firebase/firebaseConfig';
firebase.initializeApp(firebaseConfig);

export default class App extends Component {

render(){
  return(
  <Provider mainStore={mainStore}>
  <Routes/>
  </Provider>
);
}

}
