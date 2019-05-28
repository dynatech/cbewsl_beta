import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper'
import { defaults } from '../../../assets/styles/default_styles'
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { Icon } from 'native-base'
import { NavigationEvents } from 'react-navigation';
import Storage from '../../utils/storage'

export default class ModifyFamilyRisk extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  updateLog(family_risk_data) {
    this.props.navigation.navigate('save_family_risk_profile', {
      data: family_risk_data
    })
  }

  removeConfirmation(id) {
    Alert.alert(
      'Confirmation',
      'Are you sure do you want to delete ?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.removeLog(id) },
      ],
      { cancelable: false },
    );
  }

  removeLog(id) {
    fetch('http://192.168.150.191:5000/api/family_profile/delete_family_profile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        family_profile_id: id
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.status == true) {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.props.navigation.navigate('modify_family_risk_profile');
          this.getAllFamilyProfile()
        } else {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        let offline_data = Storage.getItem("RiskAssessmentFamilyRiskProfile");
        offline_data.then(response => {
          let temp = response
          let updated_data = []
          let counter = 0
          temp.forEach((value) => {
            counter += 1
            if (id != value.local_storage_id) {
              updated_data.push({
                family_profile_id: value.family_profile_id,
                local_storage_id: counter,
                sync_status: value.sync_status,
                members_count: value.members_count,
                vulnerable_members_count: value.vulnerable_members_count,
                vulnerability_nature: value.vulnerability_nature
              })
            }
          });
          Storage.removeItem("RiskAssessmentFamilyRiskProfile")
          Storage.setItem("RiskAssessmentFamilyRiskProfile", updated_data)
        });

        this.getAllFamilyProfile();
      });
  }


  getAllFamilyProfile() {
    fetch('http://192.168.150.191:5000/api/family_profile/get_all_family_profile').then((response) => response.json())
      .then((responseJson) => {
        let family_profile_data = [];
        let to_local_data = [];
        let counter = 0
        for (const [index, value] of responseJson.entries()) {
          family_profile_data.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.members_count}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerable_members_count}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerability_nature}</DataTable.Cell>
            <DataTable.Cell>
              <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon>
              <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.family_profile_id)}></Icon>
            </DataTable.Cell>
          </DataTable.Row>)
          counter += 1
          to_local_data.push({
            family_profile_id: value.family_profile_id,
            local_storage_id: counter,
            sync_status: 3,
            members_count: value.members_count,
            vulnerable_members_count: value.vulnerable_members_count,
            vulnerability_nature: value.vulnerability_nature
          })
        }
        Storage.removeItem("RiskAssessmentFamilyRiskProfile")
        Storage.setItem("RiskAssessmentFamilyRiskProfile", to_local_data)
        let data_container = Storage.getItem('RiskAssessmentFamilyRiskProfile')
        data_container.then(response => {
          console.log(response)
        });
        this.setState({ family_profile_data: family_profile_data })
      })
      .catch((error) => {
        let data_container = Storage.getItem('RiskAssessmentFamilyRiskProfile')
        let family_profile_data = [];
        data_container.then(response => {
          if (response != null) {
            for (const [index, value] of response.entries()) {
              family_profile_data.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.members_count}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerable_members_count}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerability_nature}</DataTable.Cell>
                <DataTable.Cell>
                  <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon>
                  <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.local_storage_id)}></Icon>
                </DataTable.Cell>
              </DataTable.Row>)
            }
          } else {
            family_profile_data.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
            </DataTable.Row>)
          }
          this.setState({ family_profile_data: family_profile_data })
        })
      });
  }

  render() {
    return (
      <View style={rassessment_styles.container}>
        <NavigationEvents onDidFocus={() => this.getAllFamilyProfile()} />
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header style={{ width: 500 }}>
              <DataTable.Title>Number of members</DataTable.Title>
              <DataTable.Title>Vulnerable groups</DataTable.Title>
              <DataTable.Title>Nature of vulnerability</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            {this.state.family_profile_data}
          </DataTable>
        </ScrollView>
        <View style={{ textAlign: 'center', flex: 1 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('save_family_risk_profile')}>
              <Text style={defaults.buttonText}>Add Risks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
