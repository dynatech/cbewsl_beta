import { Icon } from 'native-base';
import React, { Component } from 'react';
import { Alert, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { defaults } from '../../../assets/styles/default_styles';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';

export default class ModifyHazardData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hazard_data: [],
      hazard_data_paginate: [],
      page: 0,
      number_of_pages: 0
    };
  }

  updateLog(hazard_data) {
    this.props.navigation.navigate('save_hazard_data', {
      data: hazard_data
    })
  }

  removeConfirmation(id) {
    console.log(id)
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
    Notification.endOfValidity();
    fetch('http://192.168.150.10:5000/api/hazard_data/delete_hazard_data', {
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
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.props.navigation.navigate('modify_hazard_data');
          this.getAllHazardData()
        } else {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        let offline_data = Storage.getItem("RiskAssessmentHazardData");
        offline_data.then(response => {
          let temp = response
          let updated_data = []
          let counter = 0
          temp.forEach((value) => {
            counter += 1
            if (id != value.local_storage_id) {
              updated_data.push({
                hazard_data_id: value.hazard_data_id,
                local_storage_id: counter,
                sync_status: value.sync_status,
                hazard: value.hazard,
                speed_of_onset: value.speed_of_onset,
                early_warning: value.early_warning,
                impact: value.impact
              })
            }
          });
          Storage.removeItem("RiskAssessmentHazardData")
          Storage.setItem("RiskAssessmentHazardData", updated_data)
        });

        this.getAllHazardData();
      });

  }

  getAllHazardData() {
    Notification.endOfValidity();
    fetch('http://192.168.150.10:5000/api/hazard_data/get_all_hazard_data').then((response) => response.json())
      .then((responseJson) => {
        let to_local_data = [];
        let counter = 0
        let hazard_data = [];
        if (responseJson != 0) {
          for (const [index, value] of responseJson.entries()) {
            hazard_data.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>{value.hazard}</DataTable.Cell>
              <DataTable.Cell style={{ marginRight: 10 }}>{value.speed_of_onset}</DataTable.Cell>
              <DataTable.Cell style={{ marginRight: 10 }}>{value.early_warning}</DataTable.Cell>
              <DataTable.Cell style={{ marginRight: 10 }}>{value.impact}</DataTable.Cell>
              <DataTable.Cell>
                <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
                <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.hazard_data_id)}></Icon>
              </DataTable.Cell>
            </DataTable.Row>)
            counter += 1
            to_local_data.push({
              hazard_data_id: value.hazard_data_id,
              local_storage_id: counter,
              sync_status: 3,
              hazard: value.hazard,
              speed_of_onset: value.speed_of_onset,
              early_warning: value.early_warning,
              impact: value.impact
            });
          }
          Storage.removeItem("RiskAssessmentHazardData")
          Storage.setItem("RiskAssessmentHazardData", to_local_data)
        } else {
          hazard_data.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
          </DataTable.Row>)
        }
        this.setState({ hazard_data: hazard_data })
        this.tablePaginate(hazard_data)
      })
      .catch((error) => {
        let data_container = Storage.getItem('RiskAssessmentHazardData')
        let hazard_data = [];
        data_container.then(response => {
          console.log(response)
          if (response != null) {
            for (const [index, value] of response.entries()) {
              hazard_data.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.hazard}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.speed_of_onset}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.early_warning}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.impact}</DataTable.Cell>
                <DataTable.Cell>
                  <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
                  <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.local_storage_id)}></Icon>
                </DataTable.Cell>
              </DataTable.Row>)
            }
          } else {
            hazard_data.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
            </DataTable.Row>)
          }
          this.setState({ hazard_data: hazard_data })
          this.tablePaginate(hazard_data)
        })
      });

  }

  tablePaginate(hazard_data) {
    let temp = []
    let counter = 0
    let number_of_pages = hazard_data.length / 6
    this.setState({ number_of_pages: Math.ceil(number_of_pages) })
    hazard_data.forEach(element => {
      if (counter < 6) {
        temp.push(element)
      }
      counter++
    });
    this.setState({ hazard_data_paginate: temp })
  }

  changePage(page) {
    let start = (page * 6)
    let end = start * 2
    let temp = []

    if (end == 0) {
      end = 6
    }

    for (let counter = start; counter < end; counter++) {
      temp.push(this.state.hazard_data[counter])
    }
    this.setState({ hazard_data_paginate: temp })
    this.setState({ page: page })
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
              {this.state.hazard_data_paginate}
              <DataTable.Pagination
                page={this.state.page}
                numberOfPages={this.state.number_of_pages}
                onPageChange={(page) => { this.changePage(page) }}
                label={`Page ${this.state.page} of ${this.state.number_of_pages - 1}`}
              />
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
