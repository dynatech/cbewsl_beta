import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {situation_report_styles} from '../../../assets/styles/situation_report_styles'

export default class CurrentSituationReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latest_date: '2018/08/08',
      latest_time: '23:30:00',
      summary: 'Sample Summary for Situation Report'
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
        </View>
        <View style={situation_report_styles.contentContainer}>
          <View style={{paddingTop: 10,paddingBottom: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Date: {this.state.latest_date}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Time: {this.state.latest_time}</Text>
          </View>
          <View style={{paddingTop: 10,paddingBottom: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>{this.state.summary}</Text>
          </View>
          <View style={{paddingTop: 10,paddingBottom: 10}}>
            <Text style={{fontSize: 10, color: 'blue'}}>Full situation report is available in the web app</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
