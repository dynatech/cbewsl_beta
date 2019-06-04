import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { situation_report_styles } from '../../../assets/styles/situation_report_styles'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation'
import moment from "moment"

export default class SituationLogs extends Component {
  constructor(props) {
    super(props);
    let new_days = {};
    this.state = {
      marked_dates: new_days,
      date_selected: "",
      selected_date_situations: []
    };
  }

  navigateSituationReport(tab) {
    switch (tab) {
      case "csr":
        this.props.navigation.navigate('current_situation_report')
        break;
      default:

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
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm:ss A")
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
      date_format = moment(date).format("YYYY-MM-DD")
      time_format = moment(date).format("h:mm:ss A")
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm:ss A")
    }


    return {
      current_timestamp: current_timestamp,
      date: date_format,
      time: time_format,
      text_format_timestamp: text_format_timestamp
    }
  }

  displaySituationReportPerDay() {
    this.setState({ date_selected: "" })
    let next_days = []
    let new_days = {};
    fetch('http://192.168.150.191:5000/api/situation_report/get_all_situation_report').then((response) => response.json())
      .then((responseJson) => {
        let to_local_data = [];
        for (const [index, value] of responseJson.entries()) {
          let format_date_time = this.formatDateTime(date = value.timestamp);
          next_days.push(format_date_time["date"])
          let counter = 0;
          counter += 1;
          to_local_data.push({
            situation_report_id: value.situation_report_id,
            local_storage_id: counter,
            sync_status: 3,
            timestamp: format_date_time["current_timestamp"],
            summary: value.summary,
            pdf_path: value.pdf_path,
            image_path: value.image_path
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
        this.setState({ marked_dates: new_days })
        Storage.removeItem("SituationReportLogs")
        Storage.setItem("SituationReportLogs", to_local_data)
        let data_container = Storage.getItem("SituationReportLogs")
        data_container.then(response => {
          console.log(response)
        });

      })
      .catch((error) => {

        let data_container = Storage.getItem("SituationReportLogs")
        data_container.then(response => {
          console.log(response)
          if (response != null) {
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
            this.setState({ marked_dates: new_days })
          } else {
            this.setState({
              latest_date: "N/A",
              latest_time: "N/A",
              summary: "No current situation report"
            });
          }

        });
      });
  }

  selectDateToAddReport(date) {
    this.setState({ date_selected: date })
    let selected_date = this.formatDateTime(date = date)
    fetch('http://192.168.150.191:5000/api/situation_report/get_report_by_date', {
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
        let situation_reports = []
        if (responseJson != null) {
          for (const [index, value] of responseJson.entries()) {
            let format_date_time = this.formatDateTime(date = value.timestamp);
            situation_reports.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Situation Report for {format_date_time["text_format_timestamp"]}</Text>
              <Text style={{ fontSize: 15 }}>{value.summary}</Text>
            </View>)
          }
        } else {
          situation_reports.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>No report on this date</Text>
          </View>)
        }

        console.log(situation_reports)
        this.setState({ selected_date_situations: situation_reports })
      })
      .catch((error) => {
        let get_all_marked_dates = this.state.marked_dates

        let situation_reports = []
        try {
          let selected_date = get_all_marked_dates[date].day
          let data_container = Storage.getItem("SituationReportLogs")
          data_container.then(response => {
            for (const [index, value] of response.entries()) {
              let format_date_time = this.formatDateTime(date = value.timestamp);
              let timestamp = format_date_time["date"]
              if (timestamp == selected_date) {
                situation_reports.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Situation Report for {format_date_time["text_format_timestamp"]}</Text>
                  <Text style={{ fontSize: 15 }}>{value.summary}</Text>
                </View>)
              }
            }
            this.setState({ selected_date_situations: situation_reports })
          });
        }
        catch (err) {
          situation_reports.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>No report on this date</Text>
          </View>)
          this.setState({ selected_date_situations: situation_reports })
        }

      });
  }

  navigateSaveSituationReport() {
    let date_selected = this.state.date_selected
    console.log(date_selected)
    if (date_selected == "") {
      // ToastAndroid.show("Please pick a date to add report.", ToastAndroid.SHORT);
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
      this.props.navigation.navigate('save_situation_report', {
        data: date_selected
      })
    }
  }


  render() {
    return (
      <ScrollView style={situation_report_styles.container}>
        <NavigationEvents onDidFocus={() => this.displaySituationReportPerDay()} />
        <View style={situation_report_styles.menuSection}>
          <View style={situation_report_styles.buttonSection}>
            <TouchableOpacity style={situation_report_styles.menuButton} onPress={() => this.navigateSituationReport("csr")}>
              <Text style={situation_report_styles.buttonText}>Current Situation Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={situation_report_styles.activeButton} >
              <Text style={situation_report_styles.buttonActiveText}>Situation Logs</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Calendar markedDates={this.state.marked_dates} onDayPress={(day) => { this.selectDateToAddReport(day.dateString) }} />

        <View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => this.navigateSaveSituationReport()}>
              <Text style={defaults.buttonText}>Add Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={situation_report_styles.contentContainer}>
          {this.state.selected_date_situations}
        </View>
      </ScrollView>
    );
  }
}
