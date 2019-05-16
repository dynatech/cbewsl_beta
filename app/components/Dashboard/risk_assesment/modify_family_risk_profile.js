import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity} from 'react-native';
import { DataTable } from 'react-native-paper'
import { defaults } from '../../../assets/styles/default_styles'
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { Icon } from 'native-base'

export default class ModifyFamilyRisk extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    fetch('http://192.168.150.191:5000/api/family_profile/get_all_family_profile').then((response) => response.json())
    .then((responseJson) => {
      let family_profile = [];
      for (const [index, value] of responseJson.entries()) {
          family_profile.push(<DataTable.Row style={{width: 500}}>
          <DataTable.Cell style={{marginRight: 10}}>{value.family_profile_id}</DataTable.Cell>
          <DataTable.Cell style={{marginRight: 10}}>{value.members_count}</DataTable.Cell>
          <DataTable.Cell style={{marginRight: 10}}>{value.vulnerable_members_count}</DataTable.Cell>
          <DataTable.Cell style={{marginRight: 10}}>{value.vulnerability_nature}</DataTable.Cell>
          <DataTable.Cell>
            <Icon name="md-add-circle-outline" style={{color:"blue"}} onPress={()=> this.updateLog(value.family_profile_id)}></Icon>
            <Icon name="md-remove-circle-outline" style={{color:"red"}} onPress={()=> this.removeLog(value.family_profile_id)}></Icon>
          </DataTable.Cell>
        </DataTable.Row>)
      }
      this.setState({family_profile: family_profile})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
    <View style={rassessment_styles.container}>
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header style={{width: 500}}>
              <DataTable.Title >Household #</DataTable.Title>
              <DataTable.Title>Number of members</DataTable.Title>
              <DataTable.Title>Vulnerable groups</DataTable.Title>
              <DataTable.Title>Nature of vulnerability</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            {this.state.family_profile}
          </DataTable>
        </ScrollView>
        <View style={{textAlign: 'center', flex: 1}}>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <TouchableOpacity style={defaults.button}>
              <Text style={defaults.buttonText}>Add Risks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
