import React, { Component } from 'react';
import Storage from '../../utils/storage'
import { View, ToastAndroid } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { Header, Left, Icon } from 'native-base';

export default class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
        <Icon name="arrow-back" style={{fontSize: 24, color: tintColor}}></Icon>
    )
  };

  componentWillMount(){
    Storage.removeItem("loginCredentials");
    ToastAndroid.show('Logout successfully!', ToastAndroid.SHORT);
    this.props.navigation.navigate('login');
  }

  render() {
    return (
      <View style={defaults.container}>
      </View>
    );
  }
}
