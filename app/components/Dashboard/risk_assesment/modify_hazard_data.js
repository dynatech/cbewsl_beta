import React, { Component } from 'react';
import { View, Text ,TouchableOpacity, ScrollView} from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { DataTable } from 'react-native-paper'

export default class ModifyHazardData extends Component {
  constructor(props) {
    super(props);
    this.state = {
        hazard_data: []
    };
  }

  componentDidMount(){
    fetch('http://192.168.150.191:5000/api/hazard_data/get_all_hazard_data').then((response) => response.json())
    .then((responseJson) => {
      let hazard_data = [];
      for (const [index, value] of responseJson.entries()) {
        hazard_data.push(<DataTable.Row style={{width: 500}}>
          <DataTable.Cell style={{marginRight: 10}}>{value.hazard}</DataTable.Cell>
          <DataTable.Cell style={{marginRight: 10}}>{value.speed_of_onset}</DataTable.Cell>
          <DataTable.Cell style={{marginRight: 10}}>{value.early_warning}</DataTable.Cell>
          <DataTable.Cell style={{marginRight: 10}}>{value.impact}</DataTable.Cell>
        </DataTable.Row>)
      }
      this.setState({hazard_data: hazard_data})
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
                    <DataTable.Header style={{width: 500}}>
                    <DataTable.Title >Hazard</DataTable.Title>
                    <DataTable.Title>Speed of Onset</DataTable.Title>
                    <DataTable.Title>Early Warning</DataTable.Title>
                    <DataTable.Title>Impact</DataTable.Title>
                    </DataTable.Header>
                    {this.state.hazard_data}
                </DataTable>
            </ScrollView>
            <View style={{textAlign: 'center', flex: 1}}>
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                    <TouchableOpacity style={defaults.button}>
                    <Text style={defaults.buttonText}>Add Hazard Data</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </ScrollView>
    );
  }
}
