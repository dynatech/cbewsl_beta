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
        console.error(error);
      });
  }

  getAllRiskAssessmentSummary() {
    fetch('http://192.168.150.191:5000/api/risk_assesment_summary/get_all_risk_assessment_summary').then((response) => response.json())
      .then((responseJson) => {
        let summary_data = [];
        for (const [index, value] of responseJson.entries()) {
          summary_data.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell>{value.location}</DataTable.Cell>
            <DataTable.Cell>{value.impact}</DataTable.Cell>
            <DataTable.Cell>{value.adaptive_capacity}</DataTable.Cell>
            <DataTable.Cell>{value.vulnerability}</DataTable.Cell>
            <DataTable.Cell>
              <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon>
              <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.summary_id)}></Icon>
            </DataTable.Cell>
          </DataTable.Row>)
        }
        this.setState({ summary_data: summary_data })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <ScrollView style={rassessment_styles.container}>
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
