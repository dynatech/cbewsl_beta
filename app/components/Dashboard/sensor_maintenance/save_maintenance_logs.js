import React, { Component } from 'react';
import { Alert, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles';
import Notification from '../../utils/alert_notification';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class SaveMaintenanceLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensor_maintenance_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            working_nodes: "",
            anomalous_nodes: "",
            rain_gauge_status: "",
            timestamp: "",
            spinner:true
        };
    }

    componentDidMount() {
        Notification.endOfValidity();
        const { navigation } = this.props;
        const selected_date = navigation.getParam("data", "none");
        this.setState({ timestamp: selected_date, spinner: false })
    }

    saveSensorMaintenanceLogs() {
        this.setState({spinner: true})
        Notification.endOfValidity();
        const { sensor_maintenance_id,
            local_storage_id,
            sync_status,
            working_nodes,
            anomalous_nodes,
            rain_gauge_status,
            timestamp } = this.state

        if (working_nodes != "" && anomalous_nodes != "" && rain_gauge_status != "") {
            fetch('http://192.168.1.101:5000/api/sensor_maintenance/save_sensor_maintenance_logs', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sensor_maintenance_id: sensor_maintenance_id,
                    local_storage_id: 1,
                    sync_status: 3,
                    working_nodes: working_nodes,
                    anomalous_nodes: anomalous_nodes,
                    rain_gauge_status: rain_gauge_status,
                    timestamp: timestamp
                }),
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == true) {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                        let data_container = Storage.getItem('SensorMaintenanceLogs')
                        let updated_data = []
                        data = {
                            sensor_maintenance_id: sensor_maintenance_id,
                            local_storage_id: 1,
                            sync_status: 3,
                            working_nodes: working_nodes,
                            anomalous_nodes: anomalous_nodes,
                            rain_gauge_status: rain_gauge_status,
                            timestamp: timestamp
                        }
                        data_container.then(response => {
                            if (response == null) {
                                Storage.removeItem("SensorMaintenanceLogs")
                                Storage.setItem("SensorMaintenanceLogs", [data])
                                ToastAndroid.show("Sucessfully added a new entry!",ToastAndroid.LONG)
                            } else {
                                let temp = response
                                temp.push(data)
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        sensor_maintenance_id: value.sensor_maintenance_id,
                                        local_storage_id: counter,
                                        sync_status: 3,
                                        working_nodes: value.working_nodes,
                                        anomalous_nodes: value.anomalous_nodes,
                                        rain_gauge_status: value.rain_gauge_status,
                                        timestamp: value.timestamp
                                    })
                                });
                                Storage.removeItem("SensorMaintenanceLogs")
                                Storage.setItem("SensorMaintenanceLogs", updated_data)
                                ToastAndroid.show("Successfully updated an entry!",ToastAndroid.LONG)
                            }
                            setTimeout(()=> {
                                this.props.navigation.navigate('maintenance_logs');
                            })
                        });

                    } else {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    data = {
                        sensor_maintenance_id: sensor_maintenance_id,
                        local_storage_id: local_storage_id,
                        sync_status: 1,
                        working_nodes: working_nodes,
                        anomalous_nodes: anomalous_nodes,
                        rain_gauge_status: rain_gauge_status,
                        timestamp: timestamp
                    }
                    let offline_data = Storage.getItem("SensorMaintenanceLogs");
                    offline_data.then(response => {
                        if (local_storage_id == 0) {
                            data["local_storage_id"] = 1
                            if (response == null) {
                                Storage.removeItem("SensorMaintenanceLogs")
                                Storage.setItem("SensorMaintenanceLogs", [data])
                                ToastAndroid.show("Sucessfully added a new entry!",ToastAndroid.LONG)
                            } else {
                                let temp = response
                                temp.push(data)
                                let updated_data = []
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        sensor_maintenance_id: value.sensor_maintenance_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        working_nodes: value.working_nodes,
                                        anomalous_nodes: value.anomalous_nodes,
                                        rain_gauge_status: value.rain_gauge_status,
                                        timestamp: value.timestamp
                                    })
                                });
                                Storage.removeItem("SensorMaintenanceLogs")
                                Storage.setItem("SensorMaintenanceLogs", updated_data)
                                ToastAndroid.show("Successfully updated an entry!",ToastAndroid.LONG)
                            }
                        } else {
                            let temp = response
                            let updated_data = []
                            let counter = 0
                            temp.forEach((value) => {
                                counter += 1
                                if (local_storage_id == value.local_storage_id) {
                                    updated_data.push({
                                        sensor_maintenance_id: sensor_maintenance_id,
                                        local_storage_id: counter,
                                        sync_status: 2,
                                        working_nodes: working_nodes,
                                        anomalous_nodes: anomalous_nodes,
                                        rain_gauge_status: rain_gauge_status,
                                        timestamp: timestamp
                                    })
                                } else {
                                    updated_data.push({
                                        sensor_maintenance_id: value.sensor_maintenance_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        working_nodes: value.working_nodes,
                                        anomalous_nodes: value.anomalous_nodes,
                                        rain_gauge_status: value.rain_gauge_status,
                                        timestamp: value.timestamp
                                    })
                                }
                            });
                            Storage.removeItem("SensorMaintenanceLogs")
                            Storage.setItem("SensorMaintenanceLogs", updated_data)
                            ToastAndroid.show("Successfully updated an entry!",ToastAndroid.LONG)
                        }
                        setTimeout(()=> {
                                this.props.navigation.navigate('maintenance_logs');
                            })
                    });
                    // 1 - adding |2 - modified |3 - old_data
                });
        } else {
            Alert.alert(
                'Maintenance Logs',
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
            <ScrollView style={sensor_maintenance_styles.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Fetching data...'}
                    textStyle={spinner_styles.spinnerTextStyle}
                />
                <View style={sensor_maintenance_styles.contentContainer}>
                    <TextInput style={defaults.inputs} placeholder="Working Nodes" value={this.state.working_nodes} onChangeText={text => this.setState({ working_nodes: text })} />
                    <TextInput style={defaults.inputs} placeholder="Anomalous Nodes" value={this.state.anomalous_nodes} onChangeText={text => this.setState({ anomalous_nodes: text })} />
                    <TextInput style={defaults.inputs} placeholder="Rain Gauge Status" value={this.state.rain_gauge_status} onChangeText={text => this.setState({ rain_gauge_status: text })} />
                </View>
                <View>
                    <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.saveSensorMaintenanceLogs()}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
