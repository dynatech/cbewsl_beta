import { Icon } from 'native-base';
import React, { Component } from 'react';
import { Alert, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { defaults } from '../../../assets/styles/default_styles';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ModifyResourceAndCapacities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rnc_data: [],
      rnc_data_paginate: [],
      page: 0,
      number_of_pages: 0,
      spinner: true
    };
  }

  updateLog(resource_and_capacity_data) {
    this.props.navigation.navigate('save_rnc', {
      data: resource_and_capacity_data
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
    Notification.endOfValidity();
    fetch('http://192.168.1.101:5000/api/resources_and_capacities/delete_resources_and_capacities', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resources_and_capacities_id: id
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == true) {
          this.props.navigation.navigate('modify_rnc');
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.getAllResourcesAndCapacities()
        } else {
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        let offline_data = Storage.getItem("RiskAssessmentRNC");
        offline_data.then(response => {
          let temp = response
          let updated_data = []
          let counter = 0
          temp.forEach((value) => {
            counter += 1
            if (id != value.local_storage_id) {
              updated_data.push({
                resources_and_capacities_id: value.resources_and_capacities_id,
                local_storage_id: counter,
                sync_status: value.sync_status,
                resource_and_capacity: value.resource_and_capacity,
                status: value.status,
                owner: value.owner
              })
            }
          });
          Storage.removeItem("RiskAssessmentRNC")
          Storage.setItem("RiskAssessmentRNC", updated_data)
        });
        this.getAllResourcesAndCapacities();
      });
  }

  getAllResourcesAndCapacities() {
    Notification.endOfValidity();
    fetch('http://192.168.1.101:5000/api/resources_and_capacities/get_all_resources_and_capacities').then((response) => response.json())
      .then((responseJson) => {
        let rnc_data = [];
        let to_local_data = [];
        let counter = 0
        if (responseJson.length != 0) {
          for (const [index, value] of responseJson.entries()) {
            rnc_data.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>{value.resource_and_capacity}</DataTable.Cell>
              <DataTable.Cell style={{ marginRight: 10 }}>{value.status}</DataTable.Cell>
              <DataTable.Cell style={{ marginRight: 10 }}>{value.owner}</DataTable.Cell>
              <DataTable.Cell>
                <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
                <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.resources_and_capacities_id)}></Icon>
              </DataTable.Cell>
            </DataTable.Row>)
            counter += 1
            to_local_data.push({
              resources_and_capacities_id: value.resources_and_capacities_id,
              local_storage_id: counter,
              sync_status: 3,
              resource_and_capacity: value.resource_and_capacity,
              status: value.status,
              owner: value.owner
            })
          }
          Storage.removeItem("RiskAssessmentRNC")
          Storage.setItem("RiskAssessmentRNC", to_local_data)
        } else {
          rnc_data.push(<DataTable.Row style={{ width: 500 }}>
            <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
          </DataTable.Row>)
        }
        this.setState({ rnc_data: rnc_data, spinner: false })
        this.tablePaginate(rnc_data)
      })
      .catch((error) => {
        let data_container = Storage.getItem('RiskAssessmentRNC')
        let rnc_data = [];
        data_container.then(response => {
          if (response != null) {
            for (const [index, value] of response.entries()) {
              rnc_data.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.resource_and_capacity}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.status}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.owner}</DataTable.Cell>
                <DataTable.Cell>
                  <Icon name="md-create" style={{ color: "blue" }} onPress={() => this.updateLog(value)}></Icon><Text>   </Text>
                  <Icon name="ios-trash" style={{ color: "red" }} onPress={() => this.removeConfirmation(value.local_storage_id)}></Icon>
                </DataTable.Cell>
              </DataTable.Row>)
            }
          } else {
            rnc_data.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
            </DataTable.Row>)
          }
          this.setState({ rnc_data: rnc_data, spinner: false })
          this.tablePaginate(rnc_data)
        })
      });
  }

  tablePaginate(rnc_data) {
    let temp = []
    let counter = 0
    let number_of_pages = rnc_data.length / 6
    this.setState({ number_of_pages: Math.ceil(number_of_pages) })
    rnc_data.forEach(element => {
      if (counter < 6) {
        temp.push(element)
      }
      counter++
    });
    this.setState({ rnc_data_paginate: temp })
  }

  changePage(page) {
    let start = (page * 6)
    let end = start * 2
    let temp = []

    if (end == 0) {
      end = 6
    }

    for (let counter = start; counter < end; counter++) {
      temp.push(this.state.rnc_data[counter])
    }
    this.setState({ rnc_data_paginate: temp })
    this.setState({ page: page })
  }

  render() {
    return (
      <ScrollView>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <NavigationEvents onDidFocus={() => this.getAllResourcesAndCapacities()} />
        <View style={rassessment_styles.container}>
          <ScrollView horizontal={true}>
            <DataTable>
              <DataTable.Header style={{ flex: 1, width: 500 }}>
                <DataTable.Title >Resource/Capacity</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
                <DataTable.Title>Owner</DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>
              {this.state.rnc_data_paginate}
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
              <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('save_rnc')}>
                <Text style={defaults.buttonText}>Add Resource/Capacity</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
