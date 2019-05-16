import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { ScrollView } from 'react-native-gesture-handler';
import { DataTable } from 'react-native-paper'

export default class MonitoringLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  // Refactor this
  navigateSurficialData(tab) {
    switch(tab) {
        case "summary":
            this.props.navigation.navigate('summary')
            break;
        case "current_measuremnt":
            this.props.navigation.navigate('current_measuremnt')
            break;
        default:
            console.log("Same page...")
            break;
    }
  }


  // componentDidMount(){
  //   fetch('http://192.168.150.191:5000/api/field_survey/get_all_field_survey').then((response) => response.json())
  //   .then((responseJson) => {
  //     let field_logs = [];
  //     for (const [index, value] of responseJson.entries()) {
  //       field_logs.push(<DataTable.Row style={{width: 500}}>
  //         <DataTable.Cell style={{marginRight: -90}}>{value.date}</DataTable.Cell>
  //         <DataTable.Cell style={{marginRight: 10}}>Field Survey Report {value.date.split(' ')[0]}</DataTable.Cell>
  //         <DataTable.Cell style={{marginRight: -190}}>
  //           <Icon name="md-add-circle-outline" style={{color:"blue"}} onPress={()=> this.updateLog(value.field_survey_id)}></Icon>
  //           <Icon name="md-remove-circle-outline" style={{color:"red"}} onPress={()=> this.removeLog(value.field_survey_id)}></Icon>
  //         </DataTable.Cell>
  //       </DataTable.Row>)
  //     }
  //     this.setState({field_logs: field_logs})
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  // }


  render() {
    return (
      <ScrollView style={surficial_data_styles.container}>
        <View style={surficial_data_styles.menuSection}>
            <View style={surficial_data_styles.buttonSection}>
                <TouchableOpacity style={surficial_data_styles.menuButton} onPress={() => this.navigateSurficialData("summary")}>
                    <Text style={surficial_data_styles.buttonText}>Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={surficial_data_styles.activeButton} onPress={() => this.navigateSurficialData("current_measuremnt")}>
                    <Text style={surficial_data_styles.buttonActiveText}>Current Measurement</Text>
                </TouchableOpacity>
                <TouchableOpacity style={surficial_data_styles.menuButton} >
                    <Text style={surficial_data_styles.buttonText}>Monitoring Logs</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View>
          <ScrollView horizontal={true}>
            <DataTable>
              <DataTable.Header style={{width: 500}}>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>A</DataTable.Title>
                <DataTable.Title>B</DataTable.Title>
                <DataTable.Title>C</DataTable.Title>
                <DataTable.Title>MOMs</DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>
            </DataTable>
          </ScrollView>
        </View>
        <View style={{textAlign: 'center', flex: 0.5}}>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <TouchableOpacity style={defaults.button}>
              <Text style={defaults.buttonText}>Add Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
    );
  }
}
