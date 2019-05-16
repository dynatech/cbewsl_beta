import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import {field_survey_styles} from '../../../assets/styles/field_survey_styles'
import {defaults} from '../../../assets/styles/default_styles'
import { DataTable } from 'react-native-paper'

export default class LatestReportSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latest_report: []
    };
  }

    // Refactor this
    navigateFieldSurvey(tab) {
        switch(tab) {
            case "fsl":
                this.props.navigation.navigate('field_survery_logs')
                break;
            default:
                console.log("Same page...")
                break;
        }
    }

    // componentDidMount(){
    //   fetch('http://192.168.150.191:5000/api/field_survey/get_latest_field_survey_data').then((response) => response.json())
    //   .then((responseJson) => {
    //     let latest_report = [];
    //     for (const [index, value] of responseJson.entries()) {
    //       latest_report.push(<View style={{padding: 10}}>
    //         <Text style={{fontSize: 15, fontWeight: 'bold'}}>Date of Survey: {value.date}</Text>
    //     </View>)
    //     }
    //     this.setState({latest_report: latest_report})
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // }

  render() {
    return (
        <ScrollView style={field_survey_styles.container}>
          <View style={field_survey_styles.menuSection}>
              <View style={field_survey_styles.buttonSection}>
                  <TouchableOpacity style={field_survey_styles.activeButton}>
                      <Text style={field_survey_styles.buttonActiveText}>Latest Report Summary</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={field_survey_styles.menuButton} onPress={() => this.navigateFieldSurvey("fsl")}>
                      <Text style={field_survey_styles.buttonText}>Field Survey Logs</Text>
                  </TouchableOpacity>
              </View>
          </View>
          <View style={{padding: 10}}>
            <View style={{flex: 1}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Date of Survey: 2018/08/08</Text>
            </View>
            <View style={{flexDirection: 'row',flex: 1, paddingTop: 10}}>
              <View style={{flex: 1}}>
                <Text>Features</Text>
              </View>
              <View style={{flex: 1.5}}>
                <Text> {'\u2022'} Scarp A</Text>
                <Text> {'     '}{'\u2022'} Scarp A</Text>
                <Text> {'     '}{'\u2022'} Scarp A</Text>
                <Text> {'     '}{'\u2022'} Scarp A</Text>
                <Text> {'\u2022'} Scarp A</Text>
                <Text> {'     '}{'\u2022'} Scarp A</Text>
                <Text> {'     '}{'\u2022'} Scarp A</Text>
                <Text> {'     '}{'\u2022'} Scarp A</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row',flex: 1, paddingTop: 10}}>
              <View style={{flex: 1}}>
                <Text>Materials characterization</Text>
              </View>
              <View style={{flex: 1.5}}>
                <Text>highly weathered sandstone</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row',flex: 1, paddingTop: 10}}>
              <View style={{flex: 1}}>
                <Text>Mechanism</Text>
              </View>
              <View style={{flex: 1.5}}>
                <Text>deep-seated rotational or translational landslide</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row',flex: 1, paddingTop: 10}}>
              <View style={{flex: 1}}>
                <Text>Exposure</Text>
              </View>
              <View style={{flex: 1.5}}>
                <Text>at least 9 households are at risk in the event of slope failure</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row',flex: 1, paddingTop: 10}}>
              <View style={{flex: 1}}>
                <Text style={{color: 'red'}} >Note</Text>
              </View>
              <View style={{flex: 1.5}}>
                <Text style={{color: 'red'}} >Sensor needs maintenance</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={defaults.button}>
            <Text style={defaults.buttonText}>SEND</Text>
          </TouchableOpacity>
      </ScrollView>
    );
  }
}
