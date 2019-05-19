import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { DataTable } from 'react-native-paper'
import { Icon } from 'native-base'

export default class FieldSurveyLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field_logs: []
    };
  }

  navigateFieldSurvey(tab) {
    switch (tab) {
      case "lrs":
        console.log(tab);
        this.props.navigation.navigate('latest_report_summary')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  removeLog(id) {
    console.log("REMOVE")
    console.log(id)
  }

  updateLog(id) {
    console.log("UPDATE")
    console.log(id)
  }

  componentDidMount() {
    fetch('http://192.168.150.191:5000/api/field_survey/get_all_field_survey').then((response) => response.json())
      .then((responseJson) => {
        let field_logs = [];
        for (const [index, value] of responseJson.entries()) {
          field_logs.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell style={{ marginRight: -90 }}>{value.date}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>Field Survey Report {value.date.split(' ')[0]}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: -190 }}>
              <Icon name="md-add-circle-outline" style={{ color: "blue" }} onPress={() => this.updateLog(value.field_survey_id)}></Icon>
              <Icon name="md-remove-circle-outline" style={{ color: "red" }} onPress={() => this.removeLog(value.field_survey_id)}></Icon>
            </DataTable.Cell>
          </DataTable.Row>)
        }
        this.setState({ field_logs: field_logs })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    let { width } = Dimensions.get('window');
    let { height } = Dimensions.get('window');
    return (
      <View style={field_survey_styles.container}>
        <ScrollView style={field_survey_styles.table_container}>
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
                  <DataTable.Header style={{ width: 500 }}>
                    <DataTable.Title style={{ marginRight: -100 }}>Date</DataTable.Title>
                    <DataTable.Title>Official Report</DataTable.Title>
                    <DataTable.Title style={{ marginRight: -200 }}>Actions</DataTable.Title>
                  </DataTable.Header>
                  {this.state.field_logs}
                </DataTable>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
        <View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('save_field_survey_log')}>
              <Text style={defaults.buttonText}>Add Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    );
  }
}
