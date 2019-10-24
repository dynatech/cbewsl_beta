import moment from 'moment';
import React, { Component } from 'react';
import { Alert, Picker, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { defaults } from '../../../assets/styles/default_styles';
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles';
import Notification from '../../utils/alert_notification';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class RaiseMoms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datetime: "",
            alert_level: "",
            remarks: "",
            feature_name: "",
            feature_type: "",
            spinner: true
        };
    }

    componentDidMount() {
        Notification.endOfValidity();
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        console.log(data);
        if (data != "none") {
            this.setState({
                feature_name: data.name_of_feature,
                feature_type: data.type_of_feature
            });
        }
        this.setState({ spinner: false })
    }

    raiseMoms(){
        let datetime = this.state.datetime;
        let alert_level = this.state.alert_level;
        let feature_type = this.state.feature_type;
        let feature_name = this.state.feature_name;
        let remarks = this.state.remarks;
        let alert_validity = "";
        let int_sym = "";

        let current_date = moment(new Date()).format("YYYY-MM-DD H:mm:ss");
        let compare_date = moment(current_date).isSameOrAfter(datetime);
        if(compare_date == false){
            Alert.alert('Notice', 'Unable to add future date and time');
        }else{
            if(alert_level == ""){
                alert_level = 0;
            }
            if(datetime != "" && alert_level != "" && remarks != ""){
                if (alert_level == "2") {
                    int_sym = "m2"
                    alert_validity = moment(datetime).add(24, 'hours').format("YYYY-MM-DD HH:mm:00")
                } else if (alert_level == "3") {
                    int_sym = "m3"
                    alert_validity = moment(datetime).add(48, 'hours').format("YYYY-MM-DD HH:mm:00")
                } else {
                    int_sym = "m0"
                }
        
                let hour = moment(alert_validity).hours()
                if (hour >= 0 && hour < 4) {
                    alert_validity = moment(alert_validity).format("YYYY-MM-DD 04:00:00")
                } else if (hour >= 4 && hour < 8) {
                    alert_validity = moment(alert_validity).format("YYYY-MM-DD 08:00:00")
                } else if (hour >= 8 && hour < 12) {
                    alert_validity = moment(alert_validity).format("YYYY-MM-DD 12:00:00")
                } else if (hour >= 12 && hour < 16) {
                    alert_validity = moment(alert_validity).format("YYYY-MM-DD 16:00:00")
                } else if (hour >= 16 && hour < 20) {
                    alert_validity = moment(alert_validity).format("YYYY-MM-DD 20:00:00")
                } else if (hour >= 20) {
                    alert_validity = moment(alert_validity).format("YYYY-MM-DD 00:00:00")
                }
    
                let trigger_list = {
                    alert_level: alert_level,
                    alert_validity: alert_validity.toString(),
                    data_ts: datetime,
                    observance_ts: datetime,
                    user_id: 1,
                    trig_list: [
                        {
                            int_sym: int_sym,
                            remarks: this.state.remarks,
                            f_name: feature_type,
                            f_type: feature_name
                        }
                    ]
                }
                console.log(trigger_list)
                let url = 'http://192.168.1.10:5000/api/monitoring/insert_cbewsl_moms_ewi_web2';
                fetch(url, {
                    method: 'POST',
                    dataType: 'jsonp',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(trigger_list),
                }).then((responseJson) => {
                    Alert.alert('Success', 'Successfully raise moms!')
                    
                    if(int_sym == "m0"){
                        Notification.updateAlertGen();
                    }else{
                        Notification.updateAlertGen(true);
                    }
                    this.props.navigation.navigate('monitoring_logs');
                });
            }else{
                Alert.alert('Notice', 'Alert level and Observance timestamp are required!')
            }
        }
    }

    render() {
        return (
            <ScrollView style={surficial_data_styles.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Fetching data...'}
                    textStyle={spinner_styles.spinnerTextStyle}
                />
                <View style={surficial_data_styles.contentContainer}>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Manifestation of Movement</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ width: '100%', paddingLeft: '27%' }}>Observance Timestamp</Text>
                            <DatePicker
                                customStyles={{ dateInput: { borderWidth: 0 } }}
                                style={[{ width: '100%', paddingTop: '2%' }]}
                                format="YYYY-MM-DD HH:mm:ss"
                                date={this.state.datetime}
                                mode="datetime"
                                placeholder="Pick date and time"
                                duration={400}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                onDateChange={(date) => { this.setState({ datetime: date }) }}
                            />
                        </View>

                        <View style={{ width: '50%' }}>
                            <Text style={{ width: '100%', paddingLeft: '20%' }}>Select Alert Level</Text>
                            <Picker
                                selectedValue={this.state.alert_level}
                                style={{ width: '100%' }}
                                itemStyle={{ textAlign: 'center' }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ alert_level: itemValue })
                                }>
                                <Picker.Item label="Non-Significant" value="0" />
                                <Picker.Item label="Significant" value="2" />
                                <Picker.Item label="Critical" value="3" />
                            </Picker>
                        </View>
                    </View>
                    <TextInput style={defaults.inputs} placeholder="Remarks" value={this.state.remarks} onChangeText={text => this.setState({ remarks: text })} />
                </View>
                <View>
                    <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.raiseMoms()}>
                        <Text style={defaults.touchableTexts}>Raise</Text>
                    </TouchableOpacity>
                    
                </View>
            </ScrollView>
        );
    }
}
