import React,{Component} from 'react';
import {colors} from '../colors/colors';
import {Header,Button,withBadge} from 'react-native-elements';
import {StyleSheet,View,Image,Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {observer,inject} from 'mobx-react/native';

@inject('mainStore')
@observer
export class HeaderComponent extends Component{

  render(){
    const BadgeIcon = withBadge(this.props.mainStore.notificationCount,{
      status : 'warning'
    })(Icon);
    const CartIcon = withBadge(this.props.mainStore.cartCount,{
      status : 'warning'
    })(Icon);
    const cartIconWithBadge = <CartIcon name="shopping-cart" size={23} color="white"/>;
    const cartIconWithoutBadge = <Icon name="shopping-cart" size={23} color="white"/>;
    const cartButtonIcon = (this.props.mainStore.cartCount==0) ? cartIconWithoutBadge : cartIconWithBadge;
    if(this.props.mainStore.notificationCount == 0){
      return(
        <Header
        backgroundColor = {colors.brandPrimary}
        leftComponent = {<Button type="clear" icon={<Icon
        name="bars"
        size={23}
        color="white"
      />} onPress={()=>this.props.navigation.toggleDrawer()} />
        }
        centerComponent = {<View><Text style={styles.logoTextPrimary}>Vire<Text style={styles.logoTextSecondary}>Store</Text></Text></View>}
        rightComponent = {<View style={{flexDirection:'row'}}>
          <Button type="clear" title="Offers" titleStyle={styles.btnTitle} onPress={()=>this.props.navigation.navigate('OfferScreen')} />
        <Button type="clear" icon={<Icon
        name="bell"
        size={23}
        color="white"
      />} onPress={()=>this.props.navigation.navigate("NotificationScreen")}/></View>
        }
        />
      );
    }
    else{
      return(
        <Header
        containerStyle = {styles.container}
        backgroundColor = {colors.brandPrimary}
        leftComponent = {<Button type="clear" icon={<Icon
        name="bars"
        size={23}
        color="white"
      />} onPress={()=>this.props.navigation.toggleDrawer()} />
        }
        centerComponent = {<View><Text style={styles.logoTextPrimary}>Vire<Text style={styles.logoTextSecondary}>Store</Text></Text></View>}
        rightComponent = {<View style={{flexDirection:'row'}}>
          <Button type="clear" title="Offers" titleStyle={styles.btnTitle} onPress={()=>this.props.navigation.navigate('OfferScreen')} />
        <Button type="clear" icon={<BadgeIcon
        name="bell"
        size={23}
        color="white"
      />} onPress={()=>this.props.navigation.navigate("NotificationScreen")}/></View>
        }
        />
      );
    }
  }
}

const styles = StyleSheet.create({
container : {
  marginBottom : 0,
  borderBottomWidth : 0,
  paddingBottom : 0
},
logoTextPrimary : {
  color : colors.white,
  fontFamily : 'josephine'
},
logoTextSecondary : {
  color : colors.brandSecondary,
  fontFamily : 'josephine'
},
btnTitle : {
  fontSize : 15,
  color : colors.white
}
});
