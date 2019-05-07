import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import {field_survey_styles} from '../../../assets/styles/field_survey_styles'
import { DataTable } from 'react-native-paper'

export default class LatestReportSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    //   fetch('http://192.168.150.191:5000/api/hazard_data/get_all_hazard_data').then((response) => response.json())
    //   .then((responseJson) => {
    //     let hazard_data = [];
    //     for (const [index, value] of responseJson.entries()) {
    //       hazard_data.push(<DataTable.Row style={{width: 500}}>
    //         <DataTable.Cell style={{marginRight: 10}}>{value.hazard}</DataTable.Cell>
    //         <DataTable.Cell style={{marginRight: 10}}>{value.speed_of_onset}</DataTable.Cell>
    //         <DataTable.Cell style={{marginRight: 10}}>{value.early_warning}</DataTable.Cell>
    //         <DataTable.Cell style={{marginRight: 10}}>{value.impact}</DataTable.Cell>
    //       </DataTable.Row>)
    //     }
    //     this.setState({hazard_data: hazard_data})
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
            <View>
                <Text> latest Report Summary </Text>
            </View>
        </View>
      </ScrollView>
    );
  }
}
