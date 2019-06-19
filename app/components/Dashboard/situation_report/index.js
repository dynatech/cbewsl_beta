import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CurrentSituationReport from './current_situation_report'
import SituationLogs from './situation_logs'
import SaveSituationReport from './save_situation_report'
import { createStackNavigator, createAppContainer } from 'react-navigation';

const SituationReport = createStackNavigator({
  current_situation_report: {
    screen: CurrentSituationReport,
    navigationOptions: {
      header: null
    }
  },
  situation_logs: {
    screen: SituationLogs,
    navigationOptions: {
      header: null
    }
  },
  save_situation_report: {
    screen: SaveSituationReport,
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
const Container = createAppContainer(SituationReport);

export default Container
