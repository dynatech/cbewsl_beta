import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subView: 'maps',
      buttonMap: rassessment_styles.subActiveButton,
      buttonTextMap: rassessment_styles.buttonActiveText,
      buttonFRP: rassessment_styles.subMenuButton,
      buttonTextFRP: rassessment_styles.buttonText,
      summary_data: [],
      summary_data_paginate: [],
      page: 0,
      number_of_pages: 0,
      spinner: true
    };
  }

  // Refactor this
  navigateRiskAssessment(tab) {
    switch (tab) {
      case "hazard_data":
        console.log(tab);
        this.props.navigation.navigate('hazard_data')
        break;
      case "r_n_c":
        console.log(tab);
        this.props.navigation.navigate('resources_and_capacities')
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

  getAllRiskAssessmentSummary() {
    Notification.endOfValidity();
    fetch('http://192.168.150.10:5000/api/risk_assesment_summary/get_all_risk_assessment_summary').then((response) => response.json())
      .then((responseJson) => {
        Sync.syncToNetwork("RiskAssessmentSummary").then(() => {
          let summary_data = [];
          let to_local_data = [];
          let counter = 0
          console.log("1")
          console.log(responseJson)
          if (responseJson != null || responseJson != undefined) {
            for (const [index, value] of responseJson.entries()) {
              summary_data.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.location}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.impact}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.adaptive_capacity}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerability}</DataTable.Cell>
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
          } else {
            summary_data.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
            </DataTable.Row>)
          }
          this.setState({ summary_data: summary_data })
          this.tablePaginate(summary_data)
          this.setState({ spinner: false });
        });

      })
      .catch((error) => {
        let data_container = Storage.getItem('RiskAssessmentSummary')
        let summary_data = [];
        data_container.then(response => {
          console.log("2")
          console.log(response)
          if (response != null || response != undefined) {
            for (const [index, value] of response.entries()) {
              summary_data.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.location}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.impact}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.adaptive_capacity}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerability}</DataTable.Cell>
              </DataTable.Row>)
            }
          } else {
            summary_data.push(<DataTable.Row style={{ width: 500 }}>
              <DataTable.Cell style={{ marginRight: 10 }}>No data</DataTable.Cell>
            </DataTable.Row>)
          }

          this.setState({ summary_data: summary_data })
          this.tablePaginate(summary_data)
          this.setState({ spinner: false });
        });
      });
  }

  tablePaginate(summary_data) {
    let temp = []
    let counter = 0
    let number_of_pages = summary_data.length / 6
    this.setState({ number_of_pages: Math.ceil(number_of_pages) })
    summary_data.forEach(element => {
      if (counter < 6) {
        temp.push(element)
      }
      counter++
    });
    this.setState({ summary_data_paginate: temp })
  }

  changePage(page) {
    let start = (page * 6)
    let end = start * 2
    let temp = []

    if (end == 0) {
      end = 6
    }

    for (let counter = start; counter < end; counter++) {
      temp.push(this.state.summary_data[counter])
    }
    this.setState({ summary_data_paginate: temp })
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
        <NavigationEvents onDidFocus={() => this.getAllRiskAssessmentSummary()} />
        <View style={rassessment_styles.menuSection}>
          <View style={rassessment_styles.buttonSection}>
            <TouchableOpacity style={rassessment_styles.activeButton}>
              <Text style={rassessment_styles.buttonActiveText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={rassessment_styles.menuButton} onPress={() => this.navigateRiskAssessment("hazard_data")}>
              <Text style={rassessment_styles.buttonText}>Hazard Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={rassessment_styles.menuButton} onPress={() => this.navigateRiskAssessment("r_n_c")}>
              <Text style={rassessment_styles.buttonText}>Resources and Capacities</Text>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal={true}>
              <DataTable>
                <DataTable.Header style={{ flex: 1, width: 500 }}>
                  <DataTable.Title >Location</DataTable.Title>
                  <DataTable.Title>Impact</DataTable.Title>
                  <DataTable.Title>Adaptive Capacity</DataTable.Title>
                  <DataTable.Title>Vulnerability</DataTable.Title>
                </DataTable.Header>
                {this.state.summary_data_paginate}
                <DataTable.Pagination
                  page={this.state.page}
                  numberOfPages={this.state.number_of_pages}
                  onPageChange={(page) => { this.changePage(page) }}
                  label={`Page ${this.state.page} of ${this.state.number_of_pages - 1}`}
                />
              </DataTable>
            </ScrollView>
            <TouchableOpacity style={defaults.button} onPress={() => this.props.navigation.navigate('modify_summary')}>
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
