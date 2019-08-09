/*
This View is responsible for showing account details
*/

import React, { Component } from "react";
import { View, Platform, StyleSheet } from "react-native";
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
import {
  Button,
  Card,
  ListItem,
  Divider,
  Avatar,
  Overlay,
  Input,
  Text
} from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import AddressItem from '../../components/addressItem';



if (Platform.OS !== "web") {
  window = undefined;
}

@inject("mainStore")
@observer
class MyAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleEditPhone: false,
      phone: "",
      errorMessage: ""
    };
  }

  render() {
      const user = this.props.mainStore.user;
      if(user.addresses){
          addressComponent = user.addresses.map((l,i)=>(
              <AddressItem address={l} uid={this.props.mainStore.uid} addressArray={user.addresses}/>
          ));
      }
      else{
          addressComponent = <Text>Address Not Present</Text>
      }
    return (
      <View style={styles.container}>
        <HeaderComponent title="Home" navigation={this.props.navigation} />
        <ScrollView>
          <Divider style={{ backgroundColor: "transparent", height: 20 }} />
          <View style={styles.cardWrapper}>
            <View style={styles.backgroundBox}>
              <View style={styles.avatarContainer}>
                <Avatar
                  placeholderStyle={{ backgroundColor: "#446DF6" }}
                  rounded
                  title={user.fname[0] + user.lname[0]}
                  size="xlarge"
                />
              </View>
              <View style={styles.avatarContainer}>
                <Text style={styles.itemTitle}>
                  {user.fname} {user.lname}
                </Text>
              </View>
            </View>
          </View>
          <Divider style={{ backgroundColor: "transparent", height: 20 }} />
          <View style={styles.cardWrapper}>
          <ListItem key="phone" title={user.phone} leftIcon={{ name: "call",color:colors.brandPrimary }}/>
          {/*<ListItem key="offers" title="Offers and Coupons" leftIcon={{ name: "card-giftcard",color:colors.successButton }} chevron/>*/}
          </View>
          <Divider style={{ backgroundColor: "transparent", height: 20 }} />
          <View style={styles.cardWrapper}>
            <Text h4>Saved Addresses</Text>
            {addressComponent}
            {/*<Button title='ADD NEW ADDRESS' onPress={()=>{this.props.mainStore.setRoute("MyAccountScreen");console.log(this.props.mainStore.route);this.props.navigation.navigate('AddLocationScreen')}} buttonStyle={{marginTop : 20,borderColor:colors.successButton}} type='outline' icon={{name:'add-location',color:colors.successButton}} titleStyle={{color:colors.successButton}}/>*/}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export const MyAccountScreenNavigator = createStackNavigator(
  {
    MyAccount: MyAccountScreen
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
  headerLeftButton: {
    padding: 5
  },
  boxTitle: {
    fontSize: 30,
    fontFamily: "Rubik-Regular",
    textAlign: "center",
    color: colors.primarySupport
  },
  cardWrapper: {
    padding: 15,
    //borderRadius : 3,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor : colors.greyBorder
  },
  container: {
    flex: 1,
    backgroundColor: colors.greyBackground
  },
  backgroundBox: {
    backgroundColor: colors.white,
    padding: 10,
    justifyContent: "center",
    textAlign: "center"
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10
  },
  dividerStyle: {
    backgroundColor: "transparent"
  },
  listItemWrapper: {
    flexDirection: "row",
    padding: 10
  },
  itemText: {
    //fontFamily: "Rubik-Regular",
    textAlign: "center",
    fontSize: 15,
    color: colors.placeholder
  },
  itemTitle: {
    //fontFamily: "josephine",
    color: '#331a4b',
    fontSize: 25
  },
  nameTitle: {
    fontSize: 25,
    fontFamily: "josephine",
    textAlign: "center",
    color: colors.white
  },
  overlayText: {
    fontFamily: "montserrat",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center"
  },
  centeredRow: {
    justifyContent: "center",
    flexDirection: "row"
  }
});
