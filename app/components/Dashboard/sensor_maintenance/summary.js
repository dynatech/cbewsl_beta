import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles'
import { ScrollView } from 'react-native-gesture-handler';
import RainfallGraph from './rainfall_graph'

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one_day_rain: '85%',
      three_day_rain: '42%'
    };
  }
  
  // Refactor this
  navigateSensorMaintenace(tab) {
    switch(tab) {
        case "sensor_status":
            this.props.navigation.navigate('sensor_status')
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
                <TouchableOpacity style={sensor_maintenance_styles.activeButton} >
                    <Text style={sensor_maintenance_styles.buttonActiveText}>Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("sensor_status")}>
                    <Text style={sensor_maintenance_styles.buttonText}>Sensor Status</Text>
                </TouchableOpacity>
                <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("maintenance_logs")}>
                    <Text style={sensor_maintenance_styles.buttonText}>Maintenance Logs</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={sensor_maintenance_styles.contentContainer}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Rainfall</Text>
          <View style={sensor_maintenance_styles.subContainer}>
            <Text>1-day threshold: {this.state.one_day_rain}</Text>
            <Text>3-day threshold: {this.state.three_day_rain}</Text>
          </View>
        </View>
        <View style={sensor_maintenance_styles.graphContainer}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Subsurface</Text>
          <View style={sensor_maintenance_styles.subContainer}>
            <Text>No available data.</Text>
          </View>
        </View>
        <RainfallGraph></RainfallGraph>
      </ScrollView>
      
    );
  }
}
