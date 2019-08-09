/*
This View is responsible for showing previous orders' history
*/ 

import React, { Component } from 'react';
import {View,Text,Platform,StyleSheet,Keyboard,SafeAreaView,ScrollView,KeyboardAvoidingView,TouchableWithoutFeedback} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import firebase from 'firebase';
import { createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator} from 'react-navigation';
import {colors} from '../../colors/colors';
import {HeaderComponent} from '../../components/header';
import ChatBox from '../../components/chatBox';
import { Header }from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';

if (Platform.OS !== 'web') {
    window = undefined
  }

@inject('mainStore')
@observer
class HelpScreen extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      issues : []
    }
  }

  getAllIssues = () => {
    const db = firebase.firestore();
    const messagesRef = db.collection('chat').doc(this.props.mainStore.uid).collection('messages');
    const thisRef = this;
    messagesRef.get().then(function(snap){
      var issues = [];
      snap.forEach(function(doc){
        issues.push(doc.data());
      });
      thisRef.setState({issues : issues});
    }).catch(err=>console.log(err));
  }

  componentDidMount(){
    this.getAllIssues();
  }
  
  render() {
    if(this.state.issues.length>=1){
      console.log(this.state.issues);
      issuesList = this.state.issues.map((l,i)=>(
        <Text>{l.content}</Text>
      ));
    }
    else{
      issuesList = <View></View>
    }
        return (
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                <HeaderComponent title="Home" navigation={this.props.navigation} />
                <View style={{paddingHorizontal : 20,paddingTop : 20}}>
                  <Text style={{fontFamily:'Rubik-Bold',fontSize:18}}>
                    How can we help you?
                  </Text>
                </View>
                <ScrollView contentContainerStyle={{paddingTop : 10}}>
                <ChatBox style={styles.chatBox}/>
                </ScrollView>
              </View>
               </TouchableWithoutFeedback>
            
        )
    }
}

export const HelpScreenNavigator = createStackNavigator({
    Help : HelpScreen
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
    });

    const styles = StyleSheet.create({
        headerLeftButton : {
          padding : 5
        },
        inner : {
          flex : 1,
        },
        container : {
          flex : 1,
          backgroundColor : colors.white,
        },
        chatBox : {
          marginTop : 50
        }
      });
    