import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LatestReportSummary from './latest_report_summary'
import FieldSurveyLogs from './field_survey_logs'
import {createStackNavigator, createAppContainer} from 'react-navigation';

const FieldSurveyStack = createStackNavigator({
  latest_report_summary: {
    screen: LatestReportSummary,
    navigationOptions: {
      header: null
    }
  },
  field_survery_logs: {
    screen: FieldSurveyLogs,
    navigationOptions: {
      header: null
    }
  }
});
const Container = createAppContainer(FieldSurveyStack);

export default Container
