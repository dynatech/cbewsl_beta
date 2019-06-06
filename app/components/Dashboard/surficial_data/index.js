import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Summary from './summary'
import CurrentMeasurement from './current_measurement'
import MonitoringLogs from './monitoring_logs.js'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import SaveSurficialData from './save_surficial_data';

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
  },
  save_surficial_data: {
    screen: SaveSurficialData,
    navigationOptions: {
      header: null
    }
  }
}, {
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0
      }
    })
  });
const Container = createAppContainer(SensorMaintenance);

export default Container
