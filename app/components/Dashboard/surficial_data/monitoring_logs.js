import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
      monitoring_logs_data: []
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

  getMonitoringLogs() {
    fetch('http://192.168.150.191:5000/api/surficial_data/get_monitoring_logs').then((response) => response.json())
      .then((responseJson) => {
        let monitoring_logs_data = []
        console.log(responseJson)
        for (const [index, value] of responseJson.entries()) {
          let formatted_timestamp = this.formatDateTime(date = value.date)
          let crack_a = value.surficial_data[0].measurement
          let crack_b = value.surficial_data[1].measurement
          let crack_c = value.surficial_data[2].measurement
          let moms_data = value.surficial_data[2].moms_data
          let moms_data_text = ""
          if (moms_data.moms_id == null) {
            moms_data_text = "N/A"
          } else {
            moms_data_text = "View MOMs"
          }
          monitoring_logs_data.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell style={{ marginRight: 10 }}>{formatted_timestamp["text_format_timestamp"]}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{crack_a}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{crack_b}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{crack_c}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{moms_data_text}
            </DataTable.Cell>
            <DataTable.Cell>
              <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon>
              <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value)}></Icon>
            </DataTable.Cell>
          </DataTable.Row>)
          // monitoring_logs_data.push({
          //   date: formatted_timestamp["text_format_timestamp"],
          //   crack_a: crack_a,
          //   crack_b: crack_b,
          //   crack_c: crack_c,
          //   moms_data: moms_data
          // })
        }
        this.setState({ monitoring_logs_data: monitoring_logs_data })
        // console.log(monitoring_logs_data)
      })
      .catch((error) => {
        console.error(error);
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
              <DataTable.Header style={{ width: 500 }}>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>A</DataTable.Title>
                <DataTable.Title>B</DataTable.Title>
                <DataTable.Title>C</DataTable.Title>
                <DataTable.Title>MOMs</DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>
              {this.state.monitoring_logs_data}
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
