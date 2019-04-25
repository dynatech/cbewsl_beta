import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Summary from './summary'
import HazardData from './hazard_data'
import ResourcesAndCapacities from './resources_and_capacities'
import {createStackNavigator, createAppContainer} from 'react-navigation';

const RAssessmentStack = createStackNavigator({
  summary: {
    screen: Summary,
    navigationOptions: {
      header: null
    }
  },
  hazard_data: {
    screen: HazardData,
    navigationOptions: {
      header: null
    }
  },
  resources_and_capacities: {
    screen: ResourcesAndCapacities,
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
const Container = createAppContainer(RAssessmentStack);

export default Container
