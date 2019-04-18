import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Login from './app/components/Login/login';
import Landing from './app/components/Dashboard/';
import RiskAssessment from './app/components/Dashboard/risk_assesment';
import SensorMaintenance from './app/components/Dashboard/sensor_maintenance';
import SituationReport from './app/components/Dashboard/situation_report';
import FieldSurvey  from './app/components/Dashboard/field_survey';
import Reports from './app/components/Dashboard/reports';
import Ewi from './app/components/Dashboard/early_warning_information'
import SurficialData from './app/components/Dashboard/surficial_data';

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
  },
  riskAssessment: {
    screen: RiskAssessment,
    navigationOptions: {
      headerTitle: "Risk Assessment"
    }
  },
  fieldSurvey: {
    screen: FieldSurvey,
    navigationOptions: {
      headerTitle: "Field Survey"
    }
  },
  sensorMaintenance: {
    screen: SensorMaintenance,
    navigationOptions: {
      headerTitle: "Sensor Maintenance"
    }
  },
  surficialData: {
    screen: SurficialData,
    navigationOptions: {
      headerTitle: "Surficial Data"
    }
  },
  ewi: {
    screen: Ewi,
    navigationOptions: {
      headerTitle: "Early Warnig Information"
    }
  },
  reports: {
    screen: Reports,
    navigationOptions: {
      headerTitle: "Reports"
    }
  },
  situationReport: {
    screen: SituationReport,
    navigationOptions: {
      headerTitle: "Situation Report"
    }
  }
});
const Container = createAppContainer(RootStack);

export default Container