import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper'
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { Icon } from 'native-base'
import { NavigationEvents } from 'react-navigation';
import Storage from '../../utils/storage'

export default class ModifySummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summary_data: []
    };
  }

  updateLog(summary_data) {
    this.props.navigation.navigate('save_summary', {
      data: summary_data
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
    fetch('http://192.168.150.191:5000/api/risk_assesment_summary/delete_risk_assessment_summary', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary_id: id
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.status == true) {
          this.props.navigation.navigate('modify_summary');
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.getAllRiskAssessmentSummary()
        } else {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        let offline_data = Storage.getItem("RiskAssessmentSummary");
        offline_data.then(response => {
          let temp = response
          updated_data = []
          counter = 0
          temp.forEach((value) => {
            counter += 1
            if (id != value.local_storage_id) {
              updated_data.push({
                summary_id: value.summary_id,
                local_storage_id: counter,
                sync_status: value.sync_status,
                location: value.location,
                impact: value.impact,
                adaptive_capacity: value.adaptive_capacity,
                vulnerability: value.vulnerability
              })
            }
          });
          Storage.removeItem("RiskAssessmentSummary")
          Storage.setItem("RiskAssessmentSummary", updated_data)
        });

        this.getAllRiskAssessmentSummary();
      });

  }

  getAllRiskAssessmentSummary() {
    fetch('http://192.168.150.191:5000/api/risk_assesment_summary/get_all_risk_assessment_summary').then((response) => response.json())
      .then((responseJson) => {
        let summary_data = [];
        let to_local_data = [];
        let counter = 0
        for (const [index, value] of responseJson.entries()) {
          summary_data.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.location}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.impact}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.adaptive_capacity}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerability}</DataTable.Cell>
            <DataTable.Cell>
              <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon>
              <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.summary_id)}></Icon>
            </DataTable.Cell>
          </DataTable.Row>)
          counter += 1
          to_local_data.push({
            summary_id: value.summary_id,
            local_storage_id: counter,
            sync_status: 3,
            location: value.location,
            impact: value.impact,
            adaptive_capacity: value.adaptive_capacity,
            vulnerability: value.vulnerability
          });
        }
        Storage.removeItem("RiskAssessmentSummary")
        Storage.setItem("RiskAssessmentSummary", to_local_data)
        let data_container = Storage.getItem('RiskAssessmentSummary')
        data_container.then(response => {
          console.log(response)
        });
        this.setState({ summary_data: summary_data })

      })
      .catch((error) => {
        let data_container = Storage.getItem('RiskAssessmentSummary')
        let summary_data = [];
        data_container.then(response => {
          console.log(response)
          if (response != null) {
            for (const [index, value] of response.entries()) {
              summary_data.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.location}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.impact}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.adaptive_capacity}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerability}</DataTable.Cell>
                <DataTable.Cell>
                  <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon>
                  <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.local_storage_id)}></Icon>
                </DataTable.Cell>
              </DataTable.Row>)
            }
          } else {
            summary_data.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
            </DataTable.Row>)
          }

          this.setState({ summary_data: summary_data })
        });
      });
  }

  render() {
    return (
      <ScrollView style={rassessment_styles.container} >
        <NavigationEvents onDidFocus={() => this.getAllRiskAssessmentSummary()} />
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header style={{ flex: 1, width: 500 }}>
              <DataTable.Title >Location</DataTable.Title>
              <DataTable.Title>Impact</DataTable.Title>
              <DataTable.Title>Adaptive Capacity</DataTable.Title>
              <DataTable.Title>Vulnerability</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            {this.state.summary_data}
          </DataTable>
        </ScrollView>
        <View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('save_summary')}>
              <Text style={defaults.buttonText}>Add Risks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
