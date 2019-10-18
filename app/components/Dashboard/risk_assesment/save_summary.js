import React, { Component } from 'react';
import { Alert, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class SaveSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            location: "",
            impact: "",
            adaptive_capacity: "",
            vulnerability: "",
            spinner: true
        };
    }

    componentDidMount() {
        Notification.endOfValidity();
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        if (data != "none") {
            this.setState({
                summary_id: data.summary_id,
                local_storage_id: data.local_storage_id,
                sync_status: data.sync_status,
                location: data.location,
                impact: data.impact,
                adaptive_capacity: data.adaptive_capacity,
                vulnerability: data.vulnerability
            });
        } else {
            this.setState({
                summary_id: 0,
                local_storage_id: 0,
                sync_status: 0,
                location: "",
                impact: "",
                adaptive_capacity: "",
                vulnerability: ""
            });
        }
        this.setState({spinner: false})
    }

    saveSummary() {
        this.setState({spinner: true})
        Notification.endOfValidity();
        const { summary_id,
            local_storage_id,
            sync_status,
            location,
            impact,
            adaptive_capacity,
            vulnerability } = this.state
        if (location != "" && impact != "" && adaptive_capacity != "" && vulnerability != "") {
            fetch('http://192.168.1.10:5000/api/risk_assesment_summary/save_risk_assessment_summary', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    summary_id: summary_id,
                    local_storage_id: local_storage_id,
                    sync_status: sync_status,
                    location: location,
                    impact: impact,
                    adaptive_capacity: adaptive_capacity,
                    vulnerability: vulnerability
                }),
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == true) {
                        ToastAndroid.show(responseJson.message, ToastAndroid.LONG);
                        let data_container = Storage.getItem('RiskAssessmentSummary')
                        let updated_data = []
                        data = {
                            summary_id: summary_id,
                            local_storage_id: 1,
                            sync_status: 3,
                            location: location,
                            impact: impact,
                            adaptive_capacity: adaptive_capacity,
                            vulnerability: vulnerability
                        }
                        data_container.then(response => {
                            if (response == null) {
                                Storage.removeItem("RiskAssessmentSummary")
                                Storage.setItem("RiskAssessmentSummary", [data])
                                ToastAndroid.show("Sucessfully added a new entry!", ToastAndroid.LONG)
                            } else {
                                let temp = response
                                temp.push(data)
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        summary_id: value.summary_id,
                                        local_storage_id: counter,
                                        sync_status: 3,
                                        location: value.location,
                                        impact: value.impact,
                                        adaptive_capacity: value.adaptive_capacity,
                                        vulnerability: value.vulnerability
                                    })
                                });
                                Storage.removeItem("RiskAssessmentSummary")
                                Storage.setItem("RiskAssessmentSummary", updated_data)
                                ToastAndroid.show("Successfully updated an entry!", ToastAndroid.LONG)
                            }
                            setTimeout(()=> {
                                this.props.navigation.navigate('modify_summary');
                            },1000)
                        });

                    } else {
                        ToastAndroid.show(responseJson.message, ToastAndroid.LONG);
                    }
                })
                .catch((error) => {
                    data = {
                        summary_id: summary_id,
                        local_storage_id: local_storage_id,
                        sync_status: 1,
                        location: location,
                        impact: impact,
                        adaptive_capacity: adaptive_capacity,
                        vulnerability: vulnerability
                    }
                    let offline_data = Storage.getItem("RiskAssessmentSummary");
                    offline_data.then(response => {
                        if (local_storage_id == 0) {
                            data["local_storage_id"] = 1
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
                                        sync_status: value.sync_status,
                                        location: value.location,
                                        impact: value.impact,
                                        adaptive_capacity: value.adaptive_capacity,
                                        vulnerability: value.vulnerability
                                    })
                                });
                                Storage.removeItem("RiskAssessmentSummary")
                                Storage.setItem("RiskAssessmentSummary", updated_data)
                                ToastAndroid.show("Sucessfully added a new entry!", ToastAndroid.LONG)
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
                                        sync_status: 2,
                                        location: location,
                                        impact: impact,
                                        adaptive_capacity: adaptive_capacity,
                                        vulnerability: vulnerability
                                    })
                                } else {
                                    updated_data.push({
                                        summary_id: value.summary_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        location: value.location,
                                        impact: value.impact,
                                        adaptive_capacity: value.adaptive_capacity,
                                        vulnerability: value.vulnerability
                                    })
                                }
                            });
                            Storage.removeItem("RiskAssessmentSummary")
                            Storage.setItem("RiskAssessmentSummary", updated_data)
                            ToastAndroid.show("Successfully updated an entry!", ToastAndroid.LONG)
                        }
                        setTimeout(()=> {
                            this.props.navigation.navigate('modify_summary');
                        }, 1000)
                    });
                    // 1 - adding |2 - modified |3 - old_data
                });
        } else {
            this.setState({spinner: false})
            Alert.alert(
                'Risk Assessment Summary',
                'All fields are required.',
                [
                    {
                        text: 'Close',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    }
                ],
                { cancelable: false },
            );
        }

    }

    render() {
        return (
            <ScrollView style={rassessment_styles.container}>
                <Spinner
                visible={this.state.spinner}
                textContent={'Fetching data...'}
                textStyle={spinner_styles.spinnerTextStyle}
                />
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
