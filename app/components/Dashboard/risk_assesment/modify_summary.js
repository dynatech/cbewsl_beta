import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity} from 'react-native';
import { DataTable } from 'react-native-paper'
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { Icon } from 'native-base'

export default class ModifySummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summary_data: []
    };
  }

  componentDidMount(){
    fetch('http://192.168.150.191:5000/api/risk_assesment_summary/get_all_risk_assessment_summary').then((response) => response.json())
    .then((responseJson) => {
      let summary_data = [];
      for (const [index, value] of responseJson.entries()) {
        summary_data.push(<DataTable.Row style={{width: 500}}>
          <DataTable.Cell>{value.location}</DataTable.Cell>
          <DataTable.Cell>{value.impact}</DataTable.Cell>
          <DataTable.Cell>{value.adaptive_capacity}</DataTable.Cell>
          <DataTable.Cell>{value.vulnerability}</DataTable.Cell>
          <DataTable.Cell>
            <Icon name="md-add-circle-outline" style={{color:"blue"}} onPress={()=> this.updateLog(value.summary_id)}></Icon>
            <Icon name="md-remove-circle-outline" style={{color:"red"}} onPress={()=> this.removeLog(value.summary_id)}></Icon>
          </DataTable.Cell>
        </DataTable.Row>)
      }
      this.setState({summary_data: summary_data})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <ScrollView style={rassessment_styles.container}>
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header style={{flex: 1, width: 500}}>
              <DataTable.Title >Location</DataTable.Title>
              <DataTable.Title>Impact</DataTable.Title>
              <DataTable.Title>Adaptive Capacity</DataTable.Title>
              <DataTable.Title>Vulnerability</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            {this.state.summary_data}
          </DataTable>
        </ScrollView>
        <View style={{textAlign: 'center', flex: 0.5}}>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <TouchableOpacity style={defaults.button}>
              <Text style={defaults.buttonText}>Add Risks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
