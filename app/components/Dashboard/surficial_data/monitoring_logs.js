import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { ScrollView } from 'react-native-gesture-handler';
import { DataTable } from 'react-native-paper'
import moment from "moment"
import { Icon } from 'native-base'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation';

export default class MonitoringLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monitoring_logs_data: [],
      monitoring_logs_data_paginate: [],
      page: 0,
      number_of_pages: 0
    };
  }

  // Refactor this
  navigateSurficialData(tab) {
    switch (tab) {
      case "summary":
        this.props.navigation.navigate('summary')
        break;
      case "current_measurement":
        this.props.navigation.navigate('current_measurement')
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
      date = moment(new Date()).format("MMMM D, YYYY")
      time = moment(new Date()).format("h:mm A")
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm A")
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
      date = moment(date).format("MMMM D, YYYY")
      time = moment(date).format("h:mm A")
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm A")
    }


    return {
      current_timestamp: current_timestamp,
      date: date,
      time: time,
      text_format_timestamp: text_format_timestamp
    }
  }

  tablePaginate(monitoring_logs_data) {
    let temp = []
    let counter = 0
    let number_of_pages = monitoring_logs_data.length / 6
    this.setState({ number_of_pages: Math.ceil(number_of_pages) })
    monitoring_logs_data.forEach(element => {
      if (counter < 6) {
        temp.push(element)
      }
      counter++
    });
    this.setState({ monitoring_logs_data_paginate: temp })
  }

  changePage(page) {
    let start = (page * 6)
    let end = start + 7
    let temp = []

    if (end == 0) {
      end = 6
    }

    console.log(start)
    console.log(end)

    for (let counter = start; counter < end; counter++) {
      temp.push(this.state.monitoring_logs_data[counter])
    }
    this.setState({ monitoring_logs_data_paginate: temp })
    this.setState({ page: page })
  }



  updateLog(moms_data) {
    this.props.navigation.navigate('save_surficial_data', {
      data: moms_data
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
    fetch('http://192.168.150.191:5000/api/moms_data/delete_moms_data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        moms_id: id
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.status == true) {
          this.props.navigation.navigate('monitoring_logs');
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.getMonitoringLogs()
        } else {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        let offline_data = Storage.getItem("SurficialDataMomsSummary");
        offline_data.then(response => {
          let temp = response
          let updated_data = []
          let counter = 0
          temp.forEach((value) => {
            counter += 1
            if (id != value.local_storage_id) {
              updated_data.push({
                moms_id: value.moms_id,
                local_storage_id: counter,
                sync_status: value.sync_status,
                type_of_feature: value.type_of_feature,
                description: value.description,
                name_of_feature: value.name_of_feature,
                date: value.datetime
              })
            }
          });
          Storage.removeItem("SurficialDataMomsSummary")
          Storage.setItem("SurficialDataMomsSummary", updated_data)
        });

        this.getMonitoringLogs();
      });
  }

  raiseAlert(data) {
    Alert.alert(
      'Raise Alert',
      'Are you sure you want raise to this alert?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Alert 2',
          onPress: () => this.setAlertForMoms(data,"2"),
        },
        { 
          text: 'Alert 3', 
          onPress: () =>  this.setAlertForMoms(data,"3"),
        },
      ],
      { cancelable: false },
    );
  }

  setAlertForMoms(data, alert_level) {
    let current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
    let alert_validity = ""
    let int_sym = ""
    let offline_data = Storage.getItem("AlertGeneration");
    offline_data.then(response => {
      if (response == null || response == undefined) {
        if (alert_level == "2") {
          int_sym = "m"
          alert_validity = moment(data.date).add(24, 'hours').format("YYYY-MM-DD HH:mm:00")
        } else if (alert_level == "3") {
          int_sym = "M"
          alert_validity = moment(data.date).add(48, 'hours').format("YYYY-MM-DD HH:mm:00")
        }

        let hour = moment(alert_validity).hours()
        if (hour >= 0 && hour < 4) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 04:00:00")
        } else if (hour >= 4 && hour < 8) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 08:00:00")
        } else if (hour >= 8 && hour < 12) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 12:00:00")
        } else if (hour >= 12 && hour < 16) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 16:00:00")
        } else if (hour >= 16 && hour < 20) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 20:00:00")
        } else if (hour >= 20) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 00:00:00")
        }
        
        let cred = Storage.getItem("loginCredentials");
        cred.then(response => {
          let temp = {
            alert_level: alert_level,
            data_ts: current_timestamp,
            user_id: response.user_data.user.user_id,
            alert_validity: alert_validity,
            trig_list: []
          }

          let trig_list = {
            int_sym: int_sym,
            remarks: data.description,
            f_name: data.name_of_feature,
            f_type: data.type_of_feature
          }

          temp.trig_list.push(trig_list)
          let raised_alerts = Storage.setItem("AlertGeneration", temp);
        })
      } else {
        console.log(response)
        let hour_validity = 0
        if (alert_level == "2") {
          int_sym = "m"
          hour_validity = 24
          alert_validity = moment(data.date).add(hour_validity, 'hours').format("YYYY-MM-DD HH:mm:00")
        } else if (alert_level == "3") {
          int_sym = "M"
          hour_validity = 48
          alert_validity = moment(data.date).add(hour_validity, 'hours').format("YYYY-MM-DD HH:mm:00")
        }

        let hour = moment(alert_validity).hours()
        if (hour >= 0 && hour < 4) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 04:00:00")
        } else if (hour >= 4 && hour < 8) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 08:00:00")
        } else if (hour >= 8 && hour < 12) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 12:00:00")
        } else if (hour >= 12 && hour < 16) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 16:00:00")
        } else if (hour >= 16 && hour < 20) {
          alert_validity = moment(alert_validity).format("YYYY-MM-DD 20:00:00")
        } else if (hour >= 20) {
          alert_validity = moment(alert_validity).add(24, 'hours').format("YYYY-MM-DD 00:00:00")
        }

        if (moment(moment(alert_validity) > response.validity)) {
          response.validty = alert_validity
        }

        let trig_list = {
          int_sym: int_sym,
          remarks: data.description,
          f_name: data.name_of_feature,
          f_type: data.type_of_feature
        }
        response.alert_level = alert_level
        response.trig_list.push(trig_list)
        let raised_alerts = Storage.setItem("AlertGeneration", response);
      }
    })
  }

  getMonitoringLogs() {
    fetch('http://192.168.150.191:5000/api/surficial_data/get_moms_data').then((response) => response.json())
      .then((responseJson) => {
        let monitoring_logs_data = []
        let to_local_data = []
        let counter = 0
        for (const [index, value] of responseJson.entries()) {
          let formatted_timestamp = this.formatDateTime(date = value.date)
          monitoring_logs_data.push(<DataTable.Row style={{ width: 600 }}>
            <DataTable.Cell style={{ paddingRight: 10 }}>{value.type_of_feature}</DataTable.Cell>
            <DataTable.Cell style={{ paddingRight: 10 }}>{value.description}</DataTable.Cell>
            <DataTable.Cell style={{ paddingRight: 10 }}>{value.name_of_feature}</DataTable.Cell>
            <DataTable.Cell style={{ paddingRight: 10 }}>{formatted_timestamp["text_format_timestamp"]}</DataTable.Cell>
            <DataTable.Cell>
              <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
              <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.moms_id)}></Icon><Text>   </Text>
              <Icon name="ios-share-alt" style={{ color: "#083451" }} onPress={() => this.raiseAlert(value)}><Text style={{ fontSize: 5 }}>Raise</Text></Icon>
            </DataTable.Cell>
          </DataTable.Row>)

          counter += 1
          to_local_data.push({
            moms_id: value.moms_id,
            local_storage_id: counter,
            sync_status: 3,
            type_of_feature: value.type_of_feature,
            description: value.description,
            name_of_feature: value.name_of_feature,
            date: value.date
          })
        }
        Storage.removeItem("SurficialDataMomsSummary")
        Storage.setItem("SurficialDataMomsSummary", to_local_data)
        this.setState({ monitoring_logs_data: monitoring_logs_data })
        this.tablePaginate(monitoring_logs_data)
        let offline = Storage.getItem("SurficialDataMomsSummary")
        offline.then(response => {
          console.log(response)
        })
      })
      .catch((error) => {
        let data_container = Storage.getItem('SurficialDataMomsSummary')
        let monitoring_logs_data = [];
        data_container.then(response => {
          console.log(response)
          let counter = 0
          if (response.length != 0) {
            for (const [index, value] of response.entries()) {
              let formatted_timestamp = this.formatDateTime(date = value.date)
              monitoring_logs_data.push(<DataTable.Row style={{ width: 600 }}>
                <DataTable.Cell style={{ marginRight: 20 }}>{value.type_of_feature}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 20 }}>{value.description}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 20 }}>{value.name_of_feature}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 20 }}>{formatted_timestamp["text_format_timestamp"]}</DataTable.Cell>
                <DataTable.Cell>
                  <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
                  <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.local_storage_id)}></Icon><Text>   </Text>
                  <Icon name="ios-share-alt" style={{ color: "#083451" }} onPress={() => this.raiseAlert(value)}><Text style={{ fontSize: 5 }}>Raise</Text></Icon>
                </DataTable.Cell>
              </DataTable.Row>)
            }
          } else {
            monitoring_logs_data.push(<DataTable.Row style={{ width: 600 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
            </DataTable.Row>)
          }

          this.setState({ monitoring_logs_data: monitoring_logs_data })
          this.tablePaginate(monitoring_logs_data)
        });
      });
  }

  render() {
    return (
      <ScrollView style={surficial_data_styles.container}>
        <NavigationEvents onDidFocus={() => this.getMonitoringLogs()} />
        <View style={surficial_data_styles.menuSection}>
          <View style={surficial_data_styles.buttonSection}>
            <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("summary")}>
              <Text style={surficial_data_styles.buttonText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("current_measurement")}>
              <Text style={surficial_data_styles.buttonText}>Current Measurement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={surficial_data_styles.activeButton} >
              <Text style={surficial_data_styles.buttonActiveText}>Monitoring Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <ScrollView horizontal={true}>
            <DataTable>
              <DataTable.Header style={{ width: 600 }}>
                <DataTable.Title>Type of Feature</DataTable.Title>
                <DataTable.Title>Description</DataTable.Title>
                <DataTable.Title>Name of Feature</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Action</DataTable.Title>
              </DataTable.Header>
              {this.state.monitoring_logs_data_paginate}
              <DataTable.Pagination
                page={this.state.page}
                numberOfPages={this.state.number_of_pages}
                onPageChange={(page) => { this.changePage(page) }}
                label={`Page ${this.state.page} of ${this.state.number_of_pages - 1}`}
              />
            </DataTable>
          </ScrollView>
        </View>
        <View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('save_surficial_data')}>
              <Text style={defaults.buttonText}>Add Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
