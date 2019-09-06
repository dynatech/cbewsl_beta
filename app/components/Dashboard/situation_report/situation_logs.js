import moment from "moment";
import React, { Component } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { NavigationEvents } from 'react-navigation';
import { defaults } from '../../../assets/styles/default_styles';
import { situation_report_styles } from '../../../assets/styles/situation_report_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';
import Sync from '../../utils/syncer';

export default class SituationLogs extends Component {
  constructor(props) {
    super(props);
    let new_days = {};
    this.state = {
      marked_dates: new_days,
      date_selected: "",
      selected_date_situations: [],
      add_report_text: "Add Report",
      spinner: true,
      role_id: 0
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
    let text_date_format = ""
    let date_format = ""
    let time_format = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
      date_format = moment(new Date()).format("YYYY-MM-DD")
      time_format = moment(new Date()).format("h:mm:ss A")
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm:ss A")
      text_date_format = moment(new Date()).format("MMMM D, YYYY")
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
      date_format = moment(date).format("YYYY-MM-DD")
      time_format = moment(date).format("h:mm:ss A")
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm:ss A")
      text_date_format = moment(date).format("MMMM D, YYYY")
    }


    return {
      current_timestamp: current_timestamp,
      date: date_format,
      time: time_format,
      text_format_timestamp: text_format_timestamp,
      text_date_format: text_date_format
    }
  }

  componentWillMount() {
    let credentials = Storage.getItem("loginCredentials");
    credentials.then(response => {
      let role_id = response.role_id;
      this.setState({ role_id: role_id });
    });
  }

  displaySituationReportPerDay() {
    Notification.endOfValidity();
    this.setState({ date_selected: "" })
    let next_days = []
    let new_days = {};

    Sync.clientToServer("SituationReportLogs").then(() => {
      setTimeout(() => {
        fetch('http://192.168.1.10:5000/api/situation_report/get_all_situation_report').then((response) => response.json())
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
            this.setState({ marked_dates: new_days, spinner: false })
            Storage.removeItem("SituationReportLogs")
            Storage.setItem("SituationReportLogs", to_local_data)
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
                this.setState({ marked_dates: new_days, spinner: false })
              } else {
                this.setState({
                  latest_date: "N/A",
                  latest_time: "N/A",
                  summary: "No current situation report",
                  spinner: false
                });
              }
            });
          });
      }, 3000)
    });
  }


  modifySituationReport(data) {
    if (role_id == 1) {
      Alert.alert('Access denied', 'Unable to access this feature.');
    } else {
      this.props.navigation.navigate('save_situation_report', {
        report_data: data
      })
    }
  }

  deleteSituationReport(data) {
    role_id = this.state.role_id;
    if (role_id == 1) {
      Alert.alert('Access denied', 'Unable to access this feature.');
    } else {
      Alert.alert(
        'Warning',
        'Are you sure you want to delete this entry?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes', onPress: () => {
              fetch('http://192.168.1.10:5000/api/situation_report/delete_situation_report', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  situation_report_id: data.situation_report_id
                }),
              }).then((response) => response.json()).then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                  this.displaySituationReportPerDay()
                  ToastAndroid.show('Delete successfull!', ToastAndroid.SHORT);
                  this.setState({ selected_date_situations: [] })
                } else {
                  ToastAndroid.show('Failed to delete entry!', ToastAndroid.SHORT);
                }
              }).catch((error) => {
                console.log(error)
              });
            }
          },
        ],
        { cancelable: false },
      );
    }



  }


  selectDateToAddReport(date) {
    this.setState({ date_selected: date })
    let selected_date = this.formatDateTime(date = date);
    button_text = "Add Report for " + selected_date["text_date_format"];
    this.setState({ add_report_text: button_text })
    fetch('http://192.168.1.10:5000/api/situation_report/get_report_by_date', {
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
        if (responseJson != null && responseJson.length != 0) {
          for (const [index, value] of responseJson.entries()) {
            let format_date_time = this.formatDateTime(date = value.timestamp);
            situation_reports.push(<View style={{ paddingTop: 10, paddingBottom: 10, borderTopWidth: 1, borderColor: '#083451' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Situation Report for {format_date_time["text_date_format"]}</Text>
              <Text style={{ fontSize: 15, marginLeft: 10 }}>{value.summary}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[defaults.button, { width: '20%' }]} onPress={() => this.modifySituationReport(value)}>
                  <Text style={defaults.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[defaults.button, { width: '20%' }]} onPress={() => this.deleteSituationReport(value)}>
                  <Text style={defaults.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>)
          }
        } else {
          situation_reports.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>No report on this date</Text>
          </View>)
        }
        this.setState({ selected_date_situations: situation_reports, spinner: false })
      })
      .catch((error) => {

        let situation_reports = []
        try {
          let get_all_marked_dates = this.state.marked_dates
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
            this.setState({ selected_date_situations: situation_reports, spinner: false })
          });
        }
        catch (err) {
          situation_reports.push(<View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>No report on this date</Text>
          </View>)
          this.setState({ selected_date_situations: situation_reports, spinner: false })
        }
      });
  }

  navigateSaveSituationReport() {
    role_id = this.state.role_id;
    let date_selected = this.state.date_selected
    if (role_id == 1) {
      Alert.alert('Access denied', 'Unable to access this feature.');
    } else {
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
        let data = { date_selected: date_selected };
        this.props.navigation.navigate('save_situation_report', {
          report_data: data
        })
      }
    }

  }


  render() {
    return (
      <ScrollView style={situation_report_styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
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
            <TouchableOpacity style={situation_report_styles.button} onPress={() => this.navigateSaveSituationReport()}>
              <Text style={defaults.buttonText}>{this.state.add_report_text}</Text>
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
