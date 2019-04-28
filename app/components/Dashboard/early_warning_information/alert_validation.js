import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import {field_survey_styles} from '../../../assets/styles/field_survey_styles'

export default class AlertValidation extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  render() {
    return (
        <ScrollView style={field_survey_styles.container}>
        <View style={field_survey_styles.menuSection}>
            <View style={field_survey_styles.buttonSection}>
                <TouchableOpacity style={field_survey_styles.menuButton} onPress={() => this.navigateEwi("current_alert")}>
                    <Text style={field_survey_styles.buttonText}>Current Alert</Text>
                </TouchableOpacity>
                <TouchableOpacity style={field_survey_styles.activeButton} >
                    <Text style={field_survey_styles.buttonActiveText}>Alert Validation</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> Alert Validation section </Text>
            </View>
        </View>
      </ScrollView>
    );
  }
}
