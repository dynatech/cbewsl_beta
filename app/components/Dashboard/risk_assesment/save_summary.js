import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'

export default class SaveSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary_id: 0,
            local_storage_id: 0,
            location: "",
            impact: "",
            adaptive_capacity: "",
            vulnerability: "",
            sync_status: 0,
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        console.log(data)
        if (data != "none") {
            this.setState({
                summary_id: data.summary_id,
                local_storage_id: data.local_storage_id,
                location: data.location,
                impact: data.impact,
                adaptive_capacity: data.adaptive_capacity,
                vulnerability: data.vulnerability,
                sync_status: data.sync_status,
            });
        } else {
            this.setState({
                summary_id: 0,
                local_storage_id: 0,
                location: "",
                impact: "",
                adaptive_capacity: "",
                vulnerability: "",
                sync_status: 0
            });
        }
    }

    saveSummary() {
        const { summary_id,
            local_storage_id,
            location,
            impact,
            adaptive_capacity,
            vulnerability,
            sync_status } = this.state

        fetch('http://192.168.150.191:5000/api/risk_assesment_summary/save_risk_assessment_summary', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                summary_id: summary_id,
                local_storage_id: local_storage_id,
                location: location,
                impact: impact,
                adaptive_capacity: adaptive_capacity,
                vulnerability: vulnerability
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    this.props.navigation.navigate('modify_summary');
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                data = {
                    summary_id: summary_id,
                    local_storage_id: local_storage_id,
                    location: location,
                    impact: impact,
                    adaptive_capacity: adaptive_capacity,
                    vulnerability: vulnerability,
                    sync_status: 1
                }
                let offline_data = Storage.getItem("RiskAssessmentSummary");
                offline_data.then(response => {
                    if (local_storage_id == 0) {
                        if (response == null) {
                            Storage.removeItem("RiskAssessmentSummary")
                            Storage.setItem("RiskAssessmentSummary", [data])
                        } else {
                            let temp = response
                            temp.push(data)
                            let updated_data = []
                            let counter = 0
                            temp.forEach((value) => {
                                counter += 1
                                updated_data.push({
                                    summary_id: value.summary_id,
                                    local_storage_id: counter,
                                    location: value.location,
                                    impact: value.impact,
                                    adaptive_capacity: value.adaptive_capacity,
                                    vulnerability: value.vulnerability,
                                    sync_status: value.sync_status
                                })
                            });
                            Storage.removeItem("RiskAssessmentSummary")
                            Storage.setItem("RiskAssessmentSummary", updated_data)
                        }
                    } else {
                        let temp = response
                        let updated_data = []
                        let counter = 0
                        temp.forEach((value) => {
                            counter += 1
                            if (local_storage_id == value.local_storage_id) {
                                updated_data.push({
                                    summary_id: summary_id,
                                    local_storage_id: counter,
                                    location: location,
                                    impact: impact,
                                    adaptive_capacity: adaptive_capacity,
                                    vulnerability: vulnerability,
                                    sync_status: 2
                                })
                            } else {
                                updated_data.push({
                                    summary_id: value.summary_id,
                                    local_storage_id: counter,
                                    location: value.location,
                                    impact: value.impact,
                                    adaptive_capacity: value.adaptive_capacity,
                                    vulnerability: value.vulnerability,
                                    sync_status: value.sync_status
                                })
                            }
                        });
                        Storage.removeItem("RiskAssessmentSummary")
                        Storage.setItem("RiskAssessmentSummary", updated_data)
                    }
                })
                this.props.navigation.navigate('modify_summary');
                // 1 - adding |2 - modified |3 - old_data
            });
    }

    render() {
        return (
            <ScrollView style={rassessment_styles.container}>
                <View style={rassessment_styles.menuSection}>
                    <TextInput style={defaults.inputs} placeholder="Location: E.g. Barangay Hall" value={this.state.location} onChangeText={text => this.setState({ location: text })} />
                    <TextInput style={defaults.inputs} placeholder="Impact: E.g. Low" value={this.state.impact} onChangeText={text => this.setState({ impact: text })} />
                    <TextInput style={defaults.inputs} placeholder="Adaptive Capacity: E.g. High" value={this.state.adaptive_capacity} onChangeText={text => this.setState({ adaptive_capacity: text })} />
                    <TextInput style={defaults.inputs} placeholder="Vulnerability: E.g. Medium" value={this.state.vulnerability} onChangeText={text => this.setState({ vulnerability: text })} />
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.saveSummary()} style={defaults.touchableButtons}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
