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
      console.log(response)
      let candidate_alert = JSON.parse(response.candidate_alert)
      console.log(candidate_alert[0])
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
        switch (latest[0].public_alert_symbol.alert_level) {
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

        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20 }}>Technical Information</Text>)

        latest[0].releases[0].triggers.forEach(element => {
          view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Event start timestamp: {latest[0].ts_start}</Text>)
          view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Validity: {latest[0].event.validity}</Text>)
          switch (element.internal_sym.alert_symbol) {
            case "m":
            case "M":
              view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Manifestation of movements: {element.info}</Text>)
              break;
            case "R":
              view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Rainfall: {element.info}</Text>)
              break;
            case "E":
              view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Earthquake: {element.info}</Text>)
              break;
          }
        });

        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20 }}>Recommended response: {latest[0].public_alert_symbol.recommended_response}</Text>)
        release_button.push(<TouchableOpacity style={defaults.button} onPress={() => { this.releaseAlertConfirmation(candidate_alert[0]) }}>
          <Text style={defaults.buttonText}>Release</Text>
        </TouchableOpacity>);
        release_button.push(<TouchableOpacity style={defaults.button} onPress={() => { EwiTemplate.EWI_SMS() }}>
          <Text style={defaults.buttonText}>Send EWI</Text>
        </TouchableOpacity>);
        this.setState({ release_button: release_button })
      } else {
        release_button.push(<Text style={{ paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>No current alert</Text>);
        this.setState({ release_button: release_button })
      }

      if (extended.length != 0) {
        // INSERT EXTENDED
        console.log("EXTENDED")
        console.log(extended[0])
      }

      if (overdue.length != 0) {
        console.log(overdue[0])
        switch (overdue[0].public_alert_symbol.alert_level) {
          case 1:
            view.push(<Text style={{ fontSize: 50, color: "red", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 1 (Overdue)</Text>)
            break;
          case 2:
            view.push(<Text style={{ fontSize: 50, color: "red", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 2 (Overdue)</Text>)
            break;
          case 3:
            view.push(<Text style={{ fontSize: 50, color: "red", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 3 (Overdue)</Text>)
            break;
          default:
            view.push(<Text style={{ fontSize: 50, color: "green", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 0</Text>)
            break;
        }

        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20 }}>Technical Information</Text>)

        overdue[0].releases[0].triggers.forEach(element => {
          view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Event start timestamp: {overdue[0].ts_start}</Text>)
          view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Validity: {overdue[0].event.validity}</Text>)
          switch (element.internal_sym.alert_symbol) {
            case "m":
            case "M":
              view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Manifestation of movements: {element.info}</Text>)
              break;
            case "R":
              view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Rainfall: {element.info}</Text>)
              break;
            case "E":
              view.push(<Text style={{ fontSize: 15, paddingBottom: 5 }}>Earthquake: {element.info}</Text>)
              break;
          }

        });
        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20 }}>Recommended response: {overdue[0].public_alert_symbol.recommended_response}</Text>)
        release_button.push(<TouchableOpacity style={defaults.button} onPress={() => { this.releaseAlertConfirmation(candidate_alert[0]) }}>
          <Text style={defaults.buttonText}>Release</Text>
        </TouchableOpacity>);
        release_button.push(<TouchableOpacity style={defaults.button} onPress={() => { EwiTemplate.EWI_SMS() }}>
          <Text style={defaults.buttonText}>Send EWI</Text>
        </TouchableOpacity>);
        this.setState({ release_button: release_button })
      } else {
        release_button.push(<Text style={{ paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>No current alert</Text>);
        this.setState({ release_button: release_button })
      }

      this.setState({ alert_details: view })
    })
  }

  releaseAlertConfirmation(alert_data) {
    Alert.alert(
      'Confirmation',
      'Are you sure do you want to release ?',
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


  formatDateTime(date = null) {
    let timestamp = date
    let text_format_timestamp = ""
    if (timestamp == null) {
      date = moment(new Date()).format("YYYY/MM/DD")
      time = moment(new Date()).format("h:mm:ss A")
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm:ss A")
    } else {
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm:ss A")
    }
    return text_format_timestamp
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
