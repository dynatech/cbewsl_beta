import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Summary from './summary'
import SensorStatus from './sensor_status'
import MaintenanceLogs from './maintenance_logs'
import {createStackNavigator, createAppContainer} from 'react-navigation';

const SensorMaintenance = createStackNavigator({
  summary: {
    screen: Summary,
    navigationOptions: {
      header: null
    }
  },
  sensor_status: {
    screen: SensorStatus,
    navigationOptions: {
      header: null
    }
  },
  maintenance_logs: {
    screen: MaintenanceLogs,
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
