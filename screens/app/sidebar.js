import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View,StyleSheet,Share,Alert} from 'react-native';
import {colors} from '../../colors/colors';
import {Button,Badge,Divider,withBadge} from 'react-native-elements';
import firebase from 'firebase';
import 'firebase/firestore';
import {observer,inject} from 'mobx-react/native';

@inject('mainStore')
@observer
export class SideBar extends Component {
constructor(props){
    super(props);
}
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  handleSignOut = () => {
    const rootRef = this;
    firebase.auth().signOut().then(function(){
      rootRef.props.navigation.navigate('AuthLoading');
    }).catch(function(e){
      console.log(e);
    });
  }

  openShareDialog = async () => {
    try {
      const result = await Share.share({
        message: 'Hey there! Download the doorzy app from playstore and use invite code '+this.props.mainStore.user.inviteCode+' to get everything delivered to your doorstep.',
      });
      console.log(result);
      if (result.action === Share.sharedAction) {
        console.log("GREAT")
      } else if (result.action === Share.dismissedAction) {
        // dismissed  
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  render () {
    return (
      <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Hello, <Text style={{color:colors.brandSecondary}}>{this.props.mainStore.user.fname}</Text></Text>
      </View>
        <ScrollView>
          <View>
              <View style={styles.navSectionStyle}>
              <View style={styles.navItemContainer}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
                Home
              </Text>
              </View>
              <View style={styles.navItemContainer}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('OrderHistory')}>
                My Orders
              </Text>
              </View>
              <Divider style={{height : 1, backgroundColor : '#e6e6e6'}}/>
              <View style={styles.navItemContainer}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('MyAccount')}>
                Your account
              </Text>
              </View>
              <View style={styles.navItemContainer}>
              <Text style={styles.navItemStyle} onPress={()=>this.openShareDialog()}>
                Invite Friends
              </Text>
              </View>
              <View style={styles.navItemContainer}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Help')}>
                Help
              </Text>
              </View>
              </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Button title="Logout" type="solid" buttonStyle={styles.button} titleStyle={{color:colors.white}} onPress={()=>this.handleSignOut()}/>
    </View>
      </View>
    );
  }
}

SideBar.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navItemContainer:{
    padding : 10,
  },
  button:{
    backgroundColor : colors.brandPrimary
  },
  navItemStyle: {
    padding: 10,
    backgroundColor : colors.white,
    fontFamily : 'Rubik-Regular'
  },
  navSectionStyle: {
    backgroundColor: colors.white
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  footerContainer: {
    padding: 20,
    backgroundColor: colors.brandPrimary,
  },
  headerContainer : {
    backgroundColor : colors.brandPrimary,
    padding : 10,
    height : 60,
    justifyContent : 'center'
  },
  headerTitle : {
    color : colors.white,
    fontFamily : 'montserrat',
    textAlign : 'center',
    fontSize : 20
  }
});
