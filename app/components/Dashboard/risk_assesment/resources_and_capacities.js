import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapSection from './map_section'
import FamilyRiskProfile from './family_risk_profile'
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { ScrollView } from 'react-native-gesture-handler';

export default class ResourcesAndCapacities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subView: 'maps',
      buttonMap: rassessment_styles.subActiveButton,
      buttonTextMap: rassessment_styles.buttonActiveText,
      buttonFRP: rassessment_styles.subMenuButton,
      buttonTextFRP: rassessment_styles.buttonText
    };
  }
  
  // Refactor this
  navigateRiskAssessment(tab) {
    switch(tab) {
        case "summary":
            console.log(tab);
            this.props.navigation.navigate('summary')
            break;
        case "hazard_data":
            console.log(tab);
            this.props.navigation.navigate('hazard_data')
            break;
        default:
            console.log("Same page...")
            break;
    }
  }

  changeSubView(tab) {
    console.log(tab)
    if (tab == 'maps') {
      this.setState({subView: tab})
      this.setState({buttonMap: rassessment_styles.subActiveButton})
      this.setState({buttonTextMap: rassessment_styles.buttonActiveText})
      this.setState({buttonFRP: rassessment_styles.subMenuButton})
      this.setState({buttonTextFRP: rassessment_styles.buttonText})
    } else {
      this.setState({subView: tab})
      this.setState({buttonMap: rassessment_styles.subMenuButton})
      this.setState({buttonTextMap: rassessment_styles.buttonText})
      this.setState({buttonFRP: rassessment_styles.subActiveButton})
      this.setState({buttonTextFRP: rassessment_styles.buttonActiveText})
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
                <TouchableOpacity style={rassessment_styles.menuButton} onPress={() => this.navigateRiskAssessment("hazard_data")}>
                    <Text style={rassessment_styles.buttonText}>Hazard Data</Text>
                </TouchableOpacity>
                <TouchableOpacity style={rassessment_styles.activeButton}>
                    <Text style={rassessment_styles.buttonActiveText}>Resources and Capacities</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> R n C Screen </Text>
            </View>
        </View>
        <View style={rassessment_styles.mapSection}>
          <View style={rassessment_styles.buttonSection}>
              <TouchableOpacity style={this.state.buttonMap} onPress={()=> this.changeSubView('maps')}>
                  <Text style={this.state.buttonTextMap}>Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={this.state.buttonFRP} onPress={()=> this.changeSubView('familyriskprofile')}>
                  <Text style={this.state.buttonTextFRP}>Family Risk Profile</Text>
              </TouchableOpacity>
          </View>
          {this.state.subView === 'maps' ? <MapSection/> : <FamilyRiskProfile/>}
        </View>
      </ScrollView>
      
    );
  }
}
