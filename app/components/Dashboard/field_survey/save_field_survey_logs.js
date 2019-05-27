import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import moment from "moment"

export default class SaveFieldSurveyLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field_survey_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            features: "",
            material_characterization: "",
            mechanism: "",
            exposure: "",
            note: "",
            date: ""
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        this.getCurrentDateTime()
        // console.log(data)
        if (data != "none") {
            console.log(data.material_characterization)
            this.setState({
                field_survey_id: data.field_survey_id,
                local_storage_id: data.local_storage_id,
                sync_status: data.sync_status,
                features: data.features,
                material_characterization: data.material_characterization,
                mechanism: data.mechanism,
                exposure: data.exposure,
                note: data.note,
                date: data.date,
            });
        } else {
            this.setState({
                field_survey_id: 0,
                local_storage_id: 0,
                sync_status: 0,
                features: "",
                material_characterization: "",
                mechanism: "",
                exposure: "",
                note: "",
                date: ""
            });
        }
    }

    getCurrentDateTime() {
        let current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
        let text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm:ss A")

        return {
            current_timestamp: current_timestamp,
            text_format_timestamp: text_format_timestamp
        }
    }

    saveFieldSurveyLog() {
        const { field_survey_id,
            local_storage_id,
            sync_status,
            features,
            material_characterization,
            mechanism,
            exposure,
            note } = this.state

        fetch('http://192.168.150.191:5000/api/field_survey/save_field_survey', {
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
                material_characterization: material_characterization,
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
                        material_characterization: material_characterization,
                        mechanism: mechanism,
                        exposure: exposure,
                        note: note
                    }

                    data_container.then(response => {
                        // Storage.removeItem("FieldSurveyLatestReportSummary")
                        // Storage.setItem("FieldSurveyLatestReportSummary", [data])
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
                                    material_characterization: value.material_characterization,
                                    mechanism: value.mechanism,
                                    exposure: value.exposure,
                                    note: value.note
                                })
                            });
                            Storage.removeItem("FieldSurveyLogs")
                            Storage.setItem("FieldSurveyLogs", updated_data)
                        }
                        this.props.navigation.navigate('field_survery_logs');
                    });
                } else {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                data = {
                    field_survey_id: field_survey_id,
                    local_storage_id: local_storage_id,
                    sync_status: 3,
                    features: features,
                    material_characterization: material_characterization,
                    mechanism: mechanism,
                    exposure: exposure,
                    note: note
                }
                // Storage.removeItem("FieldSurveyLatestReportSummary")
                // Storage.setItem("FieldSurveyLatestReportSummary", [data])
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
                                    material_characterization: value.material_characterization,
                                    mechanism: value.mechanism,
                                    exposure: value.exposure,
                                    note: value.note
                                })
                            });
                            Storage.removeItem("FieldSurveyLogs")
                            Storage.setItem("FieldSurveyLogs", updated_data)
                        }
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
                                    material_characterization: material_characterization,
                                    mechanism: mechanism,
                                    exposure: exposure,
                                    note: note
                                })
                            } else {
                                updated_data.push({
                                    field_survey_id: value.field_survey_id,
                                    local_storage_id: counter,
                                    sync_status: value.sync_status,
                                    features: value.features,
                                    material_characterization: value.material_characterization,
                                    mechanism: value.mechanism,
                                    exposure: value.exposure,
                                    note: value.note
                                })
                            }
                        });
                        Storage.removeItem("FieldSurveyLogs")
                        Storage.setItem("FieldSurveyLogs", updated_data)
                    }
                    this.props.navigation.navigate('field_survery_logs');
                });
            });
    }

    render() {
        return (
            <ScrollView style={field_survey_styles.container}>
                <View style={field_survey_styles.menuSection}>
                    <TextInput multiline={true}
                        numberOfLines={4} style={defaults.inputs} placeholder="Features" value={this.state.features} onChangeText={text => this.setState({ features: text })} />
                    <TextInput style={defaults.inputs} placeholder="Materials characterization" value={this.state.material_characterization} onChangeText={text => this.setState({ material_characterization: text })} />
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
