import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapSection from './map_section'
import FamilyRiskProfile from './family_risk_profile'
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { ScrollView } from 'react-native-gesture-handler';
import { DataTable } from 'react-native-paper'
import Storage from '../../utils/storage'

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subView: 'maps',
      buttonMap: rassessment_styles.subActiveButton,
      buttonTextMap: rassessment_styles.buttonActiveText,
      buttonFRP: rassessment_styles.subMenuButton,
      buttonTextFRP: rassessment_styles.buttonText,
      summary_data: []
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

  componentDidMount(){
    let r_a_summary = Storage.getItem("RiskAssessmentSummary");

    r_a_summary.then(response => {
      if (response == null) {
        fetch('http://192.168.150.191:5000/api/risk_assesment_summary/get_all_risk_assessment_summary').then((response) => response.json())
        .then((responseJson) => {
          console.log("Initialize risk assessment summary.")
          Storage.setItem("RiskAssessmentSummary", responseJson);
          let summary_data = [];
          for (const [index, value] of responseJson.entries()) {
            summary_data.push(<DataTable.Row style={{width: 500}}>
              <DataTable.Cell style={{marginRight: 10}}>{value.location}</DataTable.Cell>
              <DataTable.Cell style={{marginRight: 10}}>{value.impact}</DataTable.Cell>
              <DataTable.Cell style={{marginRight: 10}}>{value.adaptive_capacity}</DataTable.Cell>
              <DataTable.Cell style={{marginRight: 10}}>{value.vulnerability}</DataTable.Cell>
            </DataTable.Row>)
          }
          this.setState({summary_data: summary_data})
        })
        .catch((error) => {
          console.error(error);
        });
      } else {
        let summary_data = [];
        for (const [index, value] of response.entries()) {
          summary_data.push(<DataTable.Row style={{width: 500}}>
            <DataTable.Cell style={{marginRight: 10}}>{value.location}</DataTable.Cell>
            <DataTable.Cell style={{marginRight: 10}}>{value.impact}</DataTable.Cell>
            <DataTable.Cell style={{marginRight: 10}}>{value.adaptive_capacity}</DataTable.Cell>
            <DataTable.Cell style={{marginRight: 10}}>{value.vulnerability}</DataTable.Cell>
          </DataTable.Row>)
        }
        this.setState({summary_data: summary_data})
      }

    })
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
              <ScrollView horizontal={true}>
                <DataTable>
                  <DataTable.Header style={{flex: 1, width: 500}}>
                    <DataTable.Title >Location</DataTable.Title>
                    <DataTable.Title>Impact</DataTable.Title>
                    <DataTable.Title>Adaptive Capacity</DataTable.Title>
                    <DataTable.Title>Vulnerability</DataTable.Title>
                  </DataTable.Header>
                  {this.state.summary_data}
                </DataTable>
              </ScrollView>
              <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('modify_summary')}>
                <Text style={defaults.buttonText}>EDIT</Text>
              </TouchableOpacity>
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
