import { Icon } from 'native-base';
import React, { Component } from 'react';
import { ToastAndroid, View } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import Storage from '../../utils/storage';

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

  componentDidMount(){
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
