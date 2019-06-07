import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Button, ToastAndroid } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation'
import moment from "moment"
import DateTimePicker from "react-native-modal-datetime-picker";

export default class SaveSurficialData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moms_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            datetime: "",
            type_of_feature: "",
            description: "",
            name_of_feature: ""
        };
    }

    saveSurficialData() {
        console.log(this.state.datetime)
        this.setState({ datetime: this.state.datetime });
        const { moms_id,
            local_storage_id,
            sync_status,
            datetime,
            type_of_feature,
            description,
            name_of_feature } = this.state

        fetch('http://192.168.150.191:5000/api/surficial_data/save_monitoring_log', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                moms_id: moms_id,
                local_storage_id: 1,
                sync_status: 3,
                timestamp: datetime,
                type_of_feature: type_of_feature,
                description: description,
                name_of_feature: name_of_feature
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                    // let data_container = Storage.getItem('RiskAssessmentSummary')
                    // let updated_data = []
                    // data = {
                    //     summary_id: summary_id,
                    //     local_storage_id: 1,
                    //     sync_status: 3,
                    //     location: location,
                    //     impact: impact,
                    //     adaptive_capacity: adaptive_capacity,
                    //     vulnerability: vulnerability
                    // }
                    // data_container.then(response => {
                    //     if (response == null) {
                    //         Storage.removeItem("RiskAssessmentSummary")
                    //         Storage.setItem("RiskAssessmentSummary", [data])
                    //     } else {
                    //         let temp = response
                    //         temp.push(data)
                    //         let counter = 0
                    //         temp.forEach((value) => {
                    //             counter += 1
                    //             updated_data.push({
                    //                 summary_id: value.summary_id,
                    //                 local_storage_id: counter,
                    //                 sync_status: 3,
                    //                 location: value.location,
                    //                 impact: value.impact,
                    //                 adaptive_capacity: value.adaptive_capacity,
                    //                 vulnerability: value.vulnerability
                    //             })
                    //         });
                    //         Storage.removeItem("RiskAssessmentSummary")
                    //         Storage.setItem("RiskAssessmentSummary", updated_data)
                    //     }
                    this.props.navigation.navigate('monitoring_logs');
                    // });

                } else {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                // data = {
                //     summary_id: summary_id,
                //     local_storage_id: local_storage_id,
                //     sync_status: 1,
                //     location: location,
                //     impact: impact,
                //     adaptive_capacity: adaptive_capacity,
                //     vulnerability: vulnerability
                // }
                // let offline_data = Storage.getItem("RiskAssessmentSummary");
                // offline_data.then(response => {
                //     if (local_storage_id == 0) {
                //         data["local_storage_id"] = 1
                //         if (response == null) {
                //             Storage.removeItem("RiskAssessmentSummary")
                //             Storage.setItem("RiskAssessmentSummary", [data])
                //         } else {
                //             let temp = response
                //             temp.push(data)
                //             let updated_data = []
                //             let counter = 0
                //             temp.forEach((value) => {
                //                 counter += 1
                //                 updated_data.push({
                //                     summary_id: value.summary_id,
                //                     local_storage_id: counter,
                //                     sync_status: value.sync_status,
                //                     location: value.location,
                //                     impact: value.impact,
                //                     adaptive_capacity: value.adaptive_capacity,
                //                     vulnerability: value.vulnerability
                //                 })
                //             });
                //             Storage.removeItem("RiskAssessmentSummary")
                //             Storage.setItem("RiskAssessmentSummary", updated_data)
                //         }
                //     } else {
                //         let temp = response
                //         let updated_data = []
                //         let counter = 0
                //         temp.forEach((value) => {
                //             counter += 1
                //             if (local_storage_id == value.local_storage_id) {
                //                 updated_data.push({
                //                     summary_id: summary_id,
                //                     local_storage_id: counter,
                //                     sync_status: 2,
                //                     location: location,
                //                     impact: impact,
                //                     adaptive_capacity: adaptive_capacity,
                //                     vulnerability: vulnerability
                //                 })
                //             } else {
                //                 updated_data.push({
                //                     summary_id: value.summary_id,
                //                     local_storage_id: counter,
                //                     sync_status: value.sync_status,
                //                     location: value.location,
                //                     impact: value.impact,
                //                     adaptive_capacity: value.adaptive_capacity,
                //                     vulnerability: value.vulnerability
                //                 })
                //             }
                //         });
                //         Storage.removeItem("RiskAssessmentSummary")
                //         Storage.setItem("RiskAssessmentSummary", updated_data)
                //     }
                //     this.props.navigation.navigate('modify_summary');
                // });
                // 1 - adding |2 - modified |3 - old_data
            });
    }

    render() {
        return (
            <ScrollView style={surficial_data_styles.container}>
                {/* <View style={surficial_data_styles.contentContainer}>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Measurements</Text>
                    </View>
                </View>
                <View style={surficial_data_styles.contentContainer}>
                    <DatePicker
                        style={[defaults.inputs, { width: '95%' }]}
                        format="YYYY-MM-DD HH:mm"
                        date={this.state.datetime}
                        value={this.state.datetime}
                        mode="datetime"
                        duration={400}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        onDateChange={(date) => { this.setState({ datetime: date }) }}
                    />
                    <TextInput style={defaults.inputs} placeholder="Crack A" value={this.state.crack_a} onChangeText={text => this.setState({ crack_a: text })} />
                    <TextInput style={defaults.inputs} placeholder="Crack B" value={this.state.crack_b} onChangeText={text => this.setState({ crack_b: text })} />
                    <TextInput style={defaults.inputs} placeholder="Crack C" value={this.state.crack_c} onChangeText={text => this.setState({ crack_c: text })} />
                </View> */}
                <View style={surficial_data_styles.contentContainer}>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Manifestation of Movement</Text>
                    </View>
                    {/* <DatePicker
                        style={[defaults.inputs, { width: '95%' }]}
                        format="YYYY-MM-DD HH:mm"
                        date={this.state.datetime}
                        value={this.state.datetime}
                        mode="datetime"
                        duration={400}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        onDateChange={(date) => { this.setState({ datetime: date }) }}
                    /> */}
                    <TextInput style={defaults.inputs} placeholder="Type of Feature" value={this.state.type_of_feature} onChangeText={text => this.setState({ type_of_feature: text })} />
                    <TextInput style={defaults.inputs} placeholder="Description" value={this.state.description} onChangeText={text => this.setState({ description: text })} />
                    <TextInput style={defaults.inputs} placeholder="Name of Feature (if applicable)" value={this.state.name_of_feature} onChangeText={text => this.setState({ name_of_feature: text })} />
                </View>
                <View>
                    <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.saveSurficialData()}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
