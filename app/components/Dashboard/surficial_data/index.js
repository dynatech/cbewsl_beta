import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Summary from './summary'
import CurrentMeasurement from './current_measurement'
import MonitoringLogs from './monitoring_logs.js'
import {createStackNavigator, createAppContainer} from 'react-navigation';

const SensorMaintenance = createStackNavigator({
  summary: {
    screen: Summary,
    navigationOptions: {
      header: null
    }
  },
  current_measurement: {
    screen: CurrentMeasurement,
    navigationOptions: {
      header: null
    }
  },
  monitoring_logs: {
    screen: MonitoringLogs,
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
const Container = createAppContainer(SensorMaintenance);

export default Container
