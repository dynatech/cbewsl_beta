import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'

export default class SaveFamilyRiskProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            family_profile_id: 0,
            members_count: "",
            vulnerable_members_count: "",
            vulnerability_nature: ""
        };
    }

    saveFamilyRiskProfile() {
        const { family_profile_id,
            members_count,
            vulnerable_members_count,
            vulnerability_nature } = this.state

        fetch('http://192.168.150.191:5000/api/family_profile/save_family_profile', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                family_profile_id: family_profile_id,
                members_count: members_count,
                vulnerable_members_count: vulnerable_members_count,
                vulnerability_nature: vulnerability_nature
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    this.props.navigation.navigate('modify_family_risk');
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
                    <TextInput style={defaults.inputs} placeholder="Number of Members: E.g. 5" onChangeText={text => this.setState({ members_count: text })} />
                    <TextInput style={defaults.inputs} placeholder="Vulnerable groups: E.g. 2" onChangeText={text => this.setState({ vulnerable_members_count: text })} />
                    <TextInput style={defaults.inputs} placeholder="nature of vulnerability: E.g. Children" onChangeText={text => this.setState({ vulnerability_nature: text })} />
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.saveFamilyRiskProfile()} style={defaults.touchableButtons}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
