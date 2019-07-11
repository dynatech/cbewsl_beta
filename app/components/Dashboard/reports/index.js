import moment from "moment";
import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';

export default class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: []
    };
  }

  formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:MM:SS A")
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:MM:SS A")
    }


    return {
      current_timestamp: current_timestamp,
      text_format_timestamp: text_format_timestamp
    }
  }

  getAllReports() {
    Notification.endOfValidity();
    let all_reports = []

    let alertGeneration = Storage.getItem('alertGeneration')
    let FieldSurveyLatestReportSummary = Storage.getItem('FieldSurveyLatestReportSummary')
    let RiskAssessmentFamilyRiskProfile = Storage.getItem('RiskAssessmentFamilyRiskProfile')
    let RiskAssessmentHazardData = Storage.getItem('RiskAssessmentHazardData')
    let RiskAssessmentRNC = Storage.getItem('RiskAssessmentRNC')
    let RiskAssessmentSummary = Storage.getItem('RiskAssessmentSummary')
    let SensorMaintenanceLogs = Storage.getItem('SensorMaintenanceLogs')
    let RainfallSummary = Storage.getItem('RainfallSummary')
    let SituationReportLatest = Storage.getItem('SituationReportLatest')
    let SurficialDataCurrentMeasurement = Storage.getItem('SurficialDataCurrentMeasurement')
    let SurficialDataMomsSummary = Storage.getItem('SurficialDataMomsSummary')

    alertGeneration.then(response => {
      if (response.length != 0) {
        let date = this.formatDateTime(date = response.event_start)
        all_reports.push({
          "date": date["text_format_timestamp"],
          "data": response,
          "report_name": "Current Alert",
          "key": "alert_gen"
        });
      }
    });

    RiskAssessmentSummary.then(response => {
      if (response.length != 0) {
        all_reports.push({
          "date": "N/A",
          "data": response,
          "report_name": "Risk Assessment Summary Report",
          "key": "summary"
        });
      }
    });

    RiskAssessmentHazardData.then(response => {
      if (response.length != 0) {
        all_reports.push({
          "date": "N/A",
          "data": response,
          "report_name": "Risk Assessment Hazard Data",
          "key": "hazard_data"
        });
      }
    });

    RiskAssessmentRNC.then(response => {
      if (response.length != 0) {
        all_reports.push({
          "date": "N/A",
          "data": response,
          "report_name": "Risk Assessment Resources and Capacities",
          "key": "resource_capacity"
        });
      }
    });

    RiskAssessmentFamilyRiskProfile.then(response => {
      if (response.length != 0) {
        all_reports.push({
          "date": "N/A",
          "data": response,
          "report_name": "Risk Assessment Family Risk Profile",
          "key": "family_risk"
        });
      }
    });

    FieldSurveyLatestReportSummary.then(response => {
      if (response.length != 0) {
        all_reports.push({
          "date": response[0].date,
          "data": response[0],
          "report_name": "Field Survey Report",
          "key": "field_survey"
        });
      }
    });

    SituationReportLatest.then(response => {
      if (response.length != 0) {
        let date = this.formatDateTime(date = response[0].timestamp)
        all_reports.push({
          "date": date["text_format_timestamp"],
          "data": response[0],
          "report_name": "Situation Report",
          "key": "situation_report"
        });
      }
    });

    RainfallSummary.then(response => {
      if (response.length != 0) {
        let date = this.formatDateTime(date = response[0].date)
        all_reports.push({
          "date": date["text_format_timestamp"],
          "data": response[0],
          "report_name": "Rainfall Summary Report",
          "key": "rainfall_summary"
        });
      }
    });

    SensorMaintenanceLogs.then(response => {
      if (response.length != 0) {
        let date = this.formatDateTime(date = response[0].timestamp)
        all_reports.push({
          "date": date["text_format_timestamp"],
          "data": response[0],
          "report_name": "Sensor Maintenance Report",
          "key": "sensor_maintenance"
        });
      }
    });

    SurficialDataCurrentMeasurement.then(response => {
      if (response.length != 0) {
        let date = this.formatDateTime(date = response.current_measurement_date)
        all_reports.push({
          "date": date["text_format_timestamp"],
          "data": "No data available",
          "report_name": "Surficial Current Measurement Report",
          "key": "surficial_measurement"
        });
      }
    });

    SurficialDataMomsSummary.then(response => {
      if (response.length != 0) {
        let date = this.formatDateTime(date = response[0].date)
        all_reports.push({
          "date": date["text_format_timestamp"],
          "data": response[0],
          "report_name": "Manifestation of Movements Report",
          "key": "moms"
        });
      }
      this.generateReportsTable(all_reports)
    });

  }

  viewReport(report_data) {
    this.props.navigation.navigate('view_report', {
      data: report_data
    })
  }

  generateReportsTable(collection_of_reports) {
    let reports = []
    for (const [index, value] of collection_of_reports.entries()) {
      reports.push(<DataTable.Row>
        <DataTable.Cell>{value.date}</DataTable.Cell>
        <DataTable.Cell>{value.report_name}</DataTable.Cell>
        <DataTable.Cell>
          <Text style={{ color: "blue" }} onPress={() => this.viewReport(value)}>[View]</Text>
        </DataTable.Cell>
      </DataTable.Row>)
    }

    this.setState({ reports: reports })
  }

  render() {
    return (
      <ScrollView style={rassessment_styles.container}>
        <NavigationEvents onDidFocus={() => this.getAllReports()} />
        <View style={rassessment_styles.menuSection}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Type</DataTable.Title>
              <DataTable.Title>Action</DataTable.Title>
            </DataTable.Header>
            {this.state.reports}
          </DataTable>
        </View>
      </ScrollView>
    );
  }
}
