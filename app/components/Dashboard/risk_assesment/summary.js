import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapSection from './map_section'
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { ScrollView } from 'react-native-gesture-handler';

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  // Refactor this
  navigateRiskAssessment(tab) {
    switch(tab) {
        case "hazard_data":
            console.log(tab);
            this.props.navigation.navigate('hazard_data')
            break;
        case "r_n_c":
            console.log(tab);
            this.props.navigation.navigate('resources_and_capacities')
            break;
        default:
            console.log("Same page...")
            break;
    }
  }

  render() {
    return (
      <ScrollView style={rassessment_styles.container}>
        <View style={rassessment_styles.menuSection}>
            <View style={rassessment_styles.buttonSection}>
                <TouchableOpacity style={rassessment_styles.activeButton}>
                    <Text style={rassessment_styles.buttonActiveText}>Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={rassessment_styles.menuButton} onPress={() => this.navigateRiskAssessment("hazard_data")}>
                    <Text style={rassessment_styles.buttonText}>Hazard Data</Text>
                </TouchableOpacity>
                <TouchableOpacity style={rassessment_styles.menuButton} onPress={() => this.navigateRiskAssessment("r_n_c")}>
                    <Text style={rassessment_styles.buttonText}>Resources and Capacities</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> Summary Screen </Text>
            </View>
        </View>
        <View style={rassessment_styles.mapSection}>
            <MapSection></MapSection>
        </View>
      </ScrollView>
      
    );
  }
}
