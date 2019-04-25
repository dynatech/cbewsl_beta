import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles'
import { ScrollView } from 'react-native-gesture-handler';

export default class SensorStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
            <View>
                <Text> Sensor Status section </Text>
            </View>
        </View>
        <View style={sensor_maintenance_styles.graphSection}>
        <Text> Graph section </Text>
        </View>
      </ScrollView>
      
    );
  }
}
