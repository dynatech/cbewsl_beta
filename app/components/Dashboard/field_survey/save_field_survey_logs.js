import moment from "moment";
import React, { Component } from 'react';
import { Alert, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class SaveFieldSurveyLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field_survey_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            features: "",
            mat_characterization: "",
            mechanism: "",
            exposure: "",
            note: "",
            date: "",
            spinner: true
        };
    }

    componentWillMount() {
        Notification.endOfValidity();
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        if (data != "none") {
            this.setState({
                field_survey_id: data.field_survey_id,
                local_storage_id: data.local_storage_id,
                sync_status: data.sync_status,
                features: data.features,
                mat_characterization: data.mat_characterization,
                mechanism: data.mechanism,
                exposure: data.exposure,
                note: data.note,
                date: data.date,
                spinner: false
            });
        } else {
            this.setState({
                field_survey_id: 0,
                local_storage_id: 0,
                sync_status: 0,
                features: "",
                mat_characterization: "",
                mechanism: "",
                exposure: "",
                note: "",
                date: "",
                spinner: false
            });
        }
    }

    formatDateTime(date = null) {
        let timestamp = date
        let current_timestamp = ""
        let text_format_timestamp = ""
        if (timestamp == null) {
            current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
            text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm:ss A")
        } else {
            current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
            text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm:ss A")
        }


        return {
            current_timestamp: current_timestamp,
            text_format_timestamp: text_format_timestamp
        }
    }

    saveFieldSurveyLog() {
        this.setState({ spinner: true })
        Notification.endOfValidity();
        const { field_survey_id,
            local_storage_id,
            sync_status,
            features,
            mat_characterization,
            mechanism,
            exposure,
            note,
            date } = this.state
        if (features != "" && mat_characterization != "" && mechanism != "" && exposure != "" && note != "") {
            fetch('http://192.168.150.10:5000/api/field_survey/save_field_survey', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    field_survey_id: field_survey_id,
                    local_storage_id: local_storage_id,
                    sync_status: sync_status,
                    features: features,
                    mat_characterization: mat_characterization,
                    mechanism: mechanism,
                    exposure: exposure,
                    note: note
                }),
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    if (responseJson.status == true) {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                        let data_container = Storage.getItem('FieldSurveyLogs')
                        let updated_data = []

                        data = {
                            field_survey_id: field_survey_id,
                            local_storage_id: 1,
                            sync_status: 3,
                            features: features,
                            mat_characterization: mat_characterization,
                            mechanism: mechanism,
                            exposure: exposure,
                            note: note
                        }

                        data_container.then(response => {
                            if (response == null) {
                                Storage.removeItem("FieldSurveyLogs")
                                Storage.setItem("FieldSurveyLogs", [data])
                            } else {
                                let temp = response
                                temp.push(data)
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        field_survey_id: value.field_survey_id,
                                        local_storage_id: counter,
                                        sync_status: 3,
                                        features: value.features,
                                        mat_characterization: value.mat_characterization,
                                        mechanism: value.mechanism,
                                        exposure: value.exposure,
                                        note: value.note,
                                        date: value.date
                                    })
                                });
                                Storage.removeItem("FieldSurveyLogs")
                                Storage.setItem("FieldSurveyLogs", updated_data)
                            }
                            if (field_survey_id == 0) {
                                Storage.removeItem("FieldSurveyLatestReportSummary")
                                Storage.setItem("FieldSurveyLatestReportSummary", [data])
                            }
                            this.props.navigation.navigate('field_survery_logs');
                        });
                    } else {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    let current_date = this.formatDateTime();
                    data = {
                        field_survey_id: field_survey_id,
                        local_storage_id: local_storage_id,
                        sync_status: 1,
                        features: features,
                        mat_characterization: mat_characterization,
                        mechanism: mechanism,
                        exposure: exposure,
                        note: note,
                        date: current_date["text_format_timestamp"]
                    }

                    let offline_data = Storage.getItem("FieldSurveyLogs");
                    offline_data.then(response => {
                        if (local_storage_id == 0) {
                            data["local_storage_id"] = 1
                            if (response == null) {
                                Storage.removeItem("FieldSurveyLogs")
                                Storage.setItem("FieldSurveyLogs", [data])
                            } else {
                                let temp = response
                                temp.push(data)
                                let updated_data = []
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        field_survey_id: value.field_survey_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        features: value.features,
                                        mat_characterization: value.mat_characterization,
                                        mechanism: value.mechanism,
                                        exposure: value.exposure,
                                        note: value.note,
                                        date: value.date
                                    })
                                });
                                Storage.removeItem("FieldSurveyLogs")
                                Storage.setItem("FieldSurveyLogs", updated_data)
                            }

                            Storage.removeItem("FieldSurveyLatestReportSummary")
                            Storage.setItem("FieldSurveyLatestReportSummary", [data])
                        } else {
                            let temp = response
                            let updated_data = []
                            let counter = 0
                            temp.forEach((value) => {
                                counter += 1
                                if (local_storage_id == value.local_storage_id) {
                                    updated_data.push({
                                        field_survey_id: field_survey_id,
                                        local_storage_id: counter,
                                        sync_status: 2,
                                        features: features,
                                        mat_characterization: mat_characterization,
                                        mechanism: mechanism,
                                        exposure: exposure,
                                        note: note,
                                        date: date
                                    })
                                    // data["date"] = date
                                    // Storage.removeItem("FieldSurveyLatestReportSummary")
                                    // Storage.setItem("FieldSurveyLatestReportSummary", [data])

                                } else {
                                    updated_data.push({
                                        field_survey_id: value.field_survey_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        features: value.features,
                                        mat_characterization: value.mat_characterization,
                                        mechanism: value.mechanism,
                                        exposure: value.exposure,
                                        note: value.note,
                                        date: value.date
                                    })
                                }
                            });
                            Storage.removeItem("FieldSurveyLogs")
                            Storage.setItem("FieldSurveyLogs", updated_data)
                        }
                        this.props.navigation.navigate('field_survery_logs');
                    });
                });
        } else {
            Alert.alert(
                'Field Survey',
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
            <ScrollView style={field_survey_styles.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Fetching data...'}
                    textStyle={spinner_styles.spinnerTextStyle}
                />
                <View style={field_survey_styles.menuSection}>
                    <TextInput multiline={true}
                        numberOfLines={4} style={defaults.inputs} placeholder="Features" value={this.state.features} onChangeText={text => this.setState({ features: text })} />
                    <TextInput style={defaults.inputs} placeholder="Materials characterization" value={this.state.mat_characterization} onChangeText={text => this.setState({ mat_characterization: text })} />
                    <TextInput style={defaults.inputs} placeholder="Mechanism" value={this.state.mechanism} onChangeText={text => this.setState({ mechanism: text })} />
                    <TextInput style={defaults.inputs} placeholder="Exposure" value={this.state.exposure} onChangeText={text => this.setState({ exposure: text })} />
                    <TextInput style={defaults.inputs} placeholder="Note" value={this.state.note} onChangeText={text => this.setState({ note: text })} />
                </View>
                <View>
                    <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.saveFieldSurveyLog()}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
