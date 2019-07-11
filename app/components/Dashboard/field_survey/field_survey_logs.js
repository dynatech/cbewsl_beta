import moment from "moment";
import { Icon } from 'native-base';
import React, { Component } from 'react';
import { Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { defaults } from '../../../assets/styles/default_styles';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';

export default class FieldSurveyLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field_logs: [],
      field_logs_data_paginate: [],
      page: 0,
      number_of_pages: 0
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

  updateLog(field_survey_logs_data) {
    this.props.navigation.navigate('save_field_survey_logs', {
      data: field_survey_logs_data
    })
  }

  removeConfirmation(id) {
    Alert.alert(
      'Confirmation',
      'Are you sure do you want to delete ?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.removeLog(id) },
      ],
      { cancelable: false },
    );
  }

  removeLog(id) {
    Notification.endOfValidity();
    fetch('http://192.168.150.10:5000/api/field_survey/delete_field_survey', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        field_survey_id: id
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.status == true) {
          this.props.navigation.navigate('field_survery_logs');
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.getAllFieldSurveyLogs()
        } else {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        let offline_data = Storage.getItem("FieldSurveyLogs");
        offline_data.then(response => {
          let temp = response
          let updated_data = []
          let counter = 0
          temp.forEach((value) => {
            counter += 1
            if (id != value.local_storage_id) {
              updated_data.push({
                field_survey_id: value.field_survey_id,
                local_storage_id: counter,
                sync_status: 3,
                mat_characterization: value.mat_characterization,
                mechanism: value.mechanism,
                exposure: value.exposure,
                note: value.note,
                date: value.date,
              })
            }
          });
          Storage.removeItem("FieldSurveyLogs")
          Storage.setItem("FieldSurveyLogs", updated_data)
        });

        this.getAllFieldSurveyLogs();
      });
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


  getAllFieldSurveyLogs() {
    Notification.endOfValidity();
    // Storage.removeItem("FieldSurveyLogs");
    fetch('http://192.168.150.10:5000/api/field_survey/get_all_field_survey').then((response) => response.json())
      .then((responseJson) => {
        let field_logs = [];
        let to_local_data = [];
        let counter = 0
        if (responseJson.length != 0) {
          for (const [index, value] of responseJson.entries()) {
            let format_date_time = this.formatDateTime(date = value.date);
            field_logs.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: -90 }}>{format_date_time["text_format_timestamp"]}</DataTable.Cell>
              <DataTable.Cell style={{ marginRight: 10 }}>Field Survey Report {value.date.split(' ')[0]}</DataTable.Cell>
              <DataTable.Cell style={{ marginRight: -190 }}>
                <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
                <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.field_survey_id)}></Icon>
              </DataTable.Cell>
            </DataTable.Row>)
            counter += 1
            to_local_data.push({
              field_survey_id: value.field_survey_id,
              local_storage_id: counter,
              sync_status: 3,
              mat_characterization: value.mat_characterization,
              mechanism: value.mechanism,
              exposure: value.exposure,
              note: value.note,
              date: value.date,
            });
          }
          Storage.removeItem("FieldSurveyLogs")
          Storage.setItem("FieldSurveyLogs", to_local_data)
        } else {
          field_logs.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
          </DataTable.Row>)
        }
        this.setState({ field_logs: field_logs })
        this.tablePaginate(field_logs)
      })
      .catch((error) => {
        let data_container = Storage.getItem('FieldSurveyLogs')
        let field_logs = [];
        data_container.then(response => {
          console.log(response)
          if (response != null) {
            for (const [index, value] of response.entries()) {
              let format_date_time = this.formatDateTime(date = value.date);
              field_logs.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: -90 }}>{format_date_time["text_format_timestamp"]}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>Field Survey Report {value.date}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: -190 }}>
                  <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
                  <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.local_storage_id)}></Icon>
                </DataTable.Cell>
              </DataTable.Row>)
            }
          } else {
            field_logs.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
            </DataTable.Row>)
          }
          this.setState({ field_logs: field_logs })
          this.tablePaginate(field_logs)
        });
      });
  }

  tablePaginate(field_logs) {
    let temp = []
    let counter = 0
    let number_of_pages = field_logs.length / 6
    this.setState({ number_of_pages: Math.ceil(number_of_pages) })
    field_logs.forEach(element => {
      if (counter < 6) {
        temp.push(element)
      }
      counter++
    });
    this.setState({ field_logs_data_paginate: temp })
  }

  changePage(page) {
    let start = (page * 6)
    let end = start * 2
    let temp = []

    if (end == 0) {
      end = 6
    }

    for (let counter = start; counter < end; counter++) {
      temp.push(this.state.field_logs[counter])
    }
    this.setState({ field_logs_data_paginate: temp })
    this.setState({ page: page })
  }

  render() {
    let { width } = Dimensions.get('window');
    let { height } = Dimensions.get('window');
    return (
      <View style={field_survey_styles.container}>
        <NavigationEvents onDidFocus={() => this.getAllFieldSurveyLogs()} />
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
                  {this.state.field_logs_data_paginate}
                  <DataTable.Pagination
                    page={this.state.page}
                    numberOfPages={this.state.number_of_pages}
                    onPageChange={(page) => { this.changePage(page) }}
                    label={`Page ${this.state.page} of ${this.state.number_of_pages - 1}`}
                  />
                </DataTable>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
        <View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('save_field_survey_logs')}>
              <Text style={defaults.buttonText}>Add Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    );
  }
}
