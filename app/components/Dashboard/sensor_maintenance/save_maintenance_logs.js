import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation'
import moment from "moment"

export default class SaveMaintenanceLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensor_maintenance_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            working_nodes: "",
            anamolous_nodes: "",
            rain_gauge_status: "",
            timestamp: "",
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        const selected_date = navigation.getParam("data", "none");
        console.log(selected_date)
        this.setState({ timestamp: selected_date })
    }

    saveSensorMaintenanceLogs() {
        const { sensor_maintenance_id,
            local_storage_id,
            sync_status,
            working_nodes,
            anamolous_nodes,
            rain_gauge_status,
            timestamp } = this.state


        fetch('http://192.168.150.191:5000/api/surficial_data/save_monitoring_log', {
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
                anamolous_nodes: anamolous_nodes,
                rain_gauge_status: rain_gauge_status,
                timestamp: timestamp
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                    let data_container = Storage.getItem('SensorMaintenanceLogs')
                    let updated_data = []
                    data = {
                        sensor_maintenance_id: sensor_maintenance_id,
                        local_storage_id: 1,
                        sync_status: 3,
                        working_nodes: working_nodes,
                        anamolous_nodes: anamolous_nodes,
                        rain_gauge_status: rain_gauge_status,
                        timestamp: timestamp
                    }
                    data_container.then(response => {
                        if (response == null) {
                            Storage.removeItem("SensorMaintenanceLogs")
                            Storage.setItem("SensorMaintenanceLogs", [data])
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
                                    anamolous_nodes: value.anamolous_nodes,
                                    rain_gauge_status: value.rain_gauge_status,
                                    timestamp: value.timestamp
                                })
                            });
                            Storage.removeItem("SensorMaintenanceLogs")
                            Storage.setItem("SensorMaintenanceLogs", updated_data)
                        }
                        this.props.navigation.navigate('maintenance_logs');
                    });

                } else {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                data = {
                    sensor_maintenance_id: sensor_maintenance_id,
                    local_storage_id: local_storage_id,
                    sync_status: 3,
                    working_nodes: working_nodes,
                    anamolous_nodes: anamolous_nodes,
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
                                    anamolous_nodes: value.anamolous_nodes,
                                    rain_gauge_status: value.rain_gauge_status,
                                    timestamp: value.timestamp
                                })
                            });
                            Storage.removeItem("SensorMaintenanceLogs")
                            Storage.setItem("SensorMaintenanceLogs", updated_data)
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
                                    anamolous_nodes: anamolous_nodes,
                                    rain_gauge_status: rain_gauge_status,
                                    timestamp: timestamp
                                })
                            } else {
                                updated_data.push({
                                    sensor_maintenance_id: value.sensor_maintenance_id,
                                    local_storage_id: counter,
                                    sync_status: value.sync_status,
                                    working_nodes: value.working_nodes,
                                    anamolous_nodes: value.anamolous_nodes,
                                    rain_gauge_status: value.rain_gauge_status,
                                    timestamp: value.timestamp
                                })
                            }
                        });
                        Storage.removeItem("SensorMaintenanceLogs")
                        Storage.setItem("SensorMaintenanceLogs", updated_data)
                    }
                    this.props.navigation.navigate('maintenance_logs');
                });
                // 1 - adding |2 - modified |3 - old_data
            });
    }


    render() {
        return (
            <ScrollView style={sensor_maintenance_styles.container}>
                <View style={sensor_maintenance_styles.contentContainer}>
                    <TextInput style={defaults.inputs} placeholder="Working Nodes" value={this.state.working_nodes} onChangeText={text => this.setState({ working_nodes: text })} />
                    <TextInput style={defaults.inputs} placeholder="Anamolous Nodes" value={this.state.anamolous_nodes} onChangeText={text => this.setState({ anamolous_nodes: text })} />
                    <TextInput style={defaults.inputs} placeholder="Rain Guage Status" value={this.state.rain_gauge_status} onChangeText={text => this.setState({ rain_gauge_status: text })} />
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
