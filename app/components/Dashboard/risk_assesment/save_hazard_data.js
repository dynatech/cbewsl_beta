import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'

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
                console.error(error);
            });
    }

    render() {
        return (
            <ScrollView style={rassessment_styles.container}>
                <View style={rassessment_styles.menuSection}>
                    <TextInput style={defaults.inputs} placeholder="Hazard: E.g. Landslide" onChangeText={text => this.setState({ hazard: text })} />
                    <TextInput style={defaults.inputs} placeholder="Speed of onset: E.g. Slow" onChangeText={text => this.setState({ speed_of_onset: text })} />
                    <TextInput style={defaults.inputs} placeholder="Early Warning: E.g. EWS-L" onChangeText={text => this.setState({ early_warning: text })} />
                    <TextInput style={defaults.inputs} placeholder="Impact: E.g One week" onChangeText={text => this.setState({ impact: text })} />
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
