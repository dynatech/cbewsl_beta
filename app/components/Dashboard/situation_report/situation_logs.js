import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {situation_report_styles} from '../../../assets/styles/situation_report_styles'

export default class SituationLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  navigateSituationReport(tab) {
    switch(tab) {
      case "csr":
        this.props.navigation.navigate('current_situation_report')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }
  
  render() {
    return (
        <ScrollView style={situation_report_styles.container}>
        <View style={situation_report_styles.menuSection}>
            <View style={situation_report_styles.buttonSection}>
                <TouchableOpacity style={situation_report_styles.menuButton} onPress={() => this.navigateSituationReport("csr")}>
                    <Text style={situation_report_styles.buttonText}>Current Situation Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={situation_report_styles.activeButton} >
                    <Text style={situation_report_styles.buttonActiveText}>Situation Logs</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> Situation Logs </Text>
            </View>
        </View>
      </ScrollView>
    );
  }
}
