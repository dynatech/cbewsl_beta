import moment from 'moment';
import React, { Component } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { defaults } from '../../../assets/styles/default_styles';
import { ewi_styles } from '../../../assets/styles/ewi_styles';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';
import Notification from '../../utils/alert_notification';

export default class AlertValidation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidate_alert_label: "No candidate alerts.",
      local_data_candidate_container: [],
      server_data_candidate_container: [],
      local_data: [],
      server_data: [],
      datetime: "",
      trigger_length: 0,
      spinner: true
    };
  }

  navigateEwi(tab) {
    switch (tab) {
      case "current_alert":
        console.log(tab);
        this.props.navigation.navigate('current_alert')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  validateAlert(trigger_id, valid, remarks, user_id, candidate_alerts) {
    Alert.alert(
      'Release Alert',
      'Are you sure you want raise this alert?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.confirmValidateAlert(trigger_id, valid, remarks, user_id, candidate_alerts) },
      ],
      { cancelable: false },
    );

  }

  confirmValidateAlert(trigger_id, valid, remarks, user_id, candidate_alerts) {
    if (this.state.trigger_length == 1) {
      Notification.formatCandidateAlerts(candidate_alerts)
      setTimeout(() => {
        this.constructValidation()
      }, 3000);
    } else {
      let status = Notification.validateAlert(trigger_id, valid, remarks, user_id, candidate_alerts);
      status.then(response => {
        setTimeout(
          () => {
            this.constructValidation()
          },
          3000
        )
      })
    }
  }

  componentDidMount() {
    Notification.endOfValidity();
    this.constructValidation();
  }

  constructValidation() {
    let offline_data = Storage.getItem("Pub&CandidAlert")
    let temp_rainfall = [];
    let temp_moms = [];
    let temp_earthquake = [];
    let invalid_flag = []
    let disable_invalid = [];
    let cred = Storage.getItem("loginCredentials");
    cred.then(cred_response => {
      offline_data.then(response => {
        let candidate = JSON.parse(response.candidate_alert)
        if (candidate.length != 0) {
          this.setState({ trigger_length: candidate[0].trigger_list_arr.length })
          if (candidate[0].trigger_list_arr == 0) {
            temp_rainfall.push(<Text style={{ paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>Rainfall Alert: No rainfall alert</Text>)
            temp_moms.push(<Text style={{ paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>Surficial Alert: No surficial alert.</Text>)
            temp_earthquake.push(<Text style={{ paddingTop: '10%', paddingBottom: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>Earthquake Alert: No earthquake alert.</Text>)

          } else {
            candidate[0].trigger_list_arr.forEach(element => {
              disable_invalid = []
              let as_of_current_ts = this.formatDateTime(element.ts_updated)
              switch (element.trigger_type) {
                case "rainfall":
                  invalid_flag = []
                  if (element.invalid == true) {
                    this.setState({ trigger_length: this.state.trigger_length - 1 })
                    invalid_flag.push(<Text style={{ paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%', color: 'red' }}>Rainfall Alert (INVALID): {element.tech_info}</Text>)
                    disable_invalid.push(
                      <TouchableOpacity disabled={true} style={defaults.button_error} onPress={() => { this.validateAlert(element.trigger_id, -1, "", cred_response.user_data.account_id, candidate[0]) }}>
                        <Text style={defaults.buttonText}>Invalid</Text>
                      </TouchableOpacity>)
                  } else {
                    console.log(element)
                    invalid_flag.push(<Text style={{ paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>As of {as_of_current_ts["text_format_timestamp"]}</Text>)
                    invalid_flag.push(<Text style={{ color: "#f59823", textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>Rainfall Alert: {element.tech_info}</Text>)
                    disable_invalid.push(
                      <TouchableOpacity style={defaults.button} onPress={() => { this.validateAlert(element.trigger_id, -1, "", cred_response.user_data.account_id, candidate[0]) }}>
                        <Text style={defaults.buttonText}>Invalid</Text>
                      </TouchableOpacity>)
                  }
                  temp_rainfall.push(invalid_flag)
                  temp_rainfall.push(
                    <View style={{ textAlign: 'center', flex: 0.5 }}>
                      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={defaults.button} onPress={() => { this.validateAlert(element.trigger_id, 1, "", cred_response.user_data.account_id, candidate[0]) }}>
                          <Text style={defaults.buttonText}>Valid</Text>
                        </TouchableOpacity>
                        {disable_invalid}
                      </View>
                    </View>
                  )
                  break;
                case "moms":
                  invalid_flag = []
                  if (element.invalid == true) {
                    this.setState({ trigger_length: this.state.trigger_length - 1 })
                    invalid_flag.push(<Text style={{ paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%', color: 'red' }}>Surficial Alert (INVALID): {element.tech_info}</Text>)
                    disable_invalid.push(
                      <TouchableOpacity disabled={true} style={defaults.button_error} onPress={() => { this.validateAlert(element.trigger_id, -1, "", cred_response.user_data.account_id, candidate[0]) }}>
                        <Text style={defaults.buttonText}>Invalid</Text>
                      </TouchableOpacity>)
                  } else {
                    invalid_flag.push(<Text style={{ color: "#f59823", paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>Surficial Alert: {element.tech_info}</Text>)
                    disable_invalid.push(
                      <TouchableOpacity style={defaults.button} onPress={() => { this.validateAlert(element.trigger_id, -1, "", cred_response.user_data.account_id, candidate[0]) }}>
                        <Text style={defaults.buttonText}>Invalid</Text>
                      </TouchableOpacity>)
                  }
                  temp_moms.push(invalid_flag)
                  temp_moms.push(
                    <View style={{ textAlign: 'center', flex: 0.5 }}>
                      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={defaults.button} onPress={() => { this.validateAlert(element.trigger_id, 1, "", cred_response.user_data.account_id, candidate[0]) }}>
                          <Text style={defaults.buttonText}>Valid</Text>
                        </TouchableOpacity>
                        {disable_invalid}
                      </View>
                    </View>)
                  break;
                case "earthquake":
                  invalid_flag = []
                  if (element.invalid == true) {
                    this.setState({ trigger_length: this.state.trigger_length - 1 })
                    invalid_flag.push(<Text style={{ paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%', color: 'red' }}>Earthquake Alert (INVALID): {element.tech_info}</Text>)
                    disable_invalid.push(
                      <TouchableOpacity disabled={true} style={defaults.button_error} onPress={() => { this.validateAlert(element.trigger_id, -1, "", cred_response.user_data.account_id, candidate[0]) }}>
                        <Text style={defaults.buttonText}>Invalid</Text>
                      </TouchableOpacity>)
                  } else {
                    invalid_flag.push(<Text style={{ color: "#f59823", paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>Earthquake Alert: {element.tech_info}</Text>)
                    disable_invalid.push(
                      <TouchableOpacity style={defaults.button} onPress={() => { this.validateAlert(element.trigger_id, -1, "", cred_response.user_data.account_id, candidate[0]) }}>
                        <Text style={defaults.buttonText}>Invalid</Text>
                      </TouchableOpacity>)
                  }
                  temp_earthquake.push(invalid_flag)
                  temp_earthquake.push(
                    <View style={{ textAlign: 'center', flex: 0.5 }}>
                      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={defaults.button} onPress={() => { this.validateAlert(element.trigger_id, 1, "", cred_response.user_data.account_id, candidate[0]) }}>
                          <Text style={defaults.buttonText}>Valid</Text>
                        </TouchableOpacity>
                        {disable_invalid}
                      </View>
                    </View>)
                  break;
              }
            });
          }


        } else {
          if (temp_rainfall.length == 0) {
            temp_rainfall.push(<Text style={{ paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>Rainfall Alert: No rainfall alert</Text>)
          }

          if (temp_moms.length == 0) {
            temp_moms.push(<Text style={{ paddingTop: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>Surficial Alert: No surficial alert.</Text>)
          }

          if (temp_earthquake.length == 0) {
            temp_earthquake.push(<Text style={{ paddingTop: '10%', paddingBottom: '10%', textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%' }}>Earthquake Alert: No earthquake alert.</Text>)
          }
        }

        let temp = [<View>
          {temp_rainfall}
          {temp_moms}
          {temp_earthquake}
        </View>]

        this.setState({ local_data_candidate_container: temp, spinner: false })
      });
    });
  }


  requestDataToPhivolcs() {
    Alert.alert('Feature comming soon.')
  }

  raiseAlert() {
    Alert.alert(
      'Raise Alert',
      'Are you sure you want raise this alert?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Release Alert',
          onPress: () => {
            let offline_data = Storage.getItem("Pub&CandidAlert")
            offline_data.then(response => {
              if (response != null || response != undefined) {
                let temp = {
                  int_sym: "R",
                  info: "Rainfall data exceeded threshold level."
                }
                response.trig_list.push(temp)
                response.alert_validity = moment(response.alert_validity).add(48, 'hours').format("YYYY-MM-DD HH:mm:00")
                Storage.setItem("Pub&CandidAlert", response)
              } else {
                let cred = Storage.getItem("loginCredentials");
                cred.then(response => {
                  let alert_validity = ""
                  let hour = moment(this.state.datetime).hours()
                  if (hour >= 0 && hour < 4) {
                    alert_validity = moment(this.state.datetime).add(24, 'hours').format("YYYY-MM-DD 04:00:00")
                  } else if (hour >= 4 && hour < 8) {
                    alert_validity = moment(this.state.datetime).add(24, 'hours').format("YYYY-MM-DD 08:00:00")
                  } else if (hour >= 8 && hour < 12) {
                    alert_validity = moment(this.state.datetime).add(24, 'hours').format("YYYY-MM-DD 12:00:00")
                  } else if (hour >= 12 && hour < 16) {
                    alert_validity = moment(this.state.datetime).add(24, 'hours').format("YYYY-MM-DD 16:00:00")
                  } else if (hour >= 16 && hour < 20) {
                    alert_validity = moment(this.state.datetime).add(24, 'hours').format("YYYY-MM-DD 20:00:00")
                  } else if (hour >= 20) {
                    alert_validity = moment(this.state.datetime).add(48, 'hours').format("YYYY-MM-DD 00:00:00")
                  }

                  let temp = {
                    alert_level: "1",
                    data_ts: this.state.datetime,
                    user_id: response.user_data.account_id,
                    alert_validity: alert_validity,
                    trig_list: []
                  }

                  let trig_list = {
                    int_sym: "R",
                    info: "Rainfall data exceeded threshold level."
                  }

                  temp.trig_list.push(trig_list)
                  let raised_alerts = Storage.setItem("Pub&CandidAlert", temp);
                })
              }
              this.setState({ spinner: false })
            })
          },
        }
      ],
      { cancelable: false },
    );
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
      <ScrollView style={ewi_styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <View style={ewi_styles.menuSection}>
          <View style={ewi_styles.buttonSection}>
            <TouchableOpacity style={ewi_styles.menuButton} onPress={() => this.navigateEwi("current_alert")}>
              <Text style={ewi_styles.buttonText}>Current Alert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ewi_styles.activeButton} >
              <Text style={ewi_styles.buttonActiveText}>Alert Validation</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={ewi_styles.menuContainer}>
          <Text style={{ paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Validate Alert from PHIVOLCS</Text>
          <View style={{ textAlign: 'center', flex: 0.5, paddingTop: '10%' }}>
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              {this.state.candidate_alerts}
              <TouchableOpacity style={defaults.button} onPress={() => { this.requestDataToPhivolcs() }}>
                <Text style={defaults.buttonText}>Request data from server via SMS</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Validate Alert from Local Data</Text>
          {this.state.local_data_candidate_container}
          <View style={{ paddingTop: '5%', borderTopWidth: 2, borderColor: "#083451", }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Manual EWI Release</Text>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: '5%' }}>
            <Text style={{ paddingTop: '1%', textAlign: 'center', alignSelf: 'center', fontSize: 15, fontWeight: 'bold', width: '30%' }}>Rainfall Alert: </Text>
            <DatePicker
              customStyles={{ dateInput: { borderWidth: 0, borderBottomWidth: 5, borderColor: "#083451", } }}
              style={[{ width: '70%' }]}
              format="YYYY-MM-DD HH:mm:00"
              date={this.state.datetime}
              mode="datetime"
              placeholder="Pick date and time"
              duration={400}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={(date) => { this.setState({ datetime: date }) }}
            />
          </View>
          <View style={{ flexDirection: 'row', paddingTop: '5%' }}>
            <Text style={{ height: 50, textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '30%' }}>Surficial Alert (Not Available): </Text>
            <DatePicker
              customStyles={{ dateInput: { borderWidth: 0, borderBottomWidth: 5, borderColor: "#083451", } }}
              disabled={true}
              style={[{ width: '70%' }]}
              format="YYYY-MM-DD HH:mm"
              date=""
              mode="datetime"
              placeholder="Pick date and time"
              duration={400}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={(date) => { console.log(date) }}
            />
          </View>
          <View style={{ textAlign: 'center', flex: 0.5, paddingTop: '10%' }}>
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <TouchableOpacity style={defaults.button} onPress={() => this.raiseAlert()}>
                <Text style={defaults.buttonText}>Raise Alert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
