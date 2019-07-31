import moment from "moment";
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';

export default class LatestReportSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latest_report: []
    };
  }

  // Refactor this
  navigateFieldSurvey(tab) {
    switch (tab) {
      case "fsl":
        this.props.navigation.navigate('field_survery_logs')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm:ss A")
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm:ss A")
    }


    return {
      current_timestamp: current_timestamp,
      text_format_timestamp: text_format_timestamp
    }
  }

  getLatestReportSummary() {
    Notification.endOfValidity();
    fetch('http://192.168.150.10:5000/api/field_survey/get_latest_field_survey_data').then((response) => response.json())
      .then((responseJson) => {
        let latest_report = [];
        let to_local_data = [];

        if (Object.entries(responseJson[0]).length === 0 && responseJson[0].constructor === Object) {
          latest_report.push(<View style={{ padding: 10 }}>
            <Text style={{ width: '100%', textAlign: 'center' }}>No Data Available</Text>
          </View>)
          this.setState({ latest_report: latest_report })
        } else {
          for (const [index, value] of responseJson.entries()) {
            let format_date_time = this.formatDateTime(date = value.date);
            let note = value.note
            let note_label = ""
            if (note == "") {
              note = ""
              note_label = ""
            } else {
              note_label = "Note"
            }
            latest_report.push(<View style={{ padding: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Date of Survey: {format_date_time["text_format_timestamp"]}</Text>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text>Features</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text> {value.features}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text>Materials characterization</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text>{value.mat_characterization}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text>Mechanism</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text>{value.mechanism}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text>Exposure</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text>{value.exposure}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'red' }} >{note_label}</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: 'red' }} >{note}</Text>
                </View>
              </View>
            </View>)

            to_local_data.push({
              field_survey_id: value.field_survey_id,
              local_storage_id: 1,
              sync_status: 3,
              features: value.features,
              mat_characterization: value.mat_characterization,
              mechanism: value.mechanism,
              exposure: value.exposure,
              note: value.note,
              date: format_date_time["text_format_timestamp"]
            });
          }
          Storage.removeItem("FieldSurveyLatestReportSummary")
          Storage.setItem("FieldSurveyLatestReportSummary", to_local_data)
          let data_container = Storage.getItem("FieldSurveyLatestReportSummary")
          this.setState({ latest_report: latest_report })
        }
      })
      .catch((error) => {
        let data_container = Storage.getItem("FieldSurveyLatestReportSummary")
        let latest_report = [];
        data_container.then(response => {
          if (response != null) {
            for (const [index, value] of response.entries()) {
              let format_date_time = this.formatDateTime(date = value.date);
              let note = value.note
              let note_label = ""
              if (note == "") {
                note = ""
                note_label = ""
              } else {
                note_label = "Note"
              }
              latest_report.push(<View style={{ padding: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Date of Survey: {format_date_time["text_format_timestamp"]}</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text>Features</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Text> {value.features}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text>Materials characterization</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Text>{value.mat_characterization}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text>Mechanism</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Text>{value.mechanism}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text>Exposure</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Text>{value.exposure}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'red' }} >{note_label}</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Text style={{ color: 'red' }} >{note}</Text>
                  </View>
                </View>
              </View>)
            }
          } else {
            latest_report.push(<View style={{ padding: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>No latest report summary</Text>
              </View>
            </View>)
          }

          this.setState({ latest_report: latest_report })
        });
      });
  }

  render() {
    return (
      <ScrollView style={field_survey_styles.container}>
        <NavigationEvents onDidFocus={() => this.getLatestReportSummary()} />
        <View style={field_survey_styles.menuSection}>
          <View style={field_survey_styles.buttonSection}>
            <TouchableOpacity style={field_survey_styles.activeButton}>
              <Text style={field_survey_styles.buttonActiveText}>Latest Report Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={field_survey_styles.menuButton} onPress={() => this.navigateFieldSurvey("fsl")}>
              <Text style={field_survey_styles.buttonText}>Field Survey Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.latest_report}
        {/* <TouchableOpacity style={defaults.button}>
          <Text style={defaults.buttonText}>SEND</Text>
        </TouchableOpacity> */}
      </ScrollView>
    );
  }
}
