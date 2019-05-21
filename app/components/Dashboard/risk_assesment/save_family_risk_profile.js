import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { rassessment_styles } from '../../../assets/styles/risk_assessment_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'

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

    componentWillMount() {
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        if (data != "none") {
            this.setState({
                family_profile_id: data.family_profile_id.toString(),
                members_count: data.members_count.toString(),
                vulnerable_members_count: data.vulnerable_members_count.toString(),
                vulnerability_nature: data.vulnerability_nature
            });
        } else {
            this.setState({
                family_profile_id: 0,
                members_count: "",
                vulnerable_members_count: "",
                vulnerability_nature: ""
            });
        }
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
            .catch((error) => {
                let offline_data = Storage.getItem('RiskAssessmentFamilyRiskProfile')
                offline_data.then(response => {
                    // modify offline Data
                    Storage.removeItem("RiskAssessmentFamilyRiskProfile")
                    // response = NEWDATA
                    Storage.setItem("RiskAssessmentFamilyRiskProfile", response)
                })
            }).then((responseJson) => {
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
                    <TextInput style={defaults.inputs} placeholder="Number of Members: E.g. 5" value={this.state.members_count} onChangeText={text => this.setState({ members_count: text })} />
                    <TextInput style={defaults.inputs} placeholder="Vulnerable groups: E.g. 2" value={this.state.vulnerable_members_count} onChangeText={text => this.setState({ vulnerable_members_count: text })} />
                    <TextInput style={defaults.inputs} placeholder="Nature of vulnerability: E.g. Children" value={this.state.vulnerability_nature} onChangeText={text => this.setState({ vulnerability_nature: text })} />
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
