import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper'
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { Icon } from 'native-base'

export default class ModifyResourceAndCapacities extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount(){
    fetch('http://192.168.150.191:5000/api/resources_and_capacities/get_all_resources_and_capacities').then((response) => response.json())
    .then((responseJson) => {
      let rnc_data = [];
      for (const [index, value] of responseJson.entries()) {
        rnc_data.push(<DataTable.Row style={{width: 500}}>
          <DataTable.Cell style={{marginRight: 10}}>{value.resource_and_capacity}</DataTable.Cell>
          <DataTable.Cell style={{marginRight: 10}}>{value.status}</DataTable.Cell>
          <DataTable.Cell style={{marginRight: 10}}>{value.owner}</DataTable.Cell>
          <DataTable.Cell>
            <Icon name="md-add-circle-outline" style={{color:"blue"}} onPress={()=> this.updateLog(value.hazard_data_id)}></Icon>
            <Icon name="md-remove-circle-outline" style={{color:"red"}} onPress={()=> this.removeLog(value.hazard_data_id)}></Icon>
          </DataTable.Cell>
        </DataTable.Row>)
      }
      this.setState({rnc_data: rnc_data})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <ScrollView>    
        <View style={rassessment_styles.container}>
          <ScrollView horizontal={true}>
            <DataTable>
              <DataTable.Header style={{flex: 1, width: 500}}>
                <DataTable.Title >Resource/Capacity</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
                <DataTable.Title>Owner</DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>
              {this.state.rnc_data}
            </DataTable>
          </ScrollView>
          <View style={{textAlign: 'center', flex: 1}}>
              <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                  <TouchableOpacity style={defaults.button}>
                  <Text style={defaults.buttonText}>Add Resource/Capacity</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
