import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CurrentAlert from './current_alert'
import AlertValidation from './alert_validation'
import {createStackNavigator, createAppContainer} from 'react-navigation';

const Ewi = createStackNavigator({
  current_alert: {
    screen: CurrentAlert,
    navigationOptions: {
      header: null
    }
  },
  alert_validation: {
    screen: AlertValidation,
    navigationOptions: {
      header: null
    }
  }
},{
  transitionConfig: () => ({
    transitionSpec: {
      duration: 0
    }
  })
});
const Container = createAppContainer(Ewi);

export default Container
