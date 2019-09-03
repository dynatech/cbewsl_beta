import moment from "moment";
import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles';
import Notification from '../../utils/alert_notification';
import RainfallGraph from '../sensor_maintenance/rainfall_graph';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ViewReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            table_reports: [],
            data: [],
            data_paginate: [],
            page: 0,
            number_of_pages: 0,
            report_name: "",
            spinner: true
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
        setTimeout(()=> {
            this.setState({spinner: false})
        },2000)
    }

    tablePaginate(data) {
        let temp = []
        let counter = 0
        let number_of_pages = data.length / 6
        this.setState({ number_of_pages: Math.ceil(number_of_pages) })
        data.forEach(element => {
            if (counter < 6) {
                temp.push(element)
            }
            counter++
        });
        this.setState({ data_paginate: temp })
    }

    changePage(page) {
        let start = (page * 6)
        let end = start * 2
        let temp = []

        if (end == 0) {
            end = 6
        }

        for (let counter = start; counter < end; counter++) {
            temp.push(this.state.data[counter])
        }
        this.setState({ data_paginate: temp })
        this.setState({ page: page })
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
        let response = data.data
        let alert_details = []
        let alert_level = []
        let moms_header = []
        let rain_header = []
        let moms_temp = ""
        let rain_temp = ""
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
        this.setState({ report_name: data.report_name })
        this.setState({ reports: alert_details })
    }

    renderSummaryReport(data) {
        let response = data.data
        let report_datas = []

        report_datas.push(<DataTable.Row style={{ flex: 1, width: 500 }}>
            <DataTable.Cell >Location</DataTable.Cell>
            <DataTable.Cell>Impact</DataTable.Cell>
            <DataTable.Cell>Adaptive Capacity</DataTable.Cell>
            <DataTable.Cell>Vulnerability</DataTable.Cell>
        </DataTable.Row>)

        for (const [index, value] of response.entries()) {
            report_datas.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.location}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.impact}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.adaptive_capacity}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerability}</DataTable.Cell>
            </DataTable.Row>)
        }

        this.setState({ report_name: data.report_name })
        this.setState({ table_reports: report_datas })
    }

    renderHazardDataReport(data) {
        let response = data.data
        let report_datas = []

        report_datas.push(<DataTable.Row style={{ flex: 1, width: 500 }}>
            <DataTable.Cell>Hazard</DataTable.Cell>
            <DataTable.Cell>Speed of Onset</DataTable.Cell>
            <DataTable.Cell>Early Warning</DataTable.Cell>
            <DataTable.Cell>Impact</DataTable.Cell>
        </DataTable.Row>)

        for (const [index, value] of response.entries()) {
            report_datas.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.hazard}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.speed_of_onset}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.early_warning}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.impact}</DataTable.Cell>
            </DataTable.Row>)
        }

        this.setState({ report_name: data.report_name })
        this.setState({ table_reports: report_datas })
    }

    renderResourceCapacityReport(data) {
        let response = data.data
        let report_datas = []

        report_datas.push(<DataTable.Row style={{ flex: 1, width: 500 }}>
            <DataTable.Cell>Resource/Capacity</DataTable.Cell>
            <DataTable.Cell>Status</DataTable.Cell>
            <DataTable.Cell>Owner</DataTable.Cell>
        </DataTable.Row>)

        for (const [index, value] of response.entries()) {
            report_datas.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.resource_and_capacity}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.status}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.owner}</DataTable.Cell>
            </DataTable.Row>)
        }

        this.setState({ report_name: data.report_name })
        this.setState({ table_reports: report_datas })

    }

    renderFamilyRiskReport(data) {
        let response = data.data
        let report_datas = []

        report_datas.push(<DataTable.Row style={{ flex: 1, width: 500 }}>
            <DataTable.Cell>Number of members</DataTable.Cell>
            <DataTable.Cell>Vulnerable groups</DataTable.Cell>
            <DataTable.Cell>Nature of vulnerability</DataTable.Cell>
        </DataTable.Row>)

        for (const [index, value] of response.entries()) {
            // console.log(value)
            report_datas.push(<DataTable.Row style={{ width: 500 }}>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.members_count}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerable_members_count}</DataTable.Cell>
                <DataTable.Cell style={{ marginRight: 10 }}>{value.vulnerability_nature}</DataTable.Cell>
            </DataTable.Row>)
        }

        this.setState({ report_name: data.report_name })
        this.setState({ table_reports: report_datas })
    }

    renderFieldSurveyReport(data) {
        let response = data.data
        let latest_report = []

        let note = response.note
        let note_label = ""
        if (note == "") {
            note = ""
            note_label = ""
        } else {
            note_label = "Note"
        }
        latest_report.push(<View style={{ padding: 10 }}>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Date of Survey: {data.date}</Text>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text>Features</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                    <Text> {response.features}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text>Materials characterization</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                    <Text>{response.mat_characterization}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text>Mechanism</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                    <Text>{response.mechanism}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text>Exposure</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                    <Text>{response.exposure}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: 'red' }} >{note_label}</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                    <Text style={{ color: 'red' }} >{note}</Text>
                </View>
            </View>
        </View>)
        console.log(data.report_name)
        this.setState({ report_name: data.report_name })
        this.setState({ reports: latest_report })
    }

    renderSituationReport(data) {
        console.log(data)
        let response = data.data
        let report = []


        report.push(
            <View style={rassessment_styles.contentContainer}>
                <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Date: {data.date}</Text>
                </View>
                <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Summary: {response.summary}</Text>
                </View>
                <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <Text style={{ fontSize: 10, color: 'blue', textAlign: 'center' }}>Full situation report is available in the web app</Text>
                </View>
            </View>
        )

        this.setState({ report_name: data.report_name })
        this.setState({ reports: report })
    }

    renderRainfallSummaryReport(data) {
        console.log(data)
        let response = data.data
        let report = []
        let one_day_rain = Math.round((response["1D cml"] / response["half of 2yr max"]) * 100)
        let three_day_rain = Math.round((response["3D cml"] / response["2yr max"]) * 100)

        report.push(
            <View style={rassessment_styles.contentContainer}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Rainfall</Text>
                <View style={rassessment_styles.subContainer}>
                    <Text style={{ textAlign: 'center' }}>1-day threshold: {String(one_day_rain)}%</Text>
                    <Text style={{ textAlign: 'center' }}>3-day threshold: {String(three_day_rain)}%</Text>
                </View>
            </View>
        )
        report.push(<RainfallGraph></RainfallGraph>)

        this.setState({ report_name: data.report_name })
        this.setState({ reports: report })
    }

    renderSensorMaintenanceReport(data) {
        let response = data.data
        let report = []

        report.push(<View style={{ paddingBottom: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>as of {data.date}</Text>
            <Text style={{ fontSize: 15, textAlign: 'center' }}>Working Nodes: {response.working_nodes}</Text>
            <Text style={{ fontSize: 15, textAlign: 'center' }}>Anomalous Nodes: {response.anomalous_nodes}</Text>
            <Text style={{ fontSize: 15, textAlign: 'center' }}>Rain Gauge Status: {response.rain_gauge_status}</Text>
        </View>)

        this.setState({ report_name: data.report_name })
        this.setState({ reports: report })
    }

    renderSurficialMeasurementReport(data) {
        let response = data.data
        let report = []

        report.push(<View style={{ paddingBottom: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{String(response)}</Text>
        </View>)

        this.setState({ report_name: data.report_name })
        this.setState({ reports: report })
    }

    renderMomsReport(data) {
        let response = data.data
        let report = []

        report.push(<View style={{ paddingBottom: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>as of {data.date}</Text>
            <Text style={{ fontSize: 15, textAlign: 'center' }}>Type of feature: {response.type_of_feature}</Text>
            <Text style={{ fontSize: 15, textAlign: 'center' }}>Description: {response.description}</Text>
            <Text style={{ fontSize: 15, textAlign: 'center' }}>Name of feature: {response.name_of_feature}</Text>
        </View>)

        this.setState({ report_name: data.report_name })
        this.setState({ reports: report })
    }


    render() {
        return (
            <ScrollView style={rassessment_styles.container}>
                <Spinner
                visible={this.state.spinner}
                textContent={'Fetching data...'}
                textStyle={spinner_styles.spinnerTextStyle}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{this.state.report_name}</Text>
                </View>
                <View>
                    {this.state.reports}
                </View>
                <ScrollView horizontal={true}>
                    <DataTable>
                        {this.state.table_reports}
                    </DataTable>
                </ScrollView>
            </ScrollView>
        );
    }
}
