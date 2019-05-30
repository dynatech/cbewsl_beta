import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { situation_report_styles } from '../../../assets/styles/situation_report_styles'
import { defaults } from '../../../assets/styles/default_styles'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation'
import moment from "moment"

export default class SaveSituationReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            situation_report_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            summary: "",
            pdf_path: "",
            image_path: ""
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        if (data != "none") {
            this.setState({
                situation_report_id: data.situation_report_id,
                local_storage_id: data.local_storage_id,
                sync_status: data.sync_status,
                summary: data.summary,
                pdf_path: data.pdf_path,
                image_path: data.image_path
            });
        } else {
            this.setState({
                situation_report_id: 0,
                local_storage_id: 0,
                sync_status: 0,
                summary: "",
                pdf_path: "",
                image_path: ""
            });
        }
    }

    saveSituationReport() {
        const { situation_report_id,
            local_storage_id,
            sync_status,
            summary,
            pdf_path,
            image_path } = this.state
        fetch('http://192.168.150.191:5000/api/situation_report/save_situation_report', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                situation_report_id: situation_report_id,
                local_storage_id: local_storage_id,
                sync_status: sync_status,
                summary: summary,
                pdf_path: pdf_path,
                image_path: image_path
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {
        return (
            <ScrollView style={situation_report_styles.container}>
                <View style={situation_report_styles.menuSection}>
                    <TextInput multiline={true}
                        numberOfLines={10} style={defaults.inputs} placeholder="Summary" value={this.state.summary} onChangeText={text => this.setState({ summary: text })} />

                </View>
                <View>
                    <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.saveSituationReport()}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
