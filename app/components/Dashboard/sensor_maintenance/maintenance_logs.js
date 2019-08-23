import moment from "moment";
import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { defaults } from '../../../assets/styles/default_styles';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import RainfallGraph from './rainfall_graph';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';
import Sync from '../../utils/syncer';

export default class MaintenanceLogs extends Component {
  constructor(props) {
    super(props);
    let new_days = {};
    this.state = {
      marked_dates: new_days,
      date_selected: "",
      selected_date_logs: [],
      add_report_text: "Add Report",
      spinner: true
    };
  }

  // Refactor this
  navigateSensorMaintenace(tab) {
    switch (tab) {
      case "summary":
        this.props.navigation.navigate('summary')
        break;
      case "sensor_status":
        this.props.navigation.navigate('sensor_status')
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
    let date_format = ""
    let time_format = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
      date_format = moment(new Date()).format("YYYY-MM-DD")
      time_format = moment(new Date()).format("h:mm:ss A")
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY")
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
      date_format = moment(date).format("YYYY-MM-DD")
      time_format = moment(date).format("h:mm:ss A")
      text_format_timestamp = moment(date).format("MMMM D, YYYY")
    }


    return {
      current_timestamp: current_timestamp,
      date: date_format,
      time: time_format,
      text_format_timestamp: text_format_timestamp
    }
  }

  displayMaintenanceLogsPerDay() {
    Notification.endOfValidity();
    this.setState({ date_selected: "" })
    let next_days = []
    let new_days = {};

    Sync.clientToServer("SensorMaintenanceLogs").then(() => {
      setTimeout(()=> {
        fetch('http://192.168.150.10:5000/api/sensor_maintenance/get_all_sensor_maintenance').then((response) => response.json())
        .then((responseJson) => {
          let to_local_data = [];
          for (const [index, value] of responseJson.entries()) {
            let format_date_time = this.formatDateTime(date = value.timestamp);
            next_days.push(format_date_time["date"])
            let counter = 0;
            counter += 1;
            to_local_data.push({
              sensor_maintenance_id: value.sensor_maintenance_id,
              local_storage_id: counter,
              sync_status: 3,
              working_nodes: value.working_nodes,
              anomalous_nodes: value.anomalous_nodes,
              rain_gauge_status: value.rain_gauge_status,
              timestamp: format_date_time["current_timestamp"],
            });
          }

          next_days.forEach((day) => {
            new_days = {
              ...new_days,
              [day]: {
                day,
                marked: true
              }
            };
          });

          Storage.removeItem("SensorMaintenanceLogs")
          Storage.setItem("SensorMaintenanceLogs", to_local_data)
          this.setState({ marked_dates: new_days, spinner: false })
        })
        .catch((error) => {
          let data_container = Storage.getItem('SensorMaintenanceLogs')
          data_container.then(response => {
            if (response.length != 0) {
              for (const [index, value] of response.entries()) {
                let format_date_time = this.formatDateTime(date = value.timestamp);
                next_days.push(format_date_time["date"])
              }
              next_days.forEach((day) => {
                new_days = {
                  ...new_days,
                  [day]: {
                    day,
                    marked: true
                  }
                };
              });
              this.setState({ marked_dates: new_days, spinner: false })
            }
          })
        });
      }, 3000)
      
    });


  }

  selectDateToAddLogs(date) {
    this.setState({ spinner: true })
    Notification.endOfValidity();
    this.setState({ date_selected: date })
    let selected_date = this.formatDateTime(date = date)
    button_text = "Add Report for " + selected_date["text_format_timestamp"]
    this.setState({ add_report_text: button_text })
    fetch('http://192.168.150.10:5000/api/sensor_maintenance/get_report_by_date', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date_selected: selected_date["date"]
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        let logs = []
        let to_local_data = []
        console.log(responseJson)
        if (responseJson.length == 0) {
          logs.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>No report on this date</Text>
          </View>)
          this.setState({ selected_date_logs: logs, spinner: false })
        } else {
          logs.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Logs for {selected_date["text_format_timestamp"]}</Text>
          </View>)
          for (const [index, value] of responseJson.entries()) {
            logs.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
              <Text style={{ fontSize: 15 }}>Working Nodes: {value.working_nodes}</Text>
              <Text style={{ fontSize: 15 }}>Anomalous Nodes: {value.anomalous_nodes}</Text>
              <Text style={{ fontSize: 15 }}>Rain Guage Status: {value.rain_gauge_status}</Text>
            </View>)
          }
          this.setState({ selected_date_logs: logs, spinner: false })
        }

      })
      .catch((error) => {

        let logs = []
        try {
          let get_all_marked_dates = this.state.marked_dates
          let date_selected = get_all_marked_dates[date].day
          let data_container = Storage.getItem('SensorMaintenanceLogs')
          data_container.then(response => {
            logs.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Logs for {selected_date["text_format_timestamp"]}</Text>
            </View>)
            for (const [index, value] of response.entries()) {
              let format_date_time = this.formatDateTime(date = value.timestamp);
              let timestamp = format_date_time["date"]
              console.log(timestamp + "|" + date_selected)
              if (timestamp == date_selected) {
                logs.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <Text style={{ fontSize: 15 }}>Working Nodes: {value.working_nodes}</Text>
                  <Text style={{ fontSize: 15 }}>Anomalous Nodes: {value.anomalous_nodes}</Text>
                  <Text style={{ fontSize: 15 }}>Rain Guage Status: {value.rain_gauge_status}</Text>
                </View>)
              }

            }
            this.setState({ selected_date_logs: logs, spinner: false })
          })
        }
        catch (err) {
          logs.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>No report on this date</Text>
          </View>)
          this.setState({ selected_date_logs: logs, spinner: false })
        }



      });
  }

  navigateSaveMaintenanceLogs() {
    let date_selected = this.state.date_selected
    if (date_selected == "") {
      Alert.alert(
        'Alert!',
        'Please pick a date to add report.',
        [
          {
            text: 'Close',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          }
        ],
        { cancelable: false },
      );
    } else {
      this.props.navigation.navigate('save_maintenance_logs', {
        data: date_selected
      })
    }
  }

  render() {
    return (
      <ScrollView style={sensor_maintenance_styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <NavigationEvents onDidFocus={() => this.displayMaintenanceLogsPerDay()} />
        <View style={sensor_maintenance_styles.menuSection}>
          <View style={sensor_maintenance_styles.buttonSection}>
            <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("summary")}>
              <Text style={sensor_maintenance_styles.buttonText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sensor_maintenance_styles.menuButton} onPress={() => this.navigateSensorMaintenace("sensor_status")} >
              <Text style={sensor_maintenance_styles.buttonText}>Sensor Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sensor_maintenance_styles.activeButton}>
              <Text style={sensor_maintenance_styles.buttonActiveText}>Maintenance Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Calendar markedDates={this.state.marked_dates} onDayPress={(day) => { this.selectDateToAddLogs(day.dateString) }}></Calendar>
        <View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={sensor_maintenance_styles.button} onPress={() => this.navigateSaveMaintenanceLogs()}>
              <Text style={defaults.buttonText}>{this.state.add_report_text}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={sensor_maintenance_styles.contentContainer}>
          {this.state.selected_date_logs}
        </View>
        <RainfallGraph></RainfallGraph>
      </ScrollView>

    );
  }
}
