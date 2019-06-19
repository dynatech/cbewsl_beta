import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles'
import { ScrollView } from 'react-native-gesture-handler';
import RainfallGraph from './rainfall_graph'

export default class SensorStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rain_gauge_status: null,
      last_maintenance: null,
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

  render() {
    return (
      <ScrollView style={sensor_maintenance_styles.container}>
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
