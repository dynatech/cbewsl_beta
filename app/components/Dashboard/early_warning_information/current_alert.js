import moment from 'moment';
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';
import Notification from '../../utils/alert_notification';

export default class CurrentAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_details: [],
      alert_level: "",
      alert_trigger: [],
      rain_alert_trigger: [],
      alert_validity: "",
      moms_header: [],
      rain_header: [],
      spinner: false
    };
  }

  navigateEwi(tab) {
    switch(tab) {
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
      let alert_details = []
      let alert_level = []
      let moms_header_container = []
      let rain_header_container = []
      let rain_temp = ""
      let moms_temp = ""

      if (response.leo.latest.length != 0) {

       } else {
        if (response.leo.extended != 0) {

        } else {
          if (response.leo.overdue != 0) {

          } else {

          }
        }
      }
      // if (response != null || response != undefined) {
      //   if (response.alert_level == "0") {
      //     alert_level.push(<Text style={{fontSize: 50, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 0</Text>)
      //   } else if (response.alert_level == "1") {
      //     alert_level.push(<Text style={{fontSize: 50, color: "#f09e01", fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 1</Text>)
      //   } else if (response.alert_level == "2") {
      //     alert_level.push(<Text style={{fontSize: 50, color: "#f27e10", fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 2</Text>)
      //   } else if (response.alert_level == "3") {
      //     alert_level.push(<Text style={{fontSize: 50, color: "#ef7b7e", fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 3</Text>)
      //   } else {
      //     alert_level.push(<Text style={{fontSize: 50, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 0</Text>)
      //   }

      //   response.trig_list.forEach(function(element) {
      //     if (element.int_sym == "M") {
      //       if (moms_header_container.length == 0) {
      //         moms_header_container.push(<Text style={{fontWeight: 'bold', fontSize: 20}}>Manifestation of Movements</Text>)
      //       }
      //       moms_temp = "Feature type: "+ element.f_type+"("+element.f_name+")\n"+
      //             "Description: "+ element.remarks+"\n"
      //     } else {
      //       if (rain_header_container.length == 0) {
      //         rain_header_container.push(<Text style={{fontWeight: 'bold', fontSize: 20}}>Rainfall Alert</Text>)
      //       }
      //       rain_temp = "Rainfall data exceeded threshold level."
      //     }
      //   });
  
      //   alert_details.push(
      //     <View style={{padding: 20}}>
      //       {alert_level}
      //       <Text style={{fontSize: 20, fontWeight: 'bold'}}>Triggers</Text>
      //       <View style={{padding: 20}}>
      //         {moms_header_container}
      //         <Text style={{fontSize: 20}}>{moms_temp}</Text>
      //         {rain_header_container}
      //         <Text style={{fontSize: 20}}>{rain_temp}</Text>
      //       </View>
      //       <Text style={{fontSize: 20, fontWeight: 'bold'}}>Validity</Text>
      //       <View style={{padding: 20}}>
      //         <Text style={{fontSize: 20}}>{this.formatDateTime(response.alert_validity)}</Text>
      //       </View>
      //     </View>
      //   )
      //   this.setState({alert_details: alert_details, spinner: false})
      // } else {
      //   alert_level.push(<Text style={{fontSize: 50, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 0</Text>)
      //   alert_details.push(
      //     <View style={{padding: 20}}>
      //       {alert_level}
      //       <Text style={{fontSize: 25, fontWeight: 'bold', color: '#4a8e1c', width: '100%', textAlign: 'center'}}>No candidate alerts.</Text>
      //     </View>
      //   )
      //   this.setState({alert_details: alert_details, spinner: false})
      // }
    })
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
            </View>
        </View>
      </ScrollView>
    );
  }
}
