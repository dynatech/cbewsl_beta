import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import {ewi_styles} from '../../../assets/styles/ewi_styles'
import {defaults} from '../../../assets/styles/default_styles'

export default class AlertValidation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidate_alert_label: "No candidate alerts.",
      local_data_candidate_container: [],
      server_data_candidate_container: [],
      local_data: [],
      server_data: []
    };
  }

  navigateEwi(tab) {
    switch(tab) {
      case "current_alert":
        console.log(tab);
        this.props.navigation.navigate('current_alert')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  componentDidMount() {
    let temp = []
    if (this.state.local_data.length != 0) {
      // Add computation for surficial data
    } else if (this.state.server_data.length != 0) {
      // Add
    } else {
      temp.push(<View>
                  <Text style={{paddingTop: '10%',textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%'}}>Rainfall Alert: No rainfal data available</Text>
                  <Text style={{paddingTop: '10%',textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%'}}>Surficial Alert: No candidate alerts.</Text>
                </View>)
    }
    this.setState({local_data_candidate_container: temp})
  }

  render() {
    return (
        <ScrollView style={ewi_styles.container}>
        <View style={ewi_styles.menuSection}>
            <View style={ewi_styles.buttonSection}>
                <TouchableOpacity style={ewi_styles.menuButton} onPress={() => this.navigateEwi("current_alert")}>
                    <Text style={ewi_styles.buttonText}>Current Alert</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ewi_styles.activeButton} >
                    <Text style={ewi_styles.buttonActiveText}>Alert Validation</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={ewi_styles.menuContainer}>
          <Text style={{paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Validate Alert from PHIVOLCS</Text>
          <View style={{ textAlign: 'center', flex: 0.5 , paddingTop: '10%'}}>
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <TouchableOpacity style={defaults.button}>
                <Text style={defaults.buttonText}>Request data from server</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Validate Alert from Local Data</Text>
          {this.state.local_data_candidate_container}
        </View>
      </ScrollView>
    );
  }
}
