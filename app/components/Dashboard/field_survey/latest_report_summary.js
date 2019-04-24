import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import {field_survey_styles} from '../../../assets/styles/field_survey_styles'

export default class LatestReportSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

    // Refactor this
    navigateFieldSurvey(tab) {
        switch(tab) {
            case "fsl":
                this.props.navigation.navigate('field_survery_logs')
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
                <TouchableOpacity style={field_survey_styles.activeButton}>
                    <Text style={field_survey_styles.buttonActiveText}>Latest Report Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={field_survey_styles.menuButton} onPress={() => this.navigateFieldSurvey("fsl")}>
                    <Text style={field_survey_styles.buttonText}>Field Survey Logs</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text> latest Report Summary </Text>
            </View>
        </View>
      </ScrollView>
    );
  }
}
