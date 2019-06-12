import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { field_survey_styles } from '../../../assets/styles/field_survey_styles'
import Storage from '../../utils/storage'
import Notification from '../../utils/alert_notification'
import moment from "moment"

export default class ViewReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: []
        };
    }

    componentWillMount() {
        Notification.endOfValidity();
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        let key = data.key
        switch (key) {
            case "alert_gen":
                this.renderAlertGenReport(data);
                break;
            case "summary":
                this.renderSummaryReport(data);
                break;
            case "hazard_data":
                this.renderHazardDataReport(data);
                break;
            case "resource_capacity":
                this.renderResourceCapacityReport(data);
                break;
            case "family_risk":
                this.renderFamilyRiskReport(data);
                break;
            case "field_survey":
                this.renderFieldSurveyReport(data);
                break;
            case "situation_report":
                this.renderSituationReport(data);
                break;
            case "rainfall_summary":
                this.renderRainfallSummaryReport(data);
                break;
            case "sensor_maintenance":
                this.renderSensorMaintenanceReport(data);
                break;
            case "surficial_measurement":
                this.renderSurficialMeasurementReport(data);
                break;
            case "moms":
                this.renderMomsReport(data);
                break;
            default:
            // code block
        }
    }

    formatDateTime(date = null) {
        let timestamp = date
        let text_format_timestamp = ""
        if (timestamp == null) {
            date = moment(new Date()).format("YYYY/MM/DD")
            time = moment(new Date()).format("h:mm:ss A")
            text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm:ss A")
        } else {
            text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm:ss A")
        }
        return text_format_timestamp
    }

    renderAlertGenReport(data) {
        console.log(data)
        let response = data.data
        let alert_details = []
        let alert_level = []
        let moms_header = []
        let rain_header = []
        let moms_temp = ""
        let rain_temp = ""
        console.log(response.triggers.moms_id)
        if ('moms_id' in response.triggers) {
            console.log("may moms")
            moms_temp = "Feature type: " + response.triggers.type_of_feature + "(" + response.triggers.name_of_feature + ")\n" +
                "Description: " + response.triggers.description + "\n"
            moms_header.push(<Text style={{ fontWeight: 'bold', fontSize: 20 }}>Manifestation of Movements</Text>)
            if ('rain_id' in response.triggers) {
                rain_header.push(<Text style={{ fontWeight: 'bold', fontSize: 20 }}>Rainfall Alert</Text>)
                rain_temp = "Rainfall data exceeded threshold level."
            }
        } else if ('rain_id' in response.triggers) {
            rain_header.push(<Text style={{ fontWeight: 'bold', fontSize: 20 }}>Rainfall Alert</Text>)
            rain_temp = "Rainfall data exceeded threshold level."
        }

        if (response.alert_level == "A0") {
            alert_level.push(<Text style={{ fontSize: 50, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 0</Text>)
        } else if (response.alert_level == "A1") {
            alert_level.push(<Text style={{ fontSize: 50, color: "#f09e01", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 1</Text>)
        } else if (response.alert_level == "A2") {
            alert_level.push(<Text style={{ fontSize: 50, color: "#f27e10", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 2</Text>)
        } else if (response.alert_level == "A3") {
            alert_level.push(<Text style={{ fontSize: 50, color: "#ef7b7e", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 3</Text>)
        } else {
            alert_level.push(<Text style={{ fontSize: 50, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 0</Text>)
        }

        alert_details.push(
            <View style={{ padding: 20 }}>
                {alert_level}
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Triggers</Text>
                <View style={{ padding: 20 }}>
                    {moms_header}
                    <Text style={{ fontSize: 20 }}>{moms_temp}</Text>
                    {this.state.rain_header}
                    <Text style={{ fontSize: 20 }}>{rain_temp}</Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Validity</Text>
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 20 }}>{this.formatDateTime(response.validity)}</Text>
                </View>
            </View>
        )
        this.setState({ reports: alert_details })
    }

    renderSummaryReport(data) {
        console.log(data)
    }

    renderHazardDataReport(data) {
        console.log(data)
    }

    renderResourceCapacityReport(data) {
        console.log(data)
    }

    renderFamilyRiskReport(data) {
        console.log(data)
    }

    renderFieldSurveyReport(data) {
        console.log(data)
    }

    renderSituationReport(data) {
        console.log(data)
    }

    renderRainfallSummaryReport(data) {
        console.log(data)
    }

    renderSensorMaintenanceReport(data) {
        console.log(data)
    }

    renderSurficialMeasurementReport(data) {
        console.log(data)
    }

    renderMomsReport(data) {
        console.log(data)
    }


    render() {
        return (
            <ScrollView style={rassessment_styles.container}>
                <View>
                    {this.state.reports}
                </View>
            </ScrollView>
        );
    }
}
