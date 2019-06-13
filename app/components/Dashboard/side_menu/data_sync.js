import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { Icon } from 'native-base';
import Storage from '../../utils/storage'
import SmsListener from 'react-native-android-sms-listener'
import { NavigationEvents } from 'react-navigation';
import SendSMS from 'react-native-sms'
import Sync from '../../utils/syncer'
import Notification from '../../utils/alert_notification'
import moment from 'moment'

export default class DataSyncer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_number: '09175392665',
      storage_key: ""
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
          console.log(message.body)
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
    Alert.alert(
      'Notice',
      'Please ensure that your cellular network is available.',
      [
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {
            let data = Storage.getItem(storage_key)
            let empty_status = false
            this.setState({ storage_key: storage_key })
            data.then(response => {
              console.log(response)
              Storage.removeItem(storage_key)
              return
              let container = storage_key + ":"
              response.forEach(function (value) {
                if (value.sync_status != 3) {
                  let inner_value = Object.values(value)
                  let counter = 0
                  inner_value.forEach(function (iv) {

                    if (moment(iv)._isValid == true && iv.length > 10) {
                      iv = iv.replace(":","~")
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
                alert("Data is updated.");
              }
            })
          }
        }
      ]
    )
  }

  render() {
    return (
      <View style={defaults.container}>
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
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('AlertGeneration')}>
              <Text style={defaults.touchableTexts}>Alerts | Generated Alerts</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}
