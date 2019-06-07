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
            maintenance_logs_id: "",
            local_storage_id: "",
            sync_status: 0,
            working_nodes: "",
            anamolous_nodes: "",
            rain_gauge_status: "",
            datetime: "",
        };
    }

    saveSensorMaintenanceLogs() {

    }


    render() {
        return (
            <ScrollView style={sensor_maintenance_styles.container}>
                <View style={sensor_maintenance_styles.contentContainer}>
                    <TextInput style={defaults.inputs} placeholder="Working Nodes" value={this.state.working_nodes} onChangeText={text => this.setState({ working_nodes: text })} />
                    <TextInput style={defaults.inputs} placeholder="Anamolous Nodes" value={this.state.working_nodes} onChangeText={text => this.setState({ working_nodes: text })} />
                    <TextInput style={defaults.inputs} placeholder="Rain Guage Status" value={this.state.working_nodes} onChangeText={text => this.setState({ working_nodes: text })} />
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
