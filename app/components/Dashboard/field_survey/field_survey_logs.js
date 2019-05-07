import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import {field_survey_styles} from '../../../assets/styles/field_survey_styles'
import { DataTable } from 'react-native-paper'
import { Icon } from 'native-base'

export default class FieldSurveyLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field_survey_logs: []
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
    let { width } = Dimensions.get('window');
    let { height } = Dimensions.get('window');
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
              <ScrollView horizontal={true}>
                <DataTable>
                  <DataTable.Header style={{width: 500}}>
                    <DataTable.Title style={{marginRight: -100}}>Date</DataTable.Title>
                    <DataTable.Title>Official Report</DataTable.Title>
                    <DataTable.Title style={{marginRight: -200}}>Actions</DataTable.Title>
                  </DataTable.Header>
                  <DataTable.Row style={{width: 500}}>
                    <DataTable.Cell style={{marginRight: -90}}>2018/08/08</DataTable.Cell>
                    <DataTable.Cell style={{marginRight: 10}}>Field Survey Report 2018/08/08</DataTable.Cell>
                    <DataTable.Cell style={{marginRight: -190}}>
                      <Icon name="md-add-circle-outline" style={{color:"blue"}}></Icon>
                      <Icon name="md-remove-circle-outline" style={{color:"red"}}></Icon>
                    </DataTable.Cell>
                  </DataTable.Row>
                </DataTable>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
    );
  }
}
