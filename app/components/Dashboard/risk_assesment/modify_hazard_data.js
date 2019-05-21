import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, Alert } from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { DataTable } from 'react-native-paper'
import { Icon } from 'native-base'
import { NavigationEvents } from 'react-navigation';
import Storage from '../../utils/storage'

export default class ModifyHazardData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hazard_data: []
    };
  }

  updateLog(hazard_data) {
    this.props.navigation.navigate('save_hazard_data', {
      data: hazard_data
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
    fetch('http://192.168.150.191:5000/api/hazard_data/delete_hazard_data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hazard_data_id: id
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.status == true) {
          // ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.props.navigation.navigate('modify_hazard_data');
          this.getAllHazardData()
        } else {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getAllHazardData() {
    fetch('http://192.168.150.191:5000/api/hazard_data/get_all_hazard_data').then((response) => response.json())
      .then((responseJson) => {
        let hazard_data = [];
        for (const [index, value] of responseJson.entries()) {
          hazard_data.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.hazard}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.speed_of_onset}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.early_warning}</DataTable.Cell>
            <DataTable.Cell style={{ marginRight: 10 }}>{value.impact}</DataTable.Cell>
            <DataTable.Cell>
              <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon>
              <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.hazard_data_id)}></Icon>
            </DataTable.Cell>
          </DataTable.Row>)
        }
        this.setState({ hazard_data: hazard_data })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <ScrollView>
        <NavigationEvents onDidFocus={() => this.getAllHazardData()} />
        <View style={rassessment_styles.container}>
          <ScrollView horizontal={true}>
            <DataTable>
              <DataTable.Header style={{ width: 500 }}>
                <DataTable.Title >Hazard</DataTable.Title>
                <DataTable.Title>Speed of Onset</DataTable.Title>
                <DataTable.Title>Early Warning</DataTable.Title>
                <DataTable.Title>Impact</DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>
              {this.state.hazard_data}
            </DataTable>
          </ScrollView>
          <View style={{ textAlign: 'center', flex: 1 }}>
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('save_hazard_data')}>
                <Text style={defaults.buttonText}>Add Hazard Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
