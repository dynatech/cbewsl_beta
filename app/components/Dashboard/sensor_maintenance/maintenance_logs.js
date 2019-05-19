import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles'
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { defaults } from '../../../assets/styles/default_styles'
import RainfallGraph from './rainfall_graph'

export default class MaintenanceLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // Refactor this
  navigateSensorMaintenace(tab) {
    switch (tab) {
      case "summary":
        this.props.navigation.navigate('summary')
        break;
      case "sensor_status":
        this.props.navigation.navigate('sensor_status')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  render() {
    return (
      <ScrollView style={sensor_maintenance_styles.container}>
        <View style={sensor_maintenance_styles.menuSection}>
          <View style={sensor_maintenance_styles.buttonSection}>
            <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("summary")}>
              <Text style={sensor_maintenance_styles.buttonText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("sensor_status")} >
              <Text style={sensor_maintenance_styles.buttonText}>Sensor Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sensor_maintenance_styles.activeButton}>
              <Text style={sensor_maintenance_styles.buttonActiveText}>Maintenance Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Calendar></Calendar>
        <View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('save_maintenance_logs')}>
              <Text style={defaults.buttonText}>Add Report</Text>
            </TouchableOpacity>
          </View>
        </View>
        <RainfallGraph></RainfallGraph>
      </ScrollView>

    );
  }
}
