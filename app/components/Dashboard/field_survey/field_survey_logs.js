import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import {field_survey_styles} from '../../../assets/styles/field_survey_styles'

export default class FieldSurveyLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  navigateFieldSurvey(tab) {
    switch(tab) {
      case "lrs":
        console.log(tab);
        this.props.navigation.navigate('latest_report_summary')
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
                <TouchableOpacity style={field_survey_styles.menuButton} onPress={() => this.navigateFieldSurvey("lrs")}>
                    <Text style={field_survey_styles.buttonText}>Latest Report Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={field_survey_styles.activeButton} >
                    <Text style={field_survey_styles.buttonActiveText}>Field Survey Logs</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> Field Survey Logs </Text>
            </View>
        </View>
      </ScrollView>
    );
  }
}
