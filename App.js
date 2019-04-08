import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Login from './app/components/Login/login'
import MainDashboard from './app/components/Dashboard/'
import {createStackNavigator, createAppContainer} from 'react-navigation';

const RootStack = createStackNavigator({
  login: Login,
  dashboard: MainDashboard
});
const Container = createAppContainer(RootStack);

export default Container