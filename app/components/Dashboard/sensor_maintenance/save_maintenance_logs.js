import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { sensor_maintenance_styles } from '../../../assets/styles/sensor_maintenance_styles'
import { defaults } from '../../../assets/styles/default_styles'

export default class SaveMaintenanceLogs extends Component {
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
