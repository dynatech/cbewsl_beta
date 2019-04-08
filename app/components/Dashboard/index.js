import React, { Component } from 'react';
import { View, Text , TouchableOpacity, Image} from 'react-native';
import { defaults } from '../../assets/styles/default_styles'
import { dashboard } from '../../assets/styles/dashboard_styles'

export default class MainDashboard extends Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={dashboard.menuContainer}>
        <View style={dashboard.heading}>
          <Text>HEADING</Text>
        </View>
        <View style={dashboard.menu}>
          <View style={dashboard.rowMenu}>
            <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/cra.png')}  /><Text>Risk Assement</Text></TouchableOpacity>
            <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/field_survey.png')} /><Text>Field Survey</Text></TouchableOpacity>
            <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/situation_report.png')} /><Text>Situation Report</Text></TouchableOpacity>
          </View>
          <View style={dashboard.rowMenu}>
            <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/sensor_maintenance.png')} /><Text> Sensor Maintenance</Text></TouchableOpacity>
            <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/surficial.png')} /><Text>Surficial Data</Text></TouchableOpacity>
            <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/ewi.png')} /><Text>EWI</Text></TouchableOpacity>
          </View>
          <View style={dashboard.rowMenu}>
            <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/reports.png')} /><Text>Reports</Text></TouchableOpacity>
            <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/call.png')} /><Text>Call</Text></TouchableOpacity>
            <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/messaging.png')} /><Text>SMS</Text></TouchableOpacity>           
          </View>
        </View>
      </View>
    );
  }
}
