import React, { Component } from 'react';
import { View, Text , TouchableOpacity, Image} from 'react-native';
import { dashboard } from '../../assets/styles/dashboard_styles'
import { Header, Left, Right, Icon} from 'native-base'

export default class MainDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = { header: null };
  render() {
    return (
        <View style={dashboard.menuContainer}>
            <View style={dashboard.heading}>
                <Icon name="menu" onPress={() => this.props.navigation.openDrawer()}/>
                <View style={dashboard.menulogo}>
                    <Image style={dashboard.logo} source={require('../../assets/images/alimodian.jpg')}></Image>
                    <Image style={dashboard.logo} source={require('../../assets/images/dost-phivolcs-logo.png')}></Image>
                    <Image style={dashboard.logo} source={require('../../assets/images/dews-l-logo.png')}></Image>
                </View>
                <View style={dashboard.title}>
                    <Text style={dashboard.titleText}>Early Warning System for Deep-seated Landslides</Text>
                </View>
            </View>
            <View style={dashboard.menu}>
                <View style={dashboard.rowMenu}>
                    <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/cra.png')}  /><Text style={dashboard.menuTexts}>Risk Assement</Text></TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/field_survey.png')} /><Text style={dashboard.menuTexts}>Field Survey</Text></TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/situation_report.png')} /><Text style={dashboard.menuTexts}>Situation Report</Text></TouchableOpacity>
                </View>
                <View style={dashboard.rowMenu}>
                    <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/sensor_maintenance.png')} /><Text style={dashboard.menuTexts}> Sensor Maintenance</Text></TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/surficial.png')} /><Text style={dashboard.menuTexts}>Surficial Data</Text></TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/ewi.png')} /><Text style={dashboard.menuTexts}>EWI</Text></TouchableOpacity>
                </View>
                <View style={dashboard.rowMenu}>
                    <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/reports.png')} /><Text style={dashboard.menuTexts}>Reports</Text></TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/call.png')} /><Text style={dashboard.menuTexts}>Call</Text></TouchableOpacity>
                    <TouchableOpacity style={dashboard.menuButtons}><Image style={dashboard.menuIcons} source={require('../../assets/images/messaging.png')} /><Text style={dashboard.menuTexts}>SMS</Text></TouchableOpacity>           
                </View>
            </View>
        </View>
    );
  }
}
