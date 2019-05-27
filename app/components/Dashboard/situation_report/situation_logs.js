import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { situation_report_styles } from '../../../assets/styles/situation_report_styles'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { defaults } from '../../../assets/styles/default_styles'

export default class SituationLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marked_dates: {'2019-05-17': {marked: true}}
    };
  }

  navigateSituationReport(tab) {
    switch (tab) {
      case "csr":
        this.props.navigation.navigate('current_situation_report')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  displaySituationReportPerDay(date) {
    console.log("DISPLAY SITUATION REPORT FOR "+date)
  }

  componentDidMount() {
    // SET API
    // SET date marks
    // Object.assign(obj, {key3: "value3"}); reference for adding object to super object
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
        </View>
        <Calendar markedDates={this.state.marked_dates} onDayPress={(day) => {this.displaySituationReportPerDay(day.dateString)}}></Calendar>
        <View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('save_situation_report')}>
              <Text style={defaults.buttonText}>Add Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
