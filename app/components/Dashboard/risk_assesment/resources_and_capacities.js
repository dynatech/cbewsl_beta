import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { DataTable } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { defaults } from '../../../assets/styles/default_styles';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import FamilyRiskProfile from './family_risk_profile';
import MapSection from './map_section';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';
import Sync from '../../utils/syncer';

export default class ResourcesAndCapacities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subView: 'maps',
      buttonMap: rassessment_styles.subActiveButton,
      buttonTextMap: rassessment_styles.buttonActiveText,
      buttonFRP: rassessment_styles.subMenuButton,
      buttonTextFRP: rassessment_styles.buttonText,
      rnc_data: [],
      rnc_data_paginate: [],
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
  }

  navigateModifyRNC() {
    role_id = this.state.role_id;
    if (role_id == 1 || role_id == 2) {
      Alert.alert('Access denied', 'Unable to access this feature.');
    } else {
      this.props.navigation.navigate('modify_rnc');
    }
  }

  // Refactor this
  navigateRiskAssessment(tab) {
    switch (tab) {
      case "summary":
        console.log(tab);
        this.props.navigation.navigate('summary')
        break;
      case "hazard_data":
        console.log(tab);
        this.props.navigation.navigate('hazard_data')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  changeSubView(tab) {
    console.log(tab)
    if (tab == 'maps') {
      this.setState({ subView: tab })
      this.setState({ buttonMap: rassessment_styles.subActiveButton })
      this.setState({ buttonTextMap: rassessment_styles.buttonActiveText })
      this.setState({ buttonFRP: rassessment_styles.subMenuButton })
      this.setState({ buttonTextFRP: rassessment_styles.buttonText })
    } else {
      this.setState({ subView: tab })
      this.setState({ buttonMap: rassessment_styles.subMenuButton })
      this.setState({ buttonTextMap: rassessment_styles.buttonText })
      this.setState({ buttonFRP: rassessment_styles.subActiveButton })
      this.setState({ buttonTextFRP: rassessment_styles.buttonActiveText })
    }
  }

  getAllResourcesAndCapacities() {
    Notification.endOfValidity();
    Sync.clientToServer("RiskAssessmentRNC").then(() => {
      fetch('http://192.168.150.10:5000/api/resources_and_capacities/get_all_resources_and_capacities').then((response) => response.json())
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
      <ScrollView style={rassessment_styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <NavigationEvents onDidFocus={() => this.getAllResourcesAndCapacities()} />
        <View style={rassessment_styles.menuSection}>
          <View style={rassessment_styles.buttonSection}>
            <TouchableOpacity style={rassessment_styles.menuButton} onPress={() => this.navigateRiskAssessment("summary")}>
              <Text style={rassessment_styles.buttonText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={rassessment_styles.menuButton} onPress={() => this.navigateRiskAssessment("hazard_data")}>
              <Text style={rassessment_styles.buttonText}>Hazard Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={rassessment_styles.activeButton}>
              <Text style={rassessment_styles.buttonActiveText}>Resources and Capacities</Text>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal={true}>
              <DataTable>
                <DataTable.Header style={{ flex: 1, width: 500 }}>
                  <DataTable.Title >Resource/Capacity</DataTable.Title>
                  <DataTable.Title>Status</DataTable.Title>
                  <DataTable.Title>Owner</DataTable.Title>
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
            <TouchableOpacity style={defaults.button} onPress={() => this.navigateModifyRNC()}>
              <Text style={defaults.buttonText}>EDIT</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={rassessment_styles.mapSection}>
          <View style={rassessment_styles.buttonSection}>
            <TouchableOpacity style={this.state.buttonMap} onPress={() => this.changeSubView('maps')}>
              <Text style={this.state.buttonTextMap}>Maps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.buttonFRP} onPress={() => this.changeSubView('familyriskprofile')}>
              <Text style={this.state.buttonTextFRP}>Family Risk Profile</Text>
            </TouchableOpacity>
          </View>
          {this.state.subView === 'maps' ? <MapSection /> : <FamilyRiskProfile />}
        </View>
      </ScrollView>

    );
  }
}
