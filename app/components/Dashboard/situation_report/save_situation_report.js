import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { situation_report_styles } from '../../../assets/styles/situation_report_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation'
import moment from "moment"
import Notification from '../../utils/alert_notification'

export default class SaveSituationReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            situation_report_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            timestamp: "",
            summary: "",
            pdf_path: "",
            image_path: ""
        };
    }

    componentWillMount() {
        Notification.endOfValidity();
        const { navigation } = this.props;
        const selected_date = navigation.getParam("data", "none");
        this.setState({ timestamp: selected_date })
    }

    saveSituationReport() {
        Notification.endOfValidity();
        console.log(this.state.timestamp)
        const { situation_report_id,
            local_storage_id,
            sync_status,
            timestamp,
            summary,
            pdf_path,
            image_path } = this.state
        if (summary != "") {
            fetch('http://192.168.150.191:5000/api/situation_report/save_situation_report', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    situation_report_id: situation_report_id,
                    local_storage_id: local_storage_id,
                    sync_status: sync_status,
                    timestamp: timestamp,
                    summary: summary,
                    pdf_path: pdf_path,
                    image_path: image_path
                }),
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == true) {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                        let data_container = Storage.getItem('SituationReportLogs')
                        let updated_data = []
                        data = {
                            situation_report_id: situation_report_id,
                            local_storage_id: 1,
                            sync_status: 3,
                            timestamp: timestamp,
                            summary: summary,
                            pdf_path: pdf_path,
                            image_path: image_path
                        }
                        data_container.then(response => {
                            if (response == null) {
                                Storage.removeItem("SituationReportLogs")
                                Storage.setItem("SituationReportLogs", [data])
                            } else {
                                let temp = response
                                temp.push(data)
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        situation_report_id: situation_report_id,
                                        local_storage_id: 1,
                                        sync_status: 3,
                                        timestamp: timestamp,
                                        summary: summary,
                                        pdf_path: pdf_path,
                                        image_path: image_path
                                    })
                                });
                                Storage.removeItem("SituationReportLogs")
                                Storage.setItem("SituationReportLogs", updated_data)
                            }
                            if (situation_report_id == 0) {
                                Storage.removeItem("SituationReportLatest")
                                Storage.setItem("SituationReportLatest", [data])
                            }

                            this.props.navigation.navigate('situation_logs');
                        });
                    } else {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    data = {
                        situation_report_id: situation_report_id,
                        local_storage_id: local_storage_id,
                        sync_status: 1,
                        timestamp: timestamp,
                        summary: summary,
                        pdf_path: pdf_path,
                        image_path: image_path
                    }
                    let offline_data = Storage.getItem("SituationReportLogs");
                    offline_data.then(response => {
                        if (local_storage_id == 0) {
                            data["local_storage_id"] = 1
                            if (response == null) {
                                Storage.removeItem("SituationReportLogs")
                                Storage.setItem("SituationReportLogs", [data])
                            } else {
                                let temp = response
                                temp.push(data)
                                let updated_data = []
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        situation_report_id: value.situation_report_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        timestamp: value.timestamp,
                                        summary: value.summary,
                                        pdf_path: value.pdf_path,
                                        image_path: value.image_path
                                    })
                                });
                                Storage.removeItem("SituationReportLogs")
                                Storage.setItem("SituationReportLogs", updated_data)
                            }
                            Storage.removeItem("SituationReportLatest")
                            Storage.setItem("SituationReportLatest", [data])
                        } else {
                            let temp = response
                            let updated_data = []
                            let counter = 0
                            temp.forEach((value) => {
                                counter += 1
                                if (local_storage_id == value.local_storage_id) {
                                    updated_data.push({
                                        situation_report_id: situation_report_id,
                                        local_storage_id: counter,
                                        sync_status: 2,
                                        timestamp: timestamp,
                                        summary: summary,
                                        pdf_path: pdf_path,
                                        image_path: image_path
                                    })
                                } else {
                                    updated_data.push({
                                        situation_report_id: value.situation_report_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        timestamp: value.timestamp,
                                        summary: value.summary,
                                        pdf_path: value.pdf_path,
                                        image_path: value.image_path
                                    })
                                }
                            });
                            Storage.removeItem("SituationReportLogs")
                            Storage.setItem("SituationReportLogs", updated_data)
                        }
                        this.props.navigation.navigate('situation_logs');
                    });
                });
        } else {
            Alert.alert(
                'Situation Report',
                'Summary field is required',
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
            <ScrollView style={situation_report_styles.container}>
                <View style={situation_report_styles.menuSection}>
                    <TextInput multiline={true}
                        numberOfLines={10} style={defaults.inputs} placeholder="Summary" value={this.state.summary} onChangeText={text => this.setState({ summary: text })} />

                </View>
                <View>
                    <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.saveSituationReport()}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
