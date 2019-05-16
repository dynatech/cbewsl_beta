import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { ScrollView } from 'react-native-gesture-handler';

export default class CurrentMeasurement extends Component {
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
        case "monitoring_logs":
            this.props.navigation.navigate('monitoring_logs')
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
                <TouchableOpacity style={surficial_data_styles.activeButton} >
                    <Text style={surficial_data_styles.buttonActiveText}>Current Measurement</Text>
                </TouchableOpacity>
                <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("monitoring_logs")}>
                    <Text style={surficial_data_styles.buttonText}>Monitoring Logs</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={surficial_data_styles.contentContainer}>
          <View style={{padding: 10, marginTop: 20, marginBottom: 20}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>DATE: </Text>
            <Text style={{fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>TIME: </Text>
          </View>
          <View style={{padding: 10}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Crack A: 12</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Crack B: 12</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Crack C: 12</Text>
          </View>
        </View>
      </ScrollView>
      
    );
  }
}
