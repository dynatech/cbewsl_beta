import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { DataTable } from 'react-native-paper'
import { Icon } from 'native-base'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation';

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
    fetch('http://192.168.150.191:5000/api/field_survey/delete_field_survey', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary_id: id
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


  getAllFieldSurveyLogs() {
    // Storage.removeItem("FieldSurveyLogs");
    fetch('http://192.168.150.191:5000/api/field_survey/get_all_field_survey').then((response) => response.json())
      .then((responseJson) => {
        let field_logs = [];
        let to_local_data = [];
        let counter = 0
        for (const [index, value] of responseJson.entries()) {
          field_logs.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell style={{ marginRight: -90 }}>{value.date}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>Field Survey Report {value.date.split(' ')[0]}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: -190 }}>
              <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon>
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
        let data_container = Storage.getItem('FieldSurveyLogs')
        data_container.then(response => {
          console.log(response)
        });
        this.setState({ field_logs: field_logs })
      })
      .catch((error) => {
        let data_container = Storage.getItem('FieldSurveyLogs')
        let field_logs = [];
        data_container.then(response => {
          console.log(response)
          if (response != null) {
            for (const [index, value] of response.entries()) {
              field_logs.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: -90 }}>{value.date}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>Field Survey Report {value.date}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: -190 }}>
                  <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon>
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
        });
      });
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
                  {this.state.field_logs}
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
