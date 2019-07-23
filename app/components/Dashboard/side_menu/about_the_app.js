import { Icon } from 'native-base';
import React, { Component } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import Notification from '../../utils/alert_notification';

export default class AboutTheApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
        <Icon name="information-circle" style={{fontSize: 24, color: tintColor}}></Icon>
    )
  };

  componentDidMount(){
    Notification.endOfValidity();
  }

  render() {
    return (
      <View style={defaults.container}>
        <View style={{ flex: 1, padding: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="home" style={{color: '#083451', flex: 1}}onPress={() => this.props.navigation.openDrawer()}/>
            <Text style={{fontSize: 20, flex: 2.3, fontWeight: 'bold', color: '#083451'}}>About the App</Text>
          </View>
        </View>
        <View style={{flex: 20}}>
          <ScrollView>
            <View style={{flex: 1, padding: 10}}>
              <View style={{padding: 10,justifyContent: 'center'}}>
                <Text style={{color: '#083451', textAlign: 'center'}}>This app was developed to assist local communities and government units in operating the early warning
                system for deep-seated landslides (EWS-L) in their respective communities. it includes the following features:</Text>
              </View>
              <View style={{flex: 1, padding: 10,justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: 50, height: 50, marginRight: 20}} source={require('../../../assets/images/cra.png')}  />
                  <Text style={{fontSize: 20, marginTop: 10, color: '#083451'}}>Risk Assesment</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 2.5}}>
                    <Text style={{color: '#083451'}}>View and update risk assesment summary.</Text>
                    <Text style={{color: '#083451'}}>View and update hazard data, resources and capcities data, family risk profile , and hazard maps.</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, padding: 10,justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: 50, height: 50, marginRight: 20}} source={require('../../../assets/images/field_survey.png')}  />
                  <Text style={{fontSize: 20, marginTop: 10, color: '#083451'}}>Field Survey</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 2.5}}>
                    <Text style={{color: '#083451'}}>View and send latest report summary.</Text>
                    <Text style={{color: '#083451'}}>Add, edit, and remove field survey logs.</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, padding: 10,justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: 50, height: 50, marginRight: 20}} source={require('../../../assets/images/situation_report.png')}  />
                  <Text style={{fontSize: 20, marginTop: 10, color: '#083451'}}>Situation Report</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 2.5}}>
                    <Text style={{color: '#083451'}}>View and send latest situation report summary.</Text>
                    <Text style={{color: '#083451'}}>Add, edit, and remove situation logs.</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, padding: 10,justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: 50, height: 50, marginRight: 20}} source={require('../../../assets/images/sensor_maintenance.png')}  />
                  <Text style={{fontSize: 20, marginTop: 10, color: '#083451'}}>Sensor Maintenance</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 2.5}}>
                    <Text style={{color: '#083451'}}>View latest report summary, sensor status, subsurface and rainfall graphs.</Text>
                    <Text style={{color: '#083451'}}>Add, edit, and remove maintenance logs.</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, padding: 10,justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: 50, height: 50, marginRight: 20}} source={require('../../../assets/images/surficial.png')}  />
                  <Text style={{fontSize: 20, marginTop: 10, color: '#083451'}}>Surficial Data</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 2.5}}>
                    <Text style={{color: '#083451'}}>View and send summary and graphs.</Text>
                    <Text style={{color: '#083451'}}>View current surficial measuremnet.</Text>
                    <Text style={{color: '#083451'}}>Add, edit, and remove monitoring logs including Manifestation of Movements data.</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, padding: 10,justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: 50, height: 50, marginRight: 20}} source={require('../../../assets/images/ewi.png')}  />
                  <Text style={{fontSize: 20, marginTop: 10, color: '#083451'}}>EWI</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 2.5}}>
                    <Text style={{color: '#083451'}}>Automatically generate alert.</Text>
                    <Text style={{color: '#083451'}}>Send EWI via email, SMS, and Facebook.</Text>
                    <Text style={{color: '#083451'}}>Validate or invalidate genrated alerts.</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, padding: 10,justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: 50, height: 50, marginRight: 20}} source={require('../../../assets/images/reports.png')}  />
                  <Text style={{fontSize: 20, marginTop: 10, color: '#083451'}}>Reports</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 2.5}}>
                    <Text style={{color: '#083451'}}>Batch-send reports.</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, padding: 10,justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: 50, height: 50, marginRight: 20}} source={require('../../../assets/images/call.png')}  />
                  <Text style={{fontSize: 20, marginTop: 10, color: '#083451'}}>Call</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 2.5}}>
                    <Text style={{color: '#083451'}}>Make call using the native app.</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, padding: 10,justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image style={{width: 50, height: 50, marginRight: 20}} source={require('../../../assets/images/messaging.png')}  />
                  <Text style={{fontSize: 20, marginTop: 10, color: '#083451'}}>SMS</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 2.5}}>
                    <Text style={{color: '#083451'}}>Send and check SMS using native app.</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
