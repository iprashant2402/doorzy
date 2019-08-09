import React,{Component} from 'react';
import {Alert,StyleSheet,Text,View,TextInput,TouchableOpacity} from 'react-native';
import {colors} from '../colors/colors';
import {SearchBar} from 'react-native-elements';

export class BackgroundBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      showSearchBarLoading : false
    }
  }
  render(){
    return(
      <View style={styles.container}>
      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Search')}}>
      <SearchBar pointerEvents="none" onTouchStart={()=>{this.props.navigation.navigate('Search')}} containerStyle={styles.searchBoxContainer} inputContainerStyle={styles.searchbar} platform="android" showLoading={this.state.showSearchBarLoading} placeholder="Search Products"/>
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    justifyContent : 'center',
    padding : 15,
    backgroundColor : colors.greyBackground,
  },
  searchbar : {
    backgroundColor : colors.white,
  },
  searchBoxContainer : {

  }
});
