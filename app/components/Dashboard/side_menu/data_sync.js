import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking} from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { Icon } from 'native-base';
import Storage from '../../utils/storage'
import BackgroundJob from 'react-native-background-job';
import SmsListener from 'react-native-android-sms-listener'

export default class DataSyncer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_number: '09175392665'
    };
  }

  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
        <Icon name="ios-sync" style={{fontSize: 24, color: tintColor}}></Icon>
    )
  };
  
  componentDidMount() {
    SmsListener.addListener(message => {
      console.info(message)
      if (message.body.indexOf('CBEWSL-L Sync Acknowledgement:') > -1 && message.body.indexOf('CBEWSL-L Sync Acknowledgement:') > -1) {
        if (message.body.indexOf('Status: Synced')) {
          alert("Syncing successfull!");
        }
      }
    })
  }

  syncToServer(storage_key) {
    let data = Storage.getItem(storage_key)
    data.then(response => {
      console.log(response)
      let container = storage_key+":"
      response.forEach(function(value) {
        let inner_value = Object.values(value)
        let counter = 0
        inner_value.forEach(function(iv) {
          if (counter == 0) {
            container = container+iv
          } else {
            container = container+"<*>"+iv
          }
          counter++
        })
        container = container+"||"
      })
      Linking.openURL(`sms:${this.state.server_number}?body=${container.slice(0, -2)}`);
    })
  }

  render() {
    return (
      <View style={defaults.container}>
        <View style={{ flex: 1, padding: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="home" style={{color: '#083451', flex: 1}}onPress={() => this.props.navigation.openDrawer()}/>
            <Text style={{fontSize: 20, flex: 3, fontWeight: 'bold', color: '#083451'}}>Data Synchronization</Text>
          </View>
        </View>
        <View style={{flex: 20}}>
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
          </ScrollView>
        </View>
      </View>
    );
  }
}
