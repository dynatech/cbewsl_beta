import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {situation_report_styles} from '../../../assets/styles/situation_report_styles'

export default class CurrentSituationReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  navigateSituationReport(tab) {
    switch(tab) {
      case "sl":
        this.props.navigation.navigate('situation_logs')
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
                <TouchableOpacity style={situation_report_styles.activeButton}>
                    <Text style={situation_report_styles.buttonActiveText}>Current Situation Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={situation_report_styles.menuButton} onPress={() => this.navigateSituationReport("sl")}>
                    <Text style={situation_report_styles.buttonText}>Situation Logs</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> Current Situation Report </Text>
            </View>
        </View>
      </ScrollView>
    );
  }
}
