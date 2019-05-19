import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles'
import { defaults } from '../../../assets/styles/default_styles'

export default class SaveFieldSurveyLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field_survey_id: 0,
            features: "",
            material_characterization: "",
            mechanism: "",
            exposure: "",
            note: ""
        };
    }

    saveFieldSurveyLog() {
        const { field_survey_id,
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
            <ScrollView style={field_survey_styles.container}>
                <View style={field_survey_styles.menuSection}>
                    <TextInput multiline={true}
                        numberOfLines={4} style={defaults.inputs} placeholder="Features" onChangeText={text => this.setState({ features: text })} />
                    <TextInput style={defaults.inputs} placeholder="Materials characterization" onChangeText={text => this.setState({ material_characterization: text })} />
                    <TextInput style={defaults.inputs} placeholder="Mechanism" onChangeText={text => this.setState({ mechanism: text })} />
                    <TextInput style={defaults.inputs} placeholder="Exposure" onChangeText={text => this.setState({ exposure: text })} />
                    <TextInput style={defaults.inputs} placeholder="Note" onChangeText={text => this.setState({ note: text })} />
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
