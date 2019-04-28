import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { ScrollView } from 'react-native-gesture-handler';

export default class MonitoringLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  // Refactor this
  navigateSurficialData(tab) {
    switch(tab) {
        case "summary":
            this.props.navigation.navigate('summary')
            break;
        case "current_measuremnt":
            this.props.navigation.navigate('current_measuremnt')
            break;
        default:
            console.log("Same page...")
            break;
    }
  }

  render() {
    return (
      <ScrollView style={surficial_data_styles.container}>
        <View style={surficial_data_styles.menuSection}>
            <View style={surficial_data_styles.buttonSection}>
                <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("summary")}>
                    <Text style={surficial_data_styles.buttonText}>Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={surficial_data_styles.activeButton} onPress={() => this.navigateSurficialData("current_measuremnt")}>
                    <Text style={surficial_data_styles.buttonActiveText}>Current Measurement</Text>
                </TouchableOpacity>
                <TouchableOpacity style={surficial_data_styles.menuButton} >
                    <Text style={surficial_data_styles.buttonText}>Monitoring Logs</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> Monitoring Logs </Text>
            </View>
        </View>
      </ScrollView>
      
    );
  }
}
