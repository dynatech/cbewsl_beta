import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import {field_survey_styles} from '../../../assets/styles/field_survey_styles'

export default class CurrentAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
                <Text> Current Alert section </Text>
            </View>
        </View>
      </ScrollView>
    );
  }
}
