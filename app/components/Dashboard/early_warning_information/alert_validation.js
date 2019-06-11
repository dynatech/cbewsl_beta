import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity, Alert} from 'react-native';
import {ewi_styles} from '../../../assets/styles/ewi_styles'
import {defaults} from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'

export default class AlertValidation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidate_alert_label: "No candidate alerts.",
      local_data_candidate_container: [],
      server_data_candidate_container: [],
      local_data: [],
      server_data: [],
      datetime: ""
    };
  }

  navigateEwi(tab) {
    switch(tab) {
      case "current_alert":
        console.log(tab);
        this.props.navigation.navigate('current_alert')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }
  
  componentDidMount() {
    let temp = []
    if (this.state.local_data.length != 0) {
      // Add computation for surficial data
    } else if (this.state.server_data.length != 0) {
      // Add
    } else {
      temp.push(<View>
                  <Text style={{paddingTop: '10%',textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%'}}>Rainfall Alert: No rainfal data available</Text>
                  <Text style={{paddingTop: '10%',textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '100%'}}>Surficial Alert: No candidate alerts.</Text>
                </View>)
    }
    this.setState({local_data_candidate_container: temp})
  }

  raiseAlert() {
    Alert.alert(
      'Release Alert',
      'Are you sure you want release to this alert?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Release Alert',
          onPress: () => {
            let offline_data = Storage.getItem("alertGeneration")
            offline_data.then(response => {
              let current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
              if (response != null || response != undefined) {
                response.triggers.rain_id = 0
                let temp = {
                  interal_alert: "mR",
                  release_timestamp: current_timestamp,
                  alert_level: response.alert_level,
                  last_alert_release: current_timestamp,
                  event_start: response.event_start,
                  last_retrigger: current_timestamp,
                  triggers: response.triggers,
                  validity: moment(response.validity).add(48, 'hours').format("YYYY-MM-DD HH:mm:00")
                }
                Storage.setItem("alertGeneration", temp)
              } else {
                let temp = {
                  interal_alert: "R",
                  release_timestamp: this.state.datetime,
                  alert_level: "A1",
                  last_alert_release: this.state.datetime,
                  event_start: this.state.datetime,
                  last_retrigger: this.state.datetime,
                  triggers: {rain_id:0},
                  validity: moment(this.state.datetime).add(24, 'hours').format("YYYY-MM-DD HH:mm:00")
                }
                Storage.setItem("alertGeneration", temp)
              }
            })
          },
        }
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
        <ScrollView style={ewi_styles.container}>
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
          <Text style={{paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Validate Alert from PHIVOLCS</Text>
          <View style={{ textAlign: 'center', flex: 0.5 , paddingTop: '10%'}}>
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <TouchableOpacity style={defaults.button}>
                <Text style={defaults.buttonText}>Request data from server</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Validate Alert from Local Data</Text>
          {/* {this.state.local_data_candidate_container} */}
          <View style={{flexDirection: 'row',paddingTop: '5%'}}>
            <Text style={{paddingTop: '1%',textAlign: 'center', alignSelf: 'center', fontSize: 15, fontWeight: 'bold', width: '30%'}}>Rainfall Alert: </Text>
            <DatePicker
              customStyles={{ dateInput: { borderWidth: 0, borderBottomWidth: 5, borderColor: "#083451", } }}
              style={[{ width: '70%'}]}
              format="YYYY-MM-DD HH:mm"
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
          <View style={{flexDirection: 'row',paddingTop: '5%'}}>
            <Text style={{textAlign: 'center', fontSize: 15, fontWeight: 'bold', width: '30%'}}>Surficial Alert (Not Available): </Text>
            <DatePicker
              customStyles={{ dateInput: { borderWidth: 0, borderBottomWidth: 5, borderColor: "#083451", } }}
              disabled={true}
              style={[{ width: '70%'}]}
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
          <View style={{ textAlign: 'center', flex: 0.5 , paddingTop: '10%'}}>
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
