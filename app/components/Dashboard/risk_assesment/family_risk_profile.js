import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { defaults } from '../../../assets/styles/default_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';
import Sync from '../../utils/syncer';

class FamilyRiskProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      family_profile_data: [],
      family_profile_data_paginate: [],
      page: 0,
      number_of_pages: 0,
      spinner: true,
      role_id: 0
    };
  }

  componentWillMount() {
    let credentials = Storage.getItem("loginCredentials");
    credentials.then(response => {
      let role_id = response.role_id;
      this.setState({ role_id: role_id });
    });
    Notification.endOfValidity();
    Sync.clientToServer("RiskAssessmentFamilyRiskProfile").then(() => {
      setTimeout(() => {
        fetch('http://192.168.1.10:5000/api/family_profile/get_all_family_profile').then((response) => response.json())
          .then((responseJson) => {
            let family_profile_data = [];
            let to_local_data = [];
            let counter = 0
            if (responseJson.length != 0) {
              for (const [index, value] of responseJson.entries()) {
                family_profile_data.push(<DataTable.Row style={{ width: 500 }}>
                  <DataTable.Cell style={{ marginRight: 10 }}>{value.members_count}</DataTable.Cell>
                  <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerable_members_count}</DataTable.Cell>
                  <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerability_nature}</DataTable.Cell>
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
              Storage.setItem("RiskAssessmentFamilyRiskProfile", to_local_data);

            } else {
              family_profile_data.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
              </DataTable.Row>)
            }

            this.setState({ family_profile_data: family_profile_data });
            this.tablePaginate(family_profile_data);
            this.setState({ spinner: false });
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
                  </DataTable.Row>)
                }
              } else {
                family_profile_data.push(<DataTable.Row style={{ width: 500 }}>
                  <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
                </DataTable.Row>)
              }
              this.setState({ family_profile_data: family_profile_data });
              this.tablePaginate(family_profile_data);
              this.setState({ spinner: false });
            })
          });
      }, 3000)

    });

  }


  navigateModifyFamilyRisk() {
    role_id = this.state.role_id;
    if (role_id == 1) {
      Alert.alert('Access denied', 'Unable to access this feature.');
    } else {
      this.props.navigation.navigate('modify_family_risk');
    }
  }

  tablePaginate(family_profile_data) {
    let temp = []
    let counter = 0
    let number_of_pages = family_profile_data.length / 6
    this.setState({ number_of_pages: Math.ceil(number_of_pages) })
    family_profile_data.forEach(element => {
      if (counter < 6) {
        temp.push(element)
      }
      counter++
    });
    this.setState({ family_profile_data_paginate: temp })
  }

  changePage(page) {
    let start = (page * 6)
    let end = start * 2
    let temp = []

    if (end == 0) {
      end = 6
    }

    for (let counter = start; counter < end; counter++) {
      temp.push(this.state.family_profile_data[counter])
    }
    this.setState({ family_profile_data_paginate: temp })
    this.setState({ page: page })
  }

  render() {
    return (
      <View>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <ScrollView horizontal={true}>
          {/* <NavigationEvents onDidFocus={() => this.getAllFamilyProfile()} /> */}
          <DataTable>
            <DataTable.Header style={{ flex: 1, width: 500 }}>
              <DataTable.Title>Number of members</DataTable.Title>
              <DataTable.Title>Vulnerable groups</DataTable.Title>
              <DataTable.Title>Nature of vulnerability</DataTable.Title>
            </DataTable.Header>
            {this.state.family_profile_data_paginate}
            <DataTable.Pagination
              page={this.state.page}
              numberOfPages={this.state.number_of_pages}
              onPageChange={(page) => { this.changePage(page) }}
              label={`Page ${this.state.page} of ${this.state.number_of_pages - 1}`}
            />
          </DataTable>
        </ScrollView>
        <TouchableOpacity style={defaults.button} onPress={() => this.navigateModifyFamilyRisk()}>
          <Text style={defaults.buttonText}>EDIT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(FamilyRiskProfile)