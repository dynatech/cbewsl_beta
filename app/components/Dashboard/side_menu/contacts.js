import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { Header, Left, Icon } from 'native-base';
import Notification from '../../utils/alert_notification'

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="person" style={{ fontSize: 24, color: tintColor }}></Icon>
    )
  };

  componentDidMount() {
    Notification.endOfValidity();
  }

  render() {
    return (
      <View style={defaults.container}>
        <View style={defaults.heading}>
          <Icon name="home" onPress={() => this.props.navigation.openDrawer()} />
        </View>
      </View>
    );
  }
}
