import React, { Component } from 'react';
import { Alert, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class SaveHazardData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hazard_data_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            hazard: "",
            speed_of_onset: "",
            early_warning: "",
            impact: "",
            spinner: true
        };
    }

    componentWillMount() {
        Notification.endOfValidity();
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        if (data != "none") {
            this.setState({
                hazard_data_id: data.hazard_data_id,
                local_storage_id: data.local_storage_id,
                sync_status: data.sync_status,
                hazard: data.hazard,
                speed_of_onset: data.speed_of_onset,
                early_warning: data.early_warning,
                impact: data.impact
            });
        } else {
            this.setState({
                hazard_data_id: 0,
                local_storage_id: 0,
                sync_status: 0,
                hazard: "",
                speed_of_onset: "",
                early_warning: "",
                impact: ""
            });
        }
        this.setState({spinner: false})
    }

    saveHazardData() {
        this.setState({spinner: true})
        Notification.endOfValidity();
        const { hazard_data_id,
            local_storage_id,
            sync_status,
            hazard,
            speed_of_onset,
            early_warning,
            impact } = this.state
        if (hazard != "" && speed_of_onset != "" && early_warning != "" && impact != "") {
            fetch('http://192.168.8.100:5000/api/hazard_data/save_hazard_data', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hazard_data_id: hazard_data_id,
                    local_storage_id: local_storage_id,
                    sync_status: sync_status,
                    hazard: hazard,
                    speed_of_onset: speed_of_onset,
                    early_warning: early_warning,
                    impact: impact
                }),
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == true) {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                        let data_container = Storage.getItem('RiskAssessmentHazardData')
                        let updated_data = []
                        data = {
                            hazard_data_id: hazard_data_id,
                            local_storage_id: 1,
                            sync_status: 3,
                            hazard: hazard,
                            speed_of_onset: speed_of_onset,
                            early_warning: early_warning,
                            impact: impact
                        }
                        data_container.then(response => {
                            if (response == null) {
                                Storage.removeItem("RiskAssessmentHazardData")
                                Storage.setItem("RiskAssessmentHazardData", [data])
                                ToastAndroid.show("Sucessfully added a new entry!", ToastAndroid.LONG)
                            } else {
                                let temp = response
                                temp.push(data)
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        hazard_data_id: value.hazard_data_id,
                                        local_storage_id: counter,
                                        sync_status: 3,
                                        hazard: hazard,
                                        speed_of_onset: value.speed_of_onset,
                                        early_warning: value.early_warning,
                                        impact: value.impact
                                    })
                                });
                                Storage.removeItem("RiskAssessmentHazardData")
                                Storage.setItem("RiskAssessmentHazardData", updated_data)
                                ToastAndroid.show("Successfully updated an entry!", ToastAndroid.LONG)
                            }
                            setTimeout(()=> {
                                this.props.navigation.navigate('modify_hazard_data');
                            })
                        });

                    } else {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    data = {
                        hazard_data_id: hazard_data_id,
                        local_storage_id: local_storage_id,
                        sync_status: 1,
                        hazard: hazard,
                        speed_of_onset: speed_of_onset,
                        early_warning: early_warning,
                        impact: impact
                    }
                    let offline_data = Storage.getItem("RiskAssessmentHazardData");
                    offline_data.then(response => {
                        data["local_storage_id"] = 1
                        if (local_storage_id == 0) {
                            if (response == null) {
                                Storage.removeItem("RiskAssessmentHazardData")
                                Storage.setItem("RiskAssessmentHazardData", [data])
                            } else {
                                let temp = response
                                temp.push(data)
                                let updated_data = []
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        hazard_data_id: value.hazard_data_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        hazard: value.hazard,
                                        speed_of_onset: value.speed_of_onset,
                                        early_warning: value.early_warning,
                                        impact: value.impact
                                    })
                                });
                                Storage.removeItem("RiskAssessmentHazardData")
                                Storage.setItem("RiskAssessmentHazardData", updated_data)
                                ToastAndroid.show('Successfully added a new entry!', ToastAndroid.LONG)
                            }
                        } else {
                            let temp = response
                            let updated_data = []
                            let counter = 0
                            temp.forEach((value) => {
                                counter += 1
                                if (local_storage_id == value.local_storage_id) {
                                    updated_data.push({
                                        hazard_data_id: hazard_data_id,
                                        local_storage_id: counter,
                                        sync_status: 2,
                                        hazard: hazard,
                                        speed_of_onset: speed_of_onset,
                                        early_warning: early_warning,
                                        impact: impact
                                    })
                                } else {
                                    updated_data.push({
                                        hazard_data_id: value.hazard_data_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        hazard: value.hazard,
                                        speed_of_onset: value.speed_of_onset,
                                        early_warning: value.early_warning,
                                        impact: value.impact
                                    })
                                }
                            });
                            Storage.removeItem("RiskAssessmentHazardData")
                            Storage.setItem("RiskAssessmentHazardData", updated_data)
                            ToastAndroid.show('Successfully updated an entry!', ToastAndroid.LONG)
                        }
                        setTimeout(()=> {
                            this.props.navigation.navigate('modify_hazard_data');
                        },1000)
                    });
                });
        } else {
            Alert.alert(
                'Hazard Data',
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
                    <TextInput style={defaults.inputs} placeholder="Hazard: E.g. Landslide" value={this.state.hazard} onChangeText={text => this.setState({ hazard: text })} />
                    <TextInput style={defaults.inputs} placeholder="Speed of onset: E.g. Slow" value={this.state.speed_of_onset} onChangeText={text => this.setState({ speed_of_onset: text })} />
                    <TextInput style={defaults.inputs} placeholder="Early Warning: E.g. EWS-L" value={this.state.early_warning} onChangeText={text => this.setState({ early_warning: text })} />
                    <TextInput style={defaults.inputs} placeholder="Impact: E.g One week" value={this.state.impact} onChangeText={text => this.setState({ impact: text })} />
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.saveHazardData()} style={defaults.touchableButtons}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
