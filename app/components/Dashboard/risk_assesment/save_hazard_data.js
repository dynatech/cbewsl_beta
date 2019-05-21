import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'

export default class SaveHazardData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hazard_data_id: 0,
            hazard: "",
            speed_of_onset: "",
            early_warning: "",
            impact: ""
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        if (data != "none") {
            this.setState({
                hazard_data_id: data.hazard_data_id,
                hazard: data.hazard,
                speed_of_onset: data.speed_of_onset,
                early_warning: data.early_warning,
                impact: data.impact
            });
        } else {
            this.setState({
                hazard_data_id: 0,
                hazard: "",
                speed_of_onset: "",
                early_warning: "",
                impact: ""
            });
        }
    }

    saveHazardData() {
        const { hazard_data_id,
            hazard,
            speed_of_onset,
            early_warning,
            impact } = this.state

        fetch('http://192.168.150.191:5000/api/hazard_data/save_hazard_data', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hazard_data_id: hazard_data_id,
                hazard: hazard,
                speed_of_onset: speed_of_onset,
                early_warning: early_warning,
                impact: impact
            }),
        }).then((response) => response.json())
            .catch((error) => {
                let offline_data = Storage.getItem('RiskAssessmentHazardData')
                offline_data.then(response => {
                    Storage.removeItem("RiskAssessmentHazardData")
                    Storage.setItem("RiskAssessmentHazardData", response)
                })
            })
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                    this.props.navigation.navigate('modify_hazard_data');
                } else {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <ScrollView style={rassessment_styles.container}>
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
