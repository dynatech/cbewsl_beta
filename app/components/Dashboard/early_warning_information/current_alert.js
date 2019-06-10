import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import {field_survey_styles} from '../../../assets/styles/field_survey_styles'
import Storage from '../../utils/storage'
import moment from 'moment'

export default class CurrentAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_details: [],
      alert_level: "A3",
      alert_trigger: "",
      rain_alert_trigger: [],
      alert_validity: "",
      moms_header: [],
      rain_header: []
    };
  }

  navigateEwi(tab) {
    switch(tab) {
      case "alert_validation":
        console.log(tab);
        this.props.navigation.navigate('alert_validation')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  componentDidMount() {
    let offline_data = Storage.getItem("alertGeneration")
    offline_data.then(response => {
      let alert_details = []
      let alert_level = []
      let moms_header = []
      let rain_header = []
      let temp = ""

      if (response != null || response != undefined) {
        if ('moms_id' in response.triggers) {
          temp = "Feature type: "+ response.triggers.type_of_feature+"("+response.triggers.name_of_feature+")\n"+
                    "Description: "+ response.triggers.description+"\n"
          this.setState({alert_trigger: temp})
          moms_header.push(<Text style={{fontWeight: 'bold', fontSize: 20}}>Manifestation of Movements</Text>)
          this.setState({moms_header: moms_header})
          if ('rain_id' in response.triggers) {
           rain_header.push(<Text style={{fontWeight: 'bold', fontSize: 20}}>Rainfall Alert</Text>)
           this.setState({rain_header: rain_header})
           temp = "Rainfall data exceeded threshold level."
            this.setState({rain_alert_trigger: temp})
          }
        } else if ('rain_id' in response.triggers) {
          rain_header.push(<Text style={{fontWeight: 'bold', fontSize: 20}}>Rainfall Alert</Text>)
          this.setState({rain_header: rain_header})
          temp = "Rainfall data exceeded threshold level."
          this.setState({rain_alert_trigger: temp})
        }

        if (response.alert_level == "A0") {
          alert_level.push(<Text style={{fontSize: 50, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 0</Text>)
        } else if (response.alert_level == "A1") {
          alert_level.push(<Text style={{fontSize: 50, color: "#f09e01", fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 1</Text>)
        } else if (response.alert_level == "A2") {
          alert_level.push(<Text style={{fontSize: 50, color: "#f27e10", fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 2</Text>)
        } else if (response.alert_level == "A3") {
          alert_level.push(<Text style={{fontSize: 50, color: "#ef7b7e", fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 3</Text>)
        } else {
          alert_level.push(<Text style={{fontSize: 50, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 0</Text>)
        }
  
        alert_details.push(
          <View style={{padding: 20}}>
            {alert_level}
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Triggers</Text>
            <View style={{padding: 20}}>
              {this.state.moms_header}
              <Text style={{fontSize: 20}}>{this.state.alert_trigger}</Text>
              {this.state.rain_header}
              <Text style={{fontSize: 20}}>{this.state.rain_alert_trigger}</Text>
            </View>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Validity</Text>
            <View style={{padding: 20}}>
              <Text style={{fontSize: 20}}>{this.formatDateTime(response.validity)}</Text>
            </View>
          </View>
        )
        this.setState({alert_details: alert_details})
      } else {
        alert_level.push(<Text style={{fontSize: 50, fontWeight: 'bold', width: '100%', textAlign: 'center'}}>Alert 0</Text>)
        alert_details.push(
          <View style={{padding: 20}}>
            {alert_level}
            <Text style={{fontSize: 25, fontWeight: 'bold', color: '#4a8e1c', width: '100%', textAlign: 'center'}}>No candidate alerts.</Text>
          </View>
        )
        this.setState({alert_details: alert_details})
      }
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
