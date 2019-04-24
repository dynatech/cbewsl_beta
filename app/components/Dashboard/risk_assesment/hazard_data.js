import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapSection from './map_section'
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { ScrollView } from 'react-native-gesture-handler';

export default class HazardData extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  // Refactor this
  navigateRiskAssessment(tab) {
    switch(tab) {
        case "summary":
            console.log(tab);
            this.props.navigation.navigate('summary')
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
                <TouchableOpacity style={rassessment_styles.menuButton} onPress={() => this.navigateRiskAssessment("summary")}>
                    <Text style={rassessment_styles.buttonText}>Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={rassessment_styles.activeButton} >
                    <Text style={rassessment_styles.buttonActiveText}>Hazard Data</Text>
                </TouchableOpacity>
                <TouchableOpacity style={rassessment_styles.menuButton} onPress={() => this.navigateRiskAssessment("r_n_c")}>
                    <Text style={rassessment_styles.buttonText}>Resources and Capacities</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> hazard Screen </Text>
            </View>
        </View>
        <View style={rassessment_styles.mapSection}>
            <MapSection></MapSection>
        </View>
      </ScrollView>
      
    );
  }
}
