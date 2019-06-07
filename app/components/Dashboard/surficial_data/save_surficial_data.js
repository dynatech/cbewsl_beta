import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Picker, Alert} from 'react-native';
import DatePicker from 'react-native-datepicker'
import { surficial_data_styles } from '../../../assets/styles/surficial_data_styles'
import { defaults } from '../../../assets/styles/default_styles'
import { Icon } from 'native-base'
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation'
import moment from "moment"

export default class SaveSurficialData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moms_id: 0,
            local_storage_id: 0,
            sync_status: 0,
            datetime: "",
            type_of_feature: "",
            description: "",
            name_of_feature: "",
            guidelines: [],
            isModelVisible: false
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        const data = navigation.getParam("data", "none");
        console.log(data)
        if (data != "none") {
            this.setState({
                moms_id: data.moms_id,
                local_storage_id: data.local_storage_id,
                sync_status: data.sync_status,
                datetime: data.date,
                type_of_feature: data.type_of_feature,
                description: data.description,
                name_of_feature: data.name_of_feature
            });
        } else {
            this.setState({
                moms_id: 0,
                local_storage_id: 0,
                sync_status: 0,
                datetime: "",
                type_of_feature: "",
                description: "",
                name_of_feature: ""
            });
        }
    }

    momsGuidelines() {
        console.log("TEST")
        let images_container = []
        let images = {}

        images_container.push(
            {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/0.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/1.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/2.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/3.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/4.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/5.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/6.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/7.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/8.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/9.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/10.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/11.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/12.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/13.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/14.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/15.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/16.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/17.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/18.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/19.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/20.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/21.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/22.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/23.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/24.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/25.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/26.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/27.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/28.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/29.jpg')
                }
            }, {
                props: {
                    source: require('../../../assets/images/MOMs_Booklet/30.jpg')
                }
            }
        )

        this.setState({ guidelines: images_container })
        this.ShowModalFunction()
    }

    saveSurficialData() {
        const { moms_id,
            local_storage_id,
            sync_status,
            datetime,
            type_of_feature,
            description,
            name_of_feature } = this.state

        if (datetime != "" && type_of_feature != "" && description != "" && name_of_feature != "") {
            fetch('http://192.168.150.191:5000/api/surficial_data/save_monitoring_log', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    moms_id: moms_id,
                    local_storage_id: 1,
                    sync_status: 3,
                    timestamp: datetime,
                    type_of_feature: type_of_feature,
                    description: description,
                    name_of_feature: name_of_feature
                }),
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    if (responseJson.status == true) {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                        let data_container = Storage.getItem('SurficialDataMomsSummary')
                        let updated_data = []
                        data = {
                            moms_id: moms_id,
                            local_storage_id: 1,
                            sync_status: 3,
                            type_of_feature: type_of_feature,
                            description: description,
                            name_of_feature: name_of_feature,
                            date: datetime
                        }
                        data_container.then(response => {
                            if (response == null) {
                                Storage.removeItem("SurficialDataMomsSummary")
                                Storage.setItem("SurficialDataMomsSummary", [data])
                            } else {
                                let temp = response
                                temp.push(data)
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        moms_id: value.moms_id,
                                        local_storage_id: counter,
                                        sync_status: 3,
                                        type_of_feature: value.type_of_feature,
                                        description: value.description,
                                        name_of_feature: value.name_of_feature,
                                        date: value.datetime
                                    })
                                });
                                Storage.removeItem("SurficialDataMomsSummary")
                                Storage.setItem("SurficialDataMomsSummary", updated_data)
                            }
                            this.props.navigation.navigate('monitoring_logs');
                        });
    
                    } else {
                        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    data = {
                        moms_id: moms_id,
                        local_storage_id: local_storage_id,
                        sync_status: 1,
                        type_of_feature: type_of_feature,
                        description: description,
                        name_of_feature: name_of_feature,
                        date: datetime
                    }
                    let offline_data = Storage.getItem("SurficialDataMomsSummary");
                    offline_data.then(response => {
                        if (local_storage_id == 0) {
                            data["local_storage_id"] = 1
                            if (response == null) {
                                Storage.removeItem("SurficialDataMomsSummary")
                                Storage.setItem("SurficialDataMomsSummary", [data])
                            } else {
                                let temp = response
                                temp.push(data)
                                let updated_data = []
                                let counter = 0
                                temp.forEach((value) => {
                                    counter += 1
                                    updated_data.push({
                                        moms_id: value.moms_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        type_of_feature: value.type_of_feature,
                                        description: value.description,
                                        name_of_feature: value.name_of_feature,
                                        date: value.datetime
                                    })
                                });
                                Storage.removeItem("SurficialDataMomsSummary")
                                Storage.setItem("SurficialDataMomsSummary", updated_data)
                            }
                        } else {
                            let temp = response
                            let updated_data = []
                            let counter = 0
                            temp.forEach((value) => {
                                counter += 1
                                if (local_storage_id == value.local_storage_id) {
                                    updated_data.push({
                                        moms_id: value.moms_id,
                                        local_storage_id: counter,
                                        sync_status: 2,
                                        type_of_feature: value.type_of_feature,
                                        description: value.description,
                                        name_of_feature: value.name_of_feature,
                                        date: value.datetime
                                    })
                                } else {
                                    updated_data.push({
                                        moms_id: value.moms_id,
                                        local_storage_id: counter,
                                        sync_status: value.sync_status,
                                        type_of_feature: value.type_of_feature,
                                        description: value.description,
                                        name_of_feature: value.name_of_feature,
                                        date: value.datetime
                                    })
                                }
                            });
                            Storage.removeItem("SurficialDataMomsSummary")
                            Storage.setItem("SurficialDataMomsSummary", updated_data)
                        }
                        this.props.navigation.navigate('monitoring_logs');
                    });
                    // 1 - adding |2 - modified |3 - old_data
                });
        } else {
            Alert.alert(
                'Manifestation of Movement',
                'All fields are required.',
                [
                  {
                    text: 'Close',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  }
                ],
                { cancelable: false },
              );
        }

    }

    ShowModalFunction() {
        this.setState({ isModelVisible: true })
    }

    HideModalFunction() {
        this.setState({ isModelVisible: false })
    }

    render() {
        return (
            <ScrollView style={surficial_data_styles.container}>
                <View style={surficial_data_styles.contentContainer}>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Measurements {<Text style={{ fontSize: 15, color: 'red' }}>(No available markers)</Text>}</Text>
                    </View>
                </View>
                <View style={surficial_data_styles.contentContainer}>
                    <DatePicker
                        customStyles={{ dateInput: { borderWidth: 0, } }}
                        disabled={true}
                        style={[defaults.inputs, { width: '95%', borderWidth: 0 }]}
                        date={this.state.time}
                        mode="datetime"
                        placeholder="Pick date and time (Not available)"
                        showIcon={false}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        onDateChange={(date) => { this.setState({ datetime: date }) }}
                    />
                    <TextInput editable={false} style={defaults.inputs} placeholder="Crack A (Not available)" value={this.state.crack_a} onChangeText={text => this.setState({ crack_a: text })} />
                    <TextInput editable={false} style={defaults.inputs} placeholder="Crack B (Not available)" value={this.state.crack_b} onChangeText={text => this.setState({ crack_b: text })} />
                    <TextInput editable={false} style={defaults.inputs} placeholder="Crack C (Not available)" value={this.state.crack_c} onChangeText={text => this.setState({ crack_c: text })} />
                </View>
                <View style={surficial_data_styles.contentContainer}>
                    <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Manifestation of Movement</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <DatePicker
                            customStyles={{ dateInput: { borderWidth: 0 } }}
                            style={[defaults.inputs, { width: '50%' }]}
                            format="YYYY-MM-DD HH:mm"
                            date={this.state.datetime}
                            value={this.state.datetime}
                            mode="datetime"
                            duration={400}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            onDateChange={(date) => { this.setState({ datetime: date }) }}
                        />
                        <View style={{ width: '50%' }}>
                            <Text style={{ width: '100%', paddingLeft: '20%' }}>Feature Type</Text>
                            <Picker
                                selectedValue={this.state.type_of_feature}
                                style={{ width: '100%' }}
                                itemStyle={{ textAlign: 'center' }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ type_of_feature: itemValue })
                                }>
                                <Picker.Item label="Scarp" value="Scarp" />
                                <Picker.Item label="Bitak" value="Bitak" />
                                <Picker.Item label="Seepage" value="Seepage" />
                                <Picker.Item label="Tilted/Split Trees" value="Tilted/Split Trees" />
                                <Picker.Item label="Ponding" value="Ponding" />
                                <Picker.Item label="Damaged Structures" value="Damaged Structures" />
                                <Picker.Item label="Slope Failure" value="Slope Failure" />
                                <Picker.Item label="Bulging/Depression" value="Bulging/Depression" />
                            </Picker>
                        </View>
                    </View>
                    <TextInput style={defaults.inputs} placeholder="Description" value={this.state.description} onChangeText={text => this.setState({ description: text })} />
                    <TextInput style={defaults.inputs} placeholder="Name of Feature (if applicable)" value={this.state.name_of_feature} onChangeText={text => this.setState({ name_of_feature: text })} />
                </View>
                <View>
                    <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.saveSurficialData()}>
                        <Text style={defaults.touchableTexts}>Confirm</Text>
                    </TouchableOpacity>
                    <View style={{ paddingTop: 5, paddingBottom: 5, width: '100%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: '#083451' }} onPress={() => this.momsGuidelines()}>
                            <Icon name="information-circle" style={{ fontSize: 15, color: '#083451' }}></Icon> Manifestation of Movement Guideliness
                        </Text>
                    </View>
                </View>

                <Modal visible={this.state.isModelVisible} transparent={true}>
                    <ImageViewer imageUrls={this.state.guidelines} enableSwipeDown={true} onSwipeDown={() => { this.HideModalFunction() }} />
                </Modal>

            </ScrollView>
        );
    }
}
