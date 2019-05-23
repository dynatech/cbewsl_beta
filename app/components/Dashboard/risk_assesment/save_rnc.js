import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'

export default class SaveResourcesAndCapacities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resources_and_capacities_id: 0,
            resource_and_capacity: "",
            status: "",
            owner: ""
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        if (data != "none") {
            this.setState({
                resources_and_capacities_id: data.resources_and_capacities_id,
                resource_and_capacity: data.resource_and_capacity,
                status: data.status,
                owner: data.owner
            });
        } else {
            this.setState({
                resources_and_capacities_id: 0,
                resource_and_capacity: "",
                status: "",
                owner: ""
            });
        }
    }

    saveRnc() {
        const { resources_and_capacities_id,
            resource_and_capacity,
            status,
            owner } = this.state

        fetch('http://192.168.150.191:5000/api/resources_and_capacities/save_resources_and_capacities', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resources_and_capacities_id: resources_and_capacities_id,
                resource_and_capacity: resource_and_capacity,
                status: status,
                owner: owner
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    this.props.navigation.navigate('modify_hazard_data');
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                data = {
                    resources_and_capacities_id: resources_and_capacities_id,
                    resource_and_capacity: resource_and_capacity,
                    status: status,
                    owner: owner
                }
                let offline_data = Storage.getItem("RiskAssessmentRNC");
                offline_data.then(response => {
                    if (response == null) {
                        Storage.removeItem("RiskAssessmentRNC")
                        Storage.setItem("RiskAssessmentRNC", [data])
                    } else {
                        let temp = response
                        temp.push(data)
                        Storage.removeItem("RiskAssessmentRNC")
                        Storage.setItem("RiskAssessmentRNC", temp)
                    }
                })
                this.props.navigation.navigate('modify_rnc');
            });
    }

    render() {
        return (
            <ScrollView style={rassessment_styles.container}>
                <View style={rassessment_styles.menuSection}>
                    <TextInput style={defaults.inputs} placeholder="Resources / Capacity: E.g. Evacuation center" value={this.state.resource_and_capacity} onChangeText={text => this.setState({ resource_and_capacity: text })} />
                    <TextInput style={defaults.inputs} placeholder="Status: E.g. Needs repair" value={this.state.status} onChangeText={text => this.setState({ status: text })} />
                    <TextInput style={defaults.inputs} placeholder="Owner: E.g. BLGU" value={this.state.owner} onChangeText={text => this.setState({ owner: text })} />
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.saveRnc()} style={defaults.touchableButtons}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
