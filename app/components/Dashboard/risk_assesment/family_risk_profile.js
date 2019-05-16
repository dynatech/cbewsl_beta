import React, { Component } from 'react';
import { View, Text , ScrollView, TouchableOpacity} from 'react-native';
import { DataTable } from 'react-native-paper'
import { defaults } from '../../../assets/styles/default_styles'
import { withNavigation } from 'react-navigation';

class FamilyRiskProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        family_profile: []
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
    <View>
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header style={{flex: 1, width: 500}}>
              <DataTable.Title >Household #</DataTable.Title>
              <DataTable.Title>Number of members</DataTable.Title>
              <DataTable.Title>Vulnerable groups</DataTable.Title>
              <DataTable.Title>Nature of vulnerability</DataTable.Title>
            </DataTable.Header>
            {this.state.family_profile}
          </DataTable>
        </ScrollView>
        <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('modify_family_risk')}>
          <Text style={defaults.buttonText}>EDIT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(FamilyRiskProfile)
