import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { situation_report_styles } from '../../../assets/styles/situation_report_styles'
import { defaults } from '../../../assets/styles/default_styles'

export default class SaveSituationReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Text> textInComponent </Text>
            </View>
        );
    }
}
