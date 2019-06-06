import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import {field_survey_styles} from '../../../assets/styles/field_survey_styles'

export default class CurrentAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_details: [],
      alert_level: "A3",
      alert_trigger: "Sample data",
      alert_validity: "Sample data"
    };
  }

  navigateEwi(tab) {
    switch(tab) {
      case "alert_validation":
        console.log(tab);
        this.props.navigation.navigate('alert_validation')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  componentDidMount() {
    let alert_details = []
    let alert_level = []
    if (this.state.alert_level == "A0") {
      alert_level.push(<Text style={{fontSize: 50, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 0</Text>)
    } else if (this.state.alert_level == "A1") {
      alert_level.push(<Text style={{fontSize: 50, color: "#f09e01", fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 1</Text>)
    } else if (this.state.alert_level == "A2") {
      alert_level.push(<Text style={{fontSize: 50, color: "#f27e10", fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 2</Text>)
    } else {
      alert_level.push(<Text style={{fontSize: 50, color: "#ef7b7e", fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 3</Text>)
    }
    alert_details.push(
      <View style={{padding: 20}}>
        {alert_level}
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Triggers</Text>
        <View style={{padding: 20}}>
          <Text style={{fontSize: 20}}>{this.state.alert_trigger}</Text>
        </View>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Validity</Text>
        <View style={{padding: 20}}>
          <Text style={{fontSize: 20}}>{this.state.alert_validity}</Text>
        </View>
      </View>
    )
    this.setState({alert_details: alert_details})
  }

  render() {
    return (
        <ScrollView style={field_survey_styles.container}>
        <View style={field_survey_styles.menuSection}>
            <View style={field_survey_styles.buttonSection}>
                <TouchableOpacity style={field_survey_styles.activeButton} >
                    <Text style={field_survey_styles.buttonActiveText}>Current Alert</Text>
                </TouchableOpacity>
                <TouchableOpacity style={field_survey_styles.menuButton} onPress={() => this.navigateEwi("alert_validation")}>
                    <Text style={field_survey_styles.buttonText}>Alert Validation</Text>
                </TouchableOpacity>
            </View>
            <View>
                {this.state.alert_details}
            </View>
        </View>
      </ScrollView>
    );
  }
}
