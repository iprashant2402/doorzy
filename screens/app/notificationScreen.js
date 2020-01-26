import React,{Component} from 'react';
import { inject, observer } from 'mobx-react/native';
import {Text,ScrollView,View,StyleSheet,Platform} from 'react-native';
import {colors} from '../../colors/colors';
import {Button,ListItem,Divider,Icon} from 'react-native-elements';
import firebase from 'firebase';
import 'firebase/firestore';
import NotificationItem from '../../components/notificationItem';
import * as Segment from "expo-analytics-segment";

if (Platform.OS !== 'web') {
  window = undefined
}

@inject('mainStore')
@observer
export default class NotificationsScreen extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    Segment.screen("Notifications Screen");
  }

  getNotifDate=(timestamp)=>{
      var d =new Date(timestamp);
      return (d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()+'  '+d.getHours()+':'+d.getMinutes());
  }

  markAllAsRead=(uid)=>{
    const db = firebase.firestore();
    const batch = db.batch();
    const ref = db.collection("notifications").doc(uid).collection("notifs");
    //batch.commit().then(function(){console.log("SUCCESS MARKED READ")});
    this.props.mainStore.notifications.forEach(function(item){
      var docRef = ref.doc(item.id);
      docRef.update({"read" : true});
    });
  }
  render(){
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerButtonContainer}>
            <Button type="clear" icon={<Icon
                name="arrowleft"
                type="antdesign"
                size={18}
                color={colors.white}
                />} onPress={()=>this.props.navigation.goBack()}
             />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>NOTIFICATIONS</Text>
          </View>
        </View>
        <Divider style={{height:10,backgroundColor:colors.white}}/>
        <Button type='clear' titleStyle={styles.btnTitle} title="Mark all as read" onPress={()=>this.markAllAsRead(this.props.mainStore.uid)}/>
        <ScrollView>
        {
          this.props.mainStore.notifications.map((l, i) => (
            <NotificationItem
            key={i}
            title={l.title}
            time={this.getNotifDate(l.timestamp)}
            disabled = {l.read}
            content = {l.content}
            />
          ))
        }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor : colors.white
  },
  header:{
    flexDirection : 'row',
    padding : 10,
    backgroundColor : colors.brandPrimary
  },
  headerButtonContainer : {
    padding : 10
  },
  titleContainer : {
    padding : 20
  },
  title : {
    fontFamily : 'Rubik-Regular',
    fontSize : 18,
    color : colors.white
  },
  contentStyle:{
    padding : 5
  },
  btnTitle : {
      color : colors.successButton
  }
});
