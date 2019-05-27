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
            local_storage_id: 0,
            sync_status: 0,
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
                local_storage_id: data.local_storage_id,
                sync_status: data.sync_status,
                members_count: data.members_count.toString(),
                vulnerable_members_count: data.vulnerable_members_count.toString(),
                vulnerability_nature: data.vulnerability_nature
            });
        } else {
            this.setState({
                family_profile_id: 0,
                local_storage_id: 0,
                sync_status: 0,
                members_count: "",
                vulnerable_members_count: "",
                vulnerability_nature: ""
            });
        }
    }

    saveFamilyRiskProfile() {
        const { family_profile_id,
            local_storage_id,
            sync_status,
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
                local_storage_id: local_storage_id,
                sync_status: sync_status,
                members_count: members_count,
                vulnerable_members_count: vulnerable_members_count,
                vulnerability_nature: vulnerability_nature
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                    let data_container = Storage.getItem('RiskAssessmentFamilyRiskProfile')
                    let updated_data = []
                    data = {
                        family_profile_id: family_profile_id,
                        local_storage_id: 1,
                        sync_status: 3,
                        members_count: members_count,
                        vulnerable_members_count: vulnerable_members_count,
                        vulnerability_nature: vulnerability_nature
                    }
                    data_container.then(response => {
                        if (response == null) {
                            Storage.removeItem("RiskAssessmentFamilyRiskProfile")
                            Storage.setItem("RiskAssessmentFamilyRiskProfile", [data])
                        } else {
                            let temp = response
                            temp.push(data)
                            let counter = 0
                            temp.forEach((value) => {
                                counter += 1
                                updated_data.push({
                                    family_profile_id: value.family_profile_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    members_count: value.members_count,
                                    vulnerable_members_count: value.vulnerable_members_count,
                                    vulnerability_nature: value.vulnerability_nature
                                })
                            });
                            Storage.removeItem("RiskAssessmentFamilyRiskProfile")
                            Storage.setItem("RiskAssessmentFamilyRiskProfile", updated_data)
                        }
                    });

                    this.props.navigation.navigate('modify_family_risk');
                } else {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                data = {
                    family_profile_id: family_profile_id,
                    local_storage_id: local_storage_id,
                    sync_status: 1,
                    members_count: members_count,
                    vulnerable_members_count: vulnerable_members_count,
                    vulnerability_nature: vulnerability_nature
                }
                let offline_data = Storage.getItem("RiskAssessmentFamilyRiskProfile");
                offline_data.then(response => {
                    if (local_storage_id == 0) {
                        if (response == null) {
                            Storage.removeItem("RiskAssessmentFamilyRiskProfile")
                            Storage.setItem("RiskAssessmentFamilyRiskProfile", [data])
                        } else {
                            let temp = response
                            temp.push(data)
                            let updated_data = []
                            let counter = 0
                            temp.forEach((value) => {
                                counter += 1
                                updated_data.push({
                                    family_profile_id: value.family_profile_id,
                                    local_storage_id: counter,
                                    sync_status: value.sync_status,
                                    members_count: value.members_count,
                                    vulnerable_members_count: value.vulnerable_members_count,
                                    vulnerability_nature: value.vulnerability_nature
                                })
                            });
                            Storage.removeItem("RiskAssessmentFamilyRiskProfile")
                            Storage.setItem("RiskAssessmentFamilyRiskProfile", updated_data)
                        }
                    } else {
                        let temp = response
                        let updated_data = []
                        let counter = 0
                        temp.forEach((value) => {
                            counter += 1
                            if (local_storage_id == value.local_storage_id) {
                                updated_data.push({
                                    family_profile_id: family_profile_id,
                                    local_storage_id: counter,
                                    sync_status: 2,
                                    members_count: members_count,
                                    vulnerable_members_count: vulnerable_members_count,
                                    vulnerability_nature: vulnerability_nature
                                })
                            } else {
                                updated_data.push({
                                    family_profile_id: value.family_profile_id,
                                    local_storage_id: counter,
                                    sync_status: value.sync_status,
                                    members_count: value.members_count,
                                    vulnerable_members_count: value.vulnerable_members_count,
                                    vulnerability_nature: value.vulnerability_nature
                                })
                            }
                        });
                        Storage.removeItem("RiskAssessmentFamilyRiskProfile")
                        Storage.setItem("RiskAssessmentFamilyRiskProfile", updated_data)
                    }

                })
                this.props.navigation.navigate('modify_family_risk');
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
