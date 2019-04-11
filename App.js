import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Login from './app/components/Login/login'
import Landing from './app/components/Dashboard/'
import {createStackNavigator, createAppContainer} from 'react-navigation';

const RootStack = createStackNavigator({
  // login: {
  //   screen: Login,
  //   navigationOptions: {
  //     header: null
  //   }
  // },
  dashboard: {
    screen: Landing,
    navigationOptions: {
      header: null
    }
  }
});
const Container = createAppContainer(RootStack);

export default Container