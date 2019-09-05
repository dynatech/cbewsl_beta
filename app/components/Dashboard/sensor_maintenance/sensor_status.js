import React, { Component } from 'react';
import moment from 'moment';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles';
import RainfallGraph from './rainfall_graph';
import { NavigationEvents } from 'react-navigation';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class SensorStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rain_gauge_status: 'No data available.',
      last_maintenance: 'No data available.',
      number_of_working_nodes: 'No data available.',
      anomalous_nodes: 'No data available.',
      rain_gauge_name: 'RAIN_UMIG',
      spinner: true
    };
  }

  // Refactor this
  navigateSensorMaintenace(tab) {
    switch (tab) {
      case "summary":
        this.props.navigation.navigate('summary')
        break;
      case "maintenance_logs":
        this.props.navigation.navigate('maintenance_logs')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    let date_format = ""
    let date_only_format = ""
    let time_format = ""
    let time_format2 = ""
    let for_file_name = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS");
      date_format = moment(new Date()).format("YYYY-MM-DD");
      date_only_format = moment(new Date()).format("MMMM D, YYYY");
      time_format = moment(new Date()).format("hh:MM a");
      time_format2 = moment(new Date()).format("HH:MM a");
      text_format_timestamp = moment(new Date()).format("LLL");
      for_file_name = moment(new Date()).format("YYYY_MM_DD_HH_MM_SS");
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS");
      date_format = moment(date).format("YYYY-MM-DD");
      date_only_format = moment(date).format("MMMM D, YYYY");
      time_format = moment(date).format("hh:MM a");
      time_format2 = moment(date).format("HH:MM a");
      text_format_timestamp = moment(date).format("LLL");
      for_file_name = moment(date).format("YYYY_MM_DD_HH_MM_SS");
    }

    return {
      current_timestamp: current_timestamp,
      date: date_format,
      time_format: time_format,
      time_format2: time_format2,
      date_only_format: date_only_format,
      text_format_timestamp: text_format_timestamp,
      for_file_name: for_file_name
    }
  }

  getStatusSummary() {
    let data_container = Storage.getItem('SensorMaintenanceLogs')
    data_container.then(response => {
      console.log(response)
      let latest_status = response[0]
      let latest_maintenance = this.formatDateTime(latest_status.timestamp);
      this.setState({
        last_maintenance: latest_maintenance["date_only_format"],
        rain_gauge_status: latest_status.rain_gauge_status,
        number_of_working_nodes: latest_status.working_nodes,
        anomalous_nodes: latest_status.anomalous_nodes,
        spinner: false
      })
    })
  }

  render() {
    return (
      <ScrollView style={sensor_maintenance_styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <NavigationEvents onDidFocus={() => this.getStatusSummary()} />
        <View style={sensor_maintenance_styles.menuSection}>
          <View style={sensor_maintenance_styles.buttonSection}>
            <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("summary")}>
              <Text style={sensor_maintenance_styles.buttonText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sensor_maintenance_styles.activeButton} >
              <Text style={sensor_maintenance_styles.buttonActiveText}>Sensor Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("maintenance_logs")}>
              <Text style={sensor_maintenance_styles.buttonText}>Maintenance Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={sensor_maintenance_styles.contentContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center', padding: 20 }}>Rain Gauge: {this.state.rain_gauge_name}</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>NUMBER OF WORKING NODES: {this.state.number_of_working_nodes}</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>ANOMALOUS NODES: {this.state.anomalous_nodes}</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>RAIN GAUGE STATUS: {this.state.rain_gauge_status}</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>LAST MAINTENANCE: {this.state.last_maintenance}</Text>
        </View>
        <RainfallGraph></RainfallGraph>
      </ScrollView>

    );
  }
}
