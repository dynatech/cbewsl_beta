import moment from 'moment';
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';
import Notification from '../../utils/alert_notification';
import { defaults } from '../../../assets/styles/default_styles';
import EwiTemplate from '../../utils/ewi_template';

export default class CurrentAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_details: [],
      release_button: [],
      spinner: false
    };
  }

  navigateEwi(tab) {
    switch (tab) {
      case "alert_validation":
        this.props.navigation.navigate('alert_validation')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  getCurrentAlert() {
    Notification.endOfValidity();
    let offline_data = Storage.getItem("Pub&CandidAlert")
    offline_data.then(response => {
      let candidate_alert = JSON.parse(response.candidate_alert)
      let recommended_response = ""
      let view = []
      let latest = response.leo.latest
      let extended = response.leo.extended
      let overdue = response.leo.overdue
      let alert_details = []
      let alert_level = []
      let moms_header_container = []
      let rain_header_container = []
      let rain_temp = ""
      let moms_temp = ""
      let release_button = [];
      if (latest.length != 0) {
        let alert_level = this.displayAlertLevel(latest[0].public_alert_symbol.alert_level);
        view.push(alert_level)
        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20, textAlign: 'center' }}>Triggers</Text>)
        let triggers = this.displayTrigger(latest[0].releases[0].triggers, latest);
        view.push(triggers);

        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20 }}>Recommended response: {latest[0].public_alert_symbol.recommended_response}</Text>)
        release_button.push(<View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => { this.releaseAlertConfirmation(candidate_alert[0]) }}>
              <Text style={defaults.buttonText}>Release</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.button} onPress={() => { EwiTemplate.EWI_SMS(latest[0].internal_alert_level,latest[0].releases[0].data_ts) }}>
              <Text style={defaults.buttonText}>Send EWI</Text>
            </TouchableOpacity>
          </View>
        </View>);
        this.setState({ release_button: release_button })
      }

      if (extended.length != 0) {
        console.log(extended[0])
        let day_of_extended = "Day " + extended[0].day + " of Extended monitoring";
        let latest_release = extended[0].releases[0].release_time;
        let data_ts = this.formatDateTime(extended[0].releases[0].data_ts);
        let formatted_latest_release = moment(latest_release, 'HH:mm').format('h:mm A');
        let latest_release_text = data_ts["date_only_format"] + " " + formatted_latest_release;

        let alert_level = this.displayAlertLevel(extended[0].public_alert_symbol.alert_level);
        view.push(alert_level);
        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20, textAlign: 'center' }}>{day_of_extended}</Text>)
        view.push(<Text style={{ fontSize: 20, textAlign: 'center' }}>{"Latest release: " + latest_release_text}</Text>)
        release_button.push(<View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => { this.releaseAlertConfirmation(candidate_alert[0]) }}>
              <Text style={defaults.buttonText}>Release</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={true} style={defaults.button} onPress={() => { EwiTemplate.EWI_SMS() }}>
              <Text style={defaults.buttonText}>Send EWI</Text>
            </TouchableOpacity>
          </View>
        </View>);
        this.setState({ release_button: release_button })

      }

      if (overdue.length != 0) {
        let alert_level = this.displayAlertLevel(overdue[0].public_alert_symbol.alert_level);
        view.push(alert_level);
        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20 }}>Triggers</Text>)
        let triggers = this.displayTrigger(overdue[0].releases[0].triggers, overdue);
        view.push(triggers);

        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20 }}>Recommended response: {overdue[0].public_alert_symbol.recommended_response}</Text>)
        release_button.push(<View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => { this.releaseAlertConfirmation(candidate_alert[0]) }}>
              <Text style={defaults.buttonText}>Release</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={true} style={defaults.button} onPress={() => { EwiTemplate.EWI_SMS() }}>
              <Text style={defaults.buttonText}>Send EWI</Text>
            </TouchableOpacity>
          </View>
        </View>);
        this.setState({ release_button: release_button })
      }

      if (latest.length == 0 || extended.length == 0 || overdue.length == 0) {
        release_button.push(<Text style={{ paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>No current alert</Text>);
        this.setState({ release_button: release_button })
      }

      this.setState({ alert_details: view })
      this.setState({ spinner: false })
    })
  }

  displayAlertLevel(alert_level) {
    let view = []
    switch (alert_level) {
      case 1:
        view.push(<Text style={{ fontSize: 50, color: "red", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 1</Text>)
        break;
      case 2:
        view.push(<Text style={{ fontSize: 50, color: "red", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 2</Text>)
        break;
      case 3:
        view.push(<Text style={{ fontSize: 50, color: "red", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 3</Text>)
        break;
      default:
        view.push(<Text style={{ fontSize: 50, color: "green", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 0</Text>)
        break;
    }

    return view;
  }

  displayTrigger(triggers, data) {
    let view = [];
    triggers.forEach(element => {
      let event_start = this.formatDateTime(data[0].event.event_start);
      let validity = this.formatDateTime(data[0].event.validity);
      let latest_release = data[0].releases[0].release_time;
      let data_ts = this.formatDateTime(data[0].releases[0].data_ts);
      let formatted_release_time = moment(latest_release, 'HH:mm').format('h:mm A');
      let latest_release_text = data_ts["date_only_format"] + " " + formatted_release_time;

      switch (element.internal_sym.alert_symbol) {
        case "m":
        case "M":
          view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}>Manifestation of movements: {element.info}</Text>)
          break;
        case "R":
          view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}>Rainfall: {element.info}</Text>)
          break;
        case "E":
          view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}>Earthquake: {element.info}</Text>)
          break;
      }

      view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}>Event Start: {event_start.text_format_timestamp}</Text>)
      view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}>Latest Data: {data_ts.text_format_timestamp}</Text>)
      view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}>Latest Release: {latest_release_text}</Text>)
      view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}>Validity: {validity.text_format_timestamp}</Text>)

    });

    return view;
  }

  releaseAlertConfirmation(alert_data) {
    Alert.alert(
      'Release Alert',
      'Are you sure you want release this alert?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.releaseAlert(alert_data) },
      ],
      { cancelable: false },
    );
  }

  releaseAlert(alert_data) {
    Notification.formatCandidateAlerts(alert_data)
    setTimeout(() => {
      this.getCurrentAlert()
    }, 3000);
  }

  nextRelease(release_time) {
    console.log(release_time)
  }

  formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    let date_format = ""
    let date_only_format = ""
    let time_format = ""
    let time_format2 = ""
    let for_file_name = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS");
      date_format = moment(new Date()).format("YYYY-MM-DD");
      date_only_format = moment(new Date()).format("MMMM D, YYYY");
      time_format = moment(new Date()).format("hh:MM a");
      time_format2 = moment(new Date()).format("HH:MM a");
      text_format_timestamp = moment(new Date()).format("LLL");
      for_file_name = moment(new Date()).format("YYYY_MM_DD_HH_MM_SS");
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS");
      date_format = moment(date).format("YYYY-MM-DD");
      date_only_format = moment(date).format("MMMM D, YYYY");
      time_format = moment(date).format("hh:MM a");
      time_format2 = moment(date).format("HH:MM a");
      text_format_timestamp = moment(date).format("LLL");
      for_file_name = moment(date).format("YYYY_MM_DD_HH_MM_SS");
    }

    return {
      current_timestamp: current_timestamp,
      date: date_format,
      time_format: time_format,
      time_format2: time_format2,
      date_only_format: date_only_format,
      text_format_timestamp: text_format_timestamp,
      for_file_name: for_file_name
    }
  }

  render() {
    return (
      <ScrollView style={field_survey_styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <NavigationEvents onDidFocus={() => this.getCurrentAlert()} />
        <View style={field_survey_styles.menuSection}>
          <View style={field_survey_styles.buttonSection}>
            <TouchableOpacity style={field_survey_styles.activeButton} >
              <Text style={field_survey_styles.buttonActiveText}>Current Alert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={field_survey_styles.menuButton} onPress={() => this.navigateEwi("alert_validation")}>
              <Text style={field_survey_styles.buttonText}>Alert Validation</Text>
            </TouchableOpacity>
          </View>
          <View>
            {this.state.alert_details}
            {this.state.release_button}
          </View>
        </View>
      </ScrollView>
    );
  }
}
