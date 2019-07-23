import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles';
import RainfallGraph from './rainfall_graph';
import { NavigationEvents } from 'react-navigation';
import Storage from '../../utils/storage';

export default class SensorStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rain_gauge_status: 'No data available.',
      last_maintenance: 'No data available.',
      rain_gauge_name: 'RAIN_UMIG'
    };
  }
  
  // Refactor this
  navigateSensorMaintenace(tab) {
    switch(tab) {
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

  getStatusSummary() {
    let data_container = Storage.getItem('SensorMaintenanceLogs')
    data_container.then(response => {
      let latest_status = response[response.length-1]
      this.setState({last_maintenance: latest_status.timestamp, rain_gauge_status: latest_status.rain_gauge_status})
    })
  }

  render() {
    return (
      <ScrollView style={sensor_maintenance_styles.container}>
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
          <Text style={{fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center', padding: 20}}>Rain Gauge: {this.state.rain_gauge_name}</Text>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>RAIN GAUGE STATUS: {this.state.rain_gauge_status}</Text>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>LAST MAINTENANCE: {this.state.last_maintenance}</Text>
        </View>
        <RainfallGraph></RainfallGraph>
      </ScrollView>
      
    );
  }
}
