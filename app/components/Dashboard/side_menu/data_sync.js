import moment from 'moment';
import { Icon } from 'native-base';
import React, { Component } from 'react';
import { Alert, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import SendSMS from 'react-native-sms';
import { NavigationEvents } from 'react-navigation';
import { defaults } from '../../../assets/styles/default_styles';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import Sync from '../../utils/syncer';
import Network from '../../utils/network_checker'
import Spinner from 'react-native-loading-spinner-overlay';

export default class DataSyncer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_number: '09175392665',
      storage_key: "",
      spinner: false
    };
  }

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="ios-sync" style={{ fontSize: 24, color: tintColor }}></Icon>
    )
  };

  componentDidMount() {
    Notification.endOfValidity();
  }

  loadSMSListener() {
    SmsListener.addListener(message => {
      if (message.body.indexOf('CBEWS-L Sync Ack') > -1 && message.body.indexOf('CBEWS-L Sync Ack') > -1) {
        if (message.body.indexOf('Status: Synced')) {
          let raw_separator = message.body.split("Synced by:")
          let name = raw_separator[1].split("(ID: ")[0]
          let id = raw_separator[1].split("(ID: ")[1]
          let data = Storage.getItem("loginCredentials")

          data.then(response => {
            if (response.user_data.account_id == id.slice(0, -1)) {
              Sync.updateStorage(this.state.storage_key)
              alert("Syncing successfull!");
            }
          })
        }
      }
    })
  }

  syncToServer(storage_key) {
    let notice = ""

    let temp = []
    if (storage_key == "Pub&CandidAlert") {
      temp.push({
        text: 'Network Sync',
        onPress: () => {
          this.networkSyncForPub(storage_key)
        },
        style: 'cancel',
      });
    } else {
      temp = [{
        text: 'Network Sync',
        onPress: () => {
          this.networkSync(storage_key)
        },
        style: 'cancel',
      },
      {
        text: 'SMS Sync', onPress: () => {
          this.smsSync(storage_key)
        }
      }]
    }

    Alert.alert('Syncing options',
      'Choose between Network Sync if you are connected to the CBEWS-L Network or SMS Sync if you are not connected.', temp
    )


    // Alert.alert(
    //   'Notice',
    //    notice,
    //   [
    //     {
    //         text: 'Cancel',
    //         onPress: () => console.log('Cancel Pressed'),
    //         style: 'cancel',
    //     },
    //     {
    //       text: 'OK', onPress: () => {
    //         if (storage_key == "Pub&CandidAlert") {
    //           this.networkSync(storage_key)
    //         } else {
    //           this.smsSync(storage_key)
    //         }
    //       }
    //     }
    //   ]
    // )
  }

  smsSync(storage_key) {
    let data = Storage.getItem(storage_key)
    this.setState({ storage_key: storage_key })
    data.then(response => {
      console.log(response)
      if (response != null) {
        let container = storage_key + ":"
        response.forEach(function (value) {
          if (value.sync_status != 3) {
            let inner_value = Object.values(value)
            let counter = 0
            inner_value.forEach(function (iv) {

              if (moment(iv)._isValid == true && iv.length > 10) {
                iv = iv.replace(":", "~")
              }

              if (counter == 0) {
                container = container + iv
              } else {
                container = container + "<*>" + iv
              }
              counter++
            })
            container = container + "||"
          }
        })

        if (container.indexOf("<*>") > -1) {
          SendSMS.send({
            body: container.slice(0, -2),
            recipients: [this.state.server_number],
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
          }, (completed, cancelled, error) => {
            // console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error); 
          });
        } else {
          Alert.alert("Data is updated.");
        }
      } else {
        Alert.alert("No new data available for syncing.");
      }
    })
  }

  networkSyncForPub(storage_key) {

    const ms = Network.getPing();
    ms.then(response => {
      if (response.status == "In-active") {
        Alert.alert('Notice', response.msg)
      } else {
        // Sync to network
      }
    });

    // let data = Storage.getItem(storage_key)
    // this.setState({ storage_key: storage_key })
    // data.then(response => {
    //   console.log(response)
    //   fetch('http://192.168.150.10:5000/api/monitoring/insert_cbewsl_ewi', {
    //       method: 'POST',
    //       headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(response),
    //   }).then((response) => {
    //     console.log(response)
    //   }).catch((error) => {
    //     console.log(error)
    //   })
    // })
  }

  networkSync(storage_key) {

    const API_LIST = {
      "RiskAssessmentSummary": "http://192.168.150.10:5000/api/risk_assesment_summary/save_risk_assessment_summary",
      "RiskAssessmentFamilyRiskProfile": "http://192.168.150.10:5000/api/family_profile/save_family_profile",
      "RiskAssessmentHazardData": "http://192.168.150.10:5000/api/hazard_data/save_hazard_data",
      "RiskAssessmentRNC": "http://192.168.150.10:5000/api/resources_and_capacities/save_resources_and_capacities",
      "FieldSurveyLogs": "http://192.168.150.10:5000/api/field_survey/save_field_survey",
      "SurficialDataMeasurements": "6",
      "SurficialDataMomsSummary": "http://192.168.150.10:5000/api/surficial_data/save_monitoring_log",
      "SensorMaintenanceLogs": "http://192.168.150.10:5000/api/sensor_maintenance/save_sensor_maintenance_logs",
      "Pub&CandidAlert": "9"
    }
    console.log("hereee")
    let url = API_LIST[storage_key];
    this.setState({ spinner: true });
    let data = Storage.getItem(storage_key);
    const ms = Network.getPing();

    ms.then(response => {
      if (response.status == "In-active") {
        Alert.alert('Notice', response.msg)
      } else {
        data.then(local_data => {
          if (local_data != null || local_data != undefined) {
            local_data.forEach((value) => {
              if (value.sync_status == 1 || value.sync_status == 2) {
                fetch(url, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ value }),
                }).then((response) => response.json())
                  .then((responseJson) => {
                    ToastAndroid.show("Successfully sync to main server.", ToastAndroid.SHORT);
                  })
                  .catch((error) => {
                    ToastAndroid.show("No network detected, Unable to network sync..", ToastAndroid.SHORT);
                  });
              }
            });
          } else {
            Alert.alert('Data Syncing', 'No new data to sync.')
          }
        });
      }
      this.setState({ spinner: false });
    });

  }

  render() {
    return (
      <View style={defaults.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Syncing...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <NavigationEvents onDidFocus={() => this.loadSMSListener()} />
        <View style={{ flex: 1, padding: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="home" style={{ color: '#083451', flex: 1 }} onPress={() => this.props.navigation.openDrawer()} />
            <Text style={{ fontSize: 20, flex: 3, fontWeight: 'bold', color: '#083451' }}>Data Synchronization</Text>
          </View>
        </View>
        <View style={{ flex: 20 }}>
          <ScrollView>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('RiskAssessmentSummary')}>
              <Text style={defaults.touchableTexts}>Risk Assessment | Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('RiskAssessmentFamilyRiskProfile')}>
              <Text style={defaults.touchableTexts}>Risk Assessment | Family Risk Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('RiskAssessmentHazardData')}>
              <Text style={defaults.touchableTexts}>Risk Assessment | Hazard Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('RiskAssessmentRNC')}>
              <Text style={defaults.touchableTexts}>Risk Assessment | Resources and Capacities</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('FieldSurveyLogs')}>
              <Text style={defaults.touchableTexts}>Field Survey | Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('SurficialDataMeasurements')}>
              <Text style={defaults.touchableTexts}>Surficial Data | Measurements</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('SurficialDataMomsSummary')}>
              <Text style={defaults.touchableTexts}>Surficial Data | Manifestation of Movements</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('SensorMaintenanceMaintenanceLogs')}>
              <Text style={defaults.touchableTexts}>Sensor Maintenance | Maintenance Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('Pub&CandidAlert')}>
              <Text style={defaults.touchableTexts}>Alerts | Generated Alerts</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}
