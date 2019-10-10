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
      retrigger_details: [],
      spinner: false,
      event_start_ts: ""
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
      let has_alert_data = false;
      let release_button = [];
      console.log(response)
      if (latest.length != 0) {
        let event_details = this.formatEwiDetails(candidate_alert, latest[0], true);
        view.push(event_details)
        let current_alert_level = latest[0].public_alert_symbol.alert_level;
        if(current_alert_level != 0){
          release_button.push(<View style={{ textAlign: 'center', flex: 0.5 }}>
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <TouchableOpacity style={defaults.button} onPress={() => { this.releaseAlertConfirmation(candidate_alert[0]) }}>
                <Text style={defaults.buttonText}>Release</Text>
              </TouchableOpacity>
              <TouchableOpacity style={defaults.button} onPress={() => { EwiTemplate.EWI_SMS(latest[0].internal_alert_level, latest[0].releases[0].data_ts) }}>
                <Text style={defaults.buttonText}>Send EWI</Text>
              </TouchableOpacity>
            </View>
          </View>);
          this.setState({ release_button: release_button })
        }
        
      }

      if (extended.length != 0) {
        let day_of_extended = "Day " + extended[0].day + " of Extended monitoring";
        let latest_release = extendegetCurrentAlertd[0].releases[0].release_time;
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
        let event_details = this.formatEwiDetails(candidate_alert, overdue[0], true);
        view.push(event_details)
        let current_alert_level = latest[0].public_alert_symbol.alert_level;
        if(current_alert_level != 0){
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
        view.push(<Text style={{ fontSize: 50, color: "#ee9d01", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 1</Text>)
        break;
      case 2:
        view.push(<Text style={{ fontSize: 50, color: "#ee9d01", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 2</Text>)
        break;
      case 3:
        view.push(<Text style={{ fontSize: 50, color: "#ff0018", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 3</Text>)
        break;
      default:
        view.push(<Text style={{ fontSize: 50, color: "green", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 0</Text>)
        break;
    }

    return view;
  }

  displayTrigger(triggers) {
    let view = [];
      triggers.forEach(element => {
        switch (element.internal_sym.alert_symbol) {
          case "m":
          case "M":
            view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Manifestation of movements:</Text> {element.info}</Text>)
            break;
          case "R":
            view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Rainfall Trigger:</Text> {element.info}</Text>)
            break;
          case "E":
            view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Earthquake:</Text> {element.info}</Text>)
            break;
        }
      });

    return view;
  }

  formatEwiDetails(candidate_alert, leo_data, has_alert_data){
    console.log(candidate_alert);
    console.log(leo_data);

    let event_details = [];
    let current_alert_level = leo_data.public_alert_symbol.alert_level;
    if(current_alert_level != 0){
      let latest_event_triggers = leo_data.latest_event_triggers;
      let latest_release_trigger_id = 0;
      let event_start = this.formatDateTime(leo_data.event.event_start);
      let validity = this.formatDateTime(leo_data.event.validity);
      let latest_release_text = "none";
      let release_ts = "";
      let trigger = leo_data.releases[0].triggers;
      let recommended_response = leo_data.public_alert_symbol.recommended_response;
      let formatted_as_of = "";
      let latest_data_information = "";
      let has_trigger = false;
      let trigger_list_trigger_id = 0;
      let release_schedule = "";
      let general_status = "";

      if(candidate_alert.length == 0){
        formatted_as_of = this.formatDateTime(leo_data.releases[0].data_ts);
      }else{
        formatted_as_of = this.formatDateTime(candidate_alert[0].release_details.data_ts);
        let trigger_list_arr = candidate_alert[0].trigger_list_arr;
        general_status = candidate_alert[0].general_status
        if(candidate_alert[0].public_alert_symbol == "A0"){
            release_schedule = candidate_alert[0].release_details.data_ts;
        }else{
            release_schedule = candidate_alert[0].release_schedule;
        }

        let update_ts = moment(release_schedule).add(30, "minutes").format("YYYY-MM-DD HH:mm:SS");
        release_schedule = this.formatDateTime(update_ts);
        if(trigger_list_arr.length != 0){
          has_trigger = true;
          trigger_list_arr.forEach(value => {
            if(trigger_list_trigger_id == 0){
              trigger_list_trigger_id = value.trigger_id
            }
          });
        }else{
          has_trigger = false;
        }
      }


      leo_data.releases.forEach(value => {
        if(latest_release_text == "none"){
          let formatted_release_time = moment(value.release_time, 'HH:mm').format('h:mm A');
          release_ts = this.formatDateTime(value.data_ts);
          if(release_ts["text_format_timestamp"] == event_start["text_format_timestamp"]){
            release_ts = this.formatDateTime(value.data_ts);
          }else{
            let update_ts = moment(value.data_ts).add(30, "minutes").format("YYYY-MM-DD HH:mm:SS");
            release_ts = this.formatDateTime(update_ts);
          }
          latest_release_text = release_ts["date_only_format"] + " " + formatted_release_time;
        }
      });
      
      let alert_level = this.displayAlertLevel(leo_data.public_alert_symbol.alert_level);
      event_details.push(alert_level)
      event_details.push(<Text style={{fontSize: 20, padding: 10, textAlign: 'center'}}>As of last release timestamp <Text style={{fontWeight: 'bold'}}>{release_ts.text_format_timestamp}</Text></Text>)
      if (trigger.length == 0) {
        event_details.push(<Text style={{fontSize: 20, paddingBottom: 10, textAlign: 'center'}}>No new retriggers.</Text>)
      } else {
        latest_release_trigger_id = leo_data.releases[0].triggers[0].trigger_id;
        trigger.forEach(value => {
          let internal_symbol = value.internal_sym.alert_symbol;
          if (internal_symbol == "E") {
            let magnitude = value.trigger_misc.eq.magnitude;
            let longitude = value.trigger_misc.eq.longitude;
            let latitude = value.trigger_misc.eq.latitude;
            let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
            event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>Earthquake: {earth_quake_info}</Text>)
          } else if (internal_symbol == "R") {
            let rain_info = value.info;
            event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>Rainfall: {rain_info}</Text>)
          } else if (internal_symbol == "m" || internal_symbol == "M") {
            let moms_info = value.info;
            event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>Moms: {moms_info}</Text>)
          }
        });
      }
      event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>Event started at <Text style={{fontWeight: 'bold'}}>{event_start.text_format_timestamp}</Text></Text>)
      event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>Valid until <Text style={{fontWeight: 'bold'}}>{validity.text_format_timestamp}</Text></Text>)
      event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>Latest release timestamp: <Text style={{fontWeight: 'bold'}}>{latest_release_text}</Text></Text>)
      event_details.push(<Text style={{ fontSize: 20, paddingTop: 15, textAlign: 'center' }}><Text style={{ fontWeight: 'bold' }}>Recommended response:</Text> {recommended_response}</Text>)
      let is_moms = false;
      if(has_trigger == false){
        if(latest_event_triggers.length != 0){
          latest_event_triggers.forEach(value => {
            let ts = this.formatDateTime(value.ts);
            let trigger_id = value.trigger_id;
            if(trigger_id != latest_release_trigger_id){
              event_details.push(<View style={{ borderWidth: 1, marginLeft: 20, marginRight: 20, marginBottom: 20, marginTop: 15, borderColor: '#083451', borderRadius: 10 }}></View>)
              let internal_symbol = value.internal_sym.alert_symbol;
    
              if (internal_symbol == "E") {
                  let magnitude = value.trigger_misc.eq.magnitude;
                  let longitude = value.trigger_misc.eq.longitude;
                  let latitude = value.trigger_misc.eq.latitude;
                  let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
                  event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>As of last earthquake retrigger at <Text style={{fontWeight: 'bold'}}>{ts.text_format_timestamp}</Text></Text>)
                  event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>{earth_quake_info}</Text>)
              } else if (internal_symbol == "R") {
                  let rain_info = value.info;
                  event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>As of last rainfall retrigger at <Text style={{fontWeight: 'bold'}}>{ts.text_format_timestamp}</Text></Text>)
                  event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>{rain_info}</Text>)
              } else if (internal_symbol == "m" || internal_symbol == "M") {
                  is_moms = true;
                  let moms_info = value.info;
                  event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>As of last moms retrigger at <Text style={{fontWeight: 'bold'}}>{ts.text_format_timestamp}</Text></Text>)
                  event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>{moms_info}</Text>)
              }
            }
                  
        });
        }
      }else{
        let trigger_list_arr = candidate_alert[0].trigger_list_arr;
        trigger_list_arr.forEach(value => {
          let ts = this.formatDateTime(value.ts_updated);
          let trigger_type = value.trigger_type;
          let tech_info = value.tech_info;
          let trigger_id = value.trigger_id;
          if(trigger_id != trigger_list_trigger_id){
            event_details.push(<View style={{ borderWidth: 1, marginLeft: 20, marginRight: 20, marginBottom: 20, marginTop: 15, borderColor: '#083451', borderRadius: 10 }}></View>)
            if(trigger_type == "rainfall"){
              event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>As of last rainfall retrigger at <Text style={{fontWeight: 'bold'}}>{ts.text_format_timestamp}</Text></Text>)
              event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>{tech_info}</Text>)
            }else if(trigger_type == "moms"){
              is_moms = true;
              event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>As of last moms retrigger at <Text style={{fontWeight: 'bold'}}>{ts.text_format_timestamp}</Text></Text>)
              event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>{tech_info}</Text>)
            }else if(trigger_type == "earthquake"){
              let magnitude = value.trigger_misc.eq.magnitude;
              let longitude = value.trigger_misc.eq.longitude;
              let latitude = value.trigger_misc.eq.latitude;
              let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
              event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>As of last earthquake retrigger at <Text style={{fontWeight: 'bold'}}>{ts.text_format_timestamp}</Text></Text>)
              event_details.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}>{earth_quake_info}</Text>)
            }
          }
        });
        
      }
      let candidate_for_lowering = false
      if(validity["text_format_timestamp"] == release_schedule["text_format_timestamp"]){
        candidate_for_lowering = true;
      }
      this.setState({ retrigger_details: this.getRetriggers(candidate_alert, candidate_for_lowering, general_status, is_moms) });
    }

    return event_details
  }

  releaseAlertConfirmation(alert_data) {
    console.log(alert_data);
    if (alert_data != null) {
      if (alert_data.is_release_time == false) {
        Alert.alert('Notice', 'Please wait for the next release time.')
      } else {
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
    } else {
      Alert.alert('Notice', 'Please wait for the next release time.')
    }
  }

  releaseAlert(alert_data) {
    Notification.formatCandidateAlerts(alert_data)
    setTimeout(() => {
      Alert.alert('Success', 'Successfully release!')
      this.getCurrentAlert();
    }, 3000);
  }

  getRetriggers(data, candidate_for_lowering, general_status, is_moms) {
    let view = []
    let temp = []

    if (data.length != 0) {
      if (data[0].trigger_list_arr != 0) {

        view.push(<View style={{ borderWidth: 1, marginLeft: 20, marginRight: 20, marginBottom: 20, marginTop: 15, borderColor: '#083451', borderRadius: 10 }}></View>
        )
        let current_time =  this.formatDateTime(data[0].release_details.data_ts);
        temp.push(<View><Text style={{ fontSize: 20, paddingBottom: 5 }}>As of <Text style={{ fontWeight: 'bold' }}>{current_time.text_format_timestamp}</Text></Text></View>)

        this.setState({ trigger_length: data[0].trigger_list_arr.length })
        data[0].trigger_list_arr.forEach(element => {
          switch (element.trigger_type) {
            case "rainfall":
              invalid_flag = []
              if (element.invalid == true) {
                this.setState({ trigger_length: this.state.trigger_length - 1 })
                invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%', color: 'red' }}><Text style={{ fontWeight: 'bold' }}>Rainfall Alert (INVALID):</Text> {element.tech_info}</Text>)
              } else {
                invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%' }}><Text style={{ fontWeight: 'bold' }}>Rainfall Alert:</Text> {element.tech_info}</Text>)
              }
              break;
            case "moms":
              invalid_flag = []
              if (element.invalid == true) {
                this.setState({ trigger_length: this.state.trigger_length - 1 })
                invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%', color: 'red' }}><Text style={{ fontWeight: 'bold' }}>Surficial Alert (INVALID):</Text> {element.tech_info}</Text>)
              } else {
                invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%' }}><Text style={{ fontWeight: 'bold' }}>Surficial Alert:</Text> {element.tech_info}</Text>)
              }
              break;
            case "earthquake":
              invalid_flag = []
              if (element.invalid == true) {
                this.setState({ trigger_length: this.state.trigger_length - 1 })
                invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%', color: 'red' }}><Text style={{ fontWeight: 'bold' }}>Earthquake Alert (INVALID):</Text> {element.tech_info}</Text>)
              } else {
                invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%' }}><Text style={{ fontWeight: 'bold' }}>Earthquake Alert:</Text> {element.tech_info}</Text>)
              }
              break;
          }
        })
        temp.push(invalid_flag)

      } else {

        if (data[0].release_details.data_ts != this.state.event_start_ts) {

          view.push(<View style={{ borderWidth: 1, marginLeft: 20, marginRight: 20, marginBottom: 20, marginTop: 15, borderColor: '#083451', borderRadius: 10 }}></View>
          )
          let current_time = this.formatDateTime(data[0].release_details.data_ts)
          temp.push(<View><Text style={{ fontSize: 20, paddingBottom: 5 }}>As of <Text style={{ fontWeight: 'bold' }}>{current_time.text_format_timestamp}</Text></Text></View>)

          temp.push(<View><Text style={{ fontSize: 20, paddingBottom: 5 }}>No new retriggers.</Text></View>)
        }
      }
    }
    view.push(<View style={{ alignItems: 'center', textAlign: 'center' }}>{temp}</View>)

    if(candidate_for_lowering == true){
      if(general_status == "lowering"){
        view.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}><Text style={{fontWeight: 'bold'}}>END OF VALIDITY</Text></Text>)
      }else{
        view.push(<Text style={{ fontSize: 20, paddingBottom: 5, textAlign: 'center' }}><Text style={{fontWeight: 'bold'}}>Candidate for lowering.</Text></Text>)
        if(is_moms == false){
          view.push(<View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity style={defaults.button} onPress={() => { this.raiseNonSignificantPrompt() }}>
            <Text style={defaults.buttonText}>Raise Non-Significant</Text>
          </TouchableOpacity>
        </View>);
        }
      }
      
    }
    return view;
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
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:ss");
      date_format = moment(new Date()).format("YYYY-MM-DD");
      date_only_format = moment(new Date()).format("MMMM D, YYYY");
      time_format = moment(new Date()).format("hh:MM a");
      time_format2 = moment(new Date()).format("HH:MM a");
      text_format_timestamp = moment(new Date()).format("LLL");
      for_file_name = moment(new Date()).format("YYYY_MM_DD_HH_MM_SS");
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:ss");
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

  raiseNonSignificantPrompt(){
    Alert.alert(
      'Raise Non-Significant',
      'Are you sure you want release this non-significant?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.raiseNonSignificant() },
      ],
      { cancelable: false },
    );
  }

  raiseNonSignificant(){
    let current_ts = this.formatDateTime();
    let alert_validity = current_ts.current_timestamp;
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
    let trigger_list = {
      alert_level: 0,
      alert_validity: alert_validity,
      data_ts: current_ts.current_timestamp,
      observance_ts: current_ts.current_timestamp,
      user_id: 1,
      trig_list: [
          {
              int_sym: "m0",
              remarks: "Lowering",
              f_name: "none",
              f_type: "none"
          }
      ]
    }
    console.log(trigger_list)
    let url = 'http://192.168.1.10:5000/api/monitoring/insert_cbewsl_moms_ewi_web2';
    fetch(url, {
        method: 'POST',
        dataType: 'jsonp',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(trigger_list),
    }).then((responseJson) => {
        Alert.alert('Success', 'Successfully raise non-significant')
    });
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
            {this.state.retrigger_details}
            {this.state.release_button}
          </View>
        </View>
      </ScrollView>
    );
  }
}
