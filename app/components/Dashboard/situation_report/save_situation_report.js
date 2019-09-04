import React, { Component } from 'react';
import { Alert, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { situation_report_styles } from '../../../assets/styles/situation_report_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

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
            image_path: "",
            spinner: true
        };
    }

    componentWillMount() {
        Notification.endOfValidity();
        const { navigation } = this.props;
        const data = navigation.getParam("report_data", "none");
        if (data != "none") {
            if (data.situation_report_id == undefined) {
                this.setState({
                    timestamp: data.date_selected,
                    spinner: false
                });
                console.log("add")
            } else {
                this.setState({
                    situation_report_id: data.situation_report_id,
                    local_storage_id: 0,
                    sync_status: 0,
                    timestamp: data.timestamp,
                    summary: data.summary,
                    pdf_path: "",
                    image_path: "",
                    spinner: false
                })
                console.log("update")
            }
        } else {
            console.log(data)
            // this.setState({
            //     timestamp: selected_date,
            //     spinner: false
            // })
        }
    }

    saveSituationReport() {
        this.setState({ spinner: true })
        Notification.endOfValidity();
        const { situation_report_id,
            local_storage_id,
            sync_status,
            timestamp,
            summary,
            pdf_path,
            image_path } = this.state
        if (summary != "") {
            fetch('http://192.168.1.10:5000/api/situation_report/save_situation_report', {
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
                                ToastAndroid.show("Successfully added a new entry!",ToastAndroid.LONG);
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
                                ToastAndroid.show("Successfully updated an entry!",ToastAndroid.LONG);
                            }
                            if (situation_report_id == 0) {
                                Storage.removeItem("SituationReportLatest")
                                Storage.setItem("SituationReportLatest", [data])
                            }
                            
                            setItemout(()=> {
                                this.props.navigation.navigate('situation_logs');
                            }, 1000)
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
                                ToastAndroid.show("Successfully added a new entry!",ToastAndroid.LONG);
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
                                ToastAndroid.show("Successfully updated an entry!",ToastAndroid.LONG);
                            }
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
                                    ToastAndroid.show("Successfully added a new entry!",ToastAndroid.LONG);
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
                                    ToastAndroid.show("Successfully updated an entry!",ToastAndroid.LONG);
                                }
                            });
                            Storage.removeItem("SituationReportLogs")
                            Storage.setItem("SituationReportLogs", updated_data)
                        }
                        setItemout(()=> {
                            this.props.navigation.navigate('situation_logs');
                        }, 1000)
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
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Fetching data...'}
                    textStyle={spinner_styles.spinnerTextStyle}
                />
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
