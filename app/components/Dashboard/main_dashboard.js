import { Icon } from 'native-base';
import React, { Component } from 'react';
import { Image, Linking, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Badge } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { dashboard } from '../../assets/styles/dashboard_styles';
import { defaults } from '../../assets/styles/default_styles';
import Storage from '../utils/storage';
import Sync from '../utils/syncer';
import Notification from '../utils/alert_notification';
import { spinner_styles } from '../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class MainDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert_badge: [],
            spinner: true,
            role_id: 0
        };
    }

    componentDidMount() {
        let credentials = Storage.getItem("loginCredentials")
        credentials.then(response => {
            console.log("CRED")
            console.log(response)
            let role_id = response.role_id;
            this.setState({ role_id: role_id })
        });
    }

    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="home" style={{ fontSize: 24, color: tintColor }}></Icon>
        )
    };

    navigateMenu(menu) {
        role_id = this.state.role_id;
        switch (menu) {
            case 'risk_assessment':
                this.props.navigation.navigate('riskAssessment');
                break;
            case 'field_survey':
                if (role_id == 1) {
                    Alert.alert('Access denied', 'Unable to access this feature.');
                } else {
                    this.props.navigation.navigate('fieldSurvey');
                }
                break;
            case 'sensor_maintenance':
                if (role_id == 1) {
                    Alert.alert('Access denied', 'Unable to access this feature.');
                } else {
                    this.props.navigation.navigate('sensorMaintenance');
                }
                break;
            case 'surficial_data':
                if (role_id == 1) {
                    Alert.alert('Access denied', 'Unable to access this feature.');
                } else {
                    this.props.navigation.navigate('surficialData');
                }
                break;
            case 'ewi':
                if (role_id == 1) {
                    Alert.alert('Access denied', 'Unable to access this feature.');
                } else {
                    this.props.navigation.navigate('ewi');
                }
                break;
            case 'reports':
                if (role_id == 1) {
                    Alert.alert('Access denied', 'Unable to access this feature.');
                } else {
                    this.props.navigation.navigate('reports');
                }
                break;
            case 'call':
                Linking.openURL('tel:')
                break;
            case 'sms':
                Linking.openURL(`sms:?addresses=null&body=`);
                break;
            case 'situation_report':
                if (role_id == 1) {
                    Alert.alert('Access denied', 'Unable to access this feature.');
                } else {
                    this.props.navigation.navigate('situationReport')
                }
                break;
            default:
                console.info("Invalid menu... skipping...")
                break;
        }
    }

    initializeApp() {
        Storage.removeItem("initializeApp");
        let offline_data = Storage.getItem("initializeApp");
        offline_data.then(response => {
            if (response == null || response == undefined) {
                let init = Sync.serverToClient()
                init.then(init_response => {
                    if (init_response.status == true) {
                        Storage.setItem("initializeApp", "1")
                        this.setState({ spinner: false })
                    }
                });
            } else {
                this.setState({ spinner: false })
            }
        })
    }

    setBadge() {
        let offline_data = Storage.getItem("Pub&CandidAlert");
        offline_data.then(response => {
            let candidate_alerts = JSON.parse(response.candidate_alert);
            let current_alerts = response.leo;
            let top_position = -10;
            let temp = []
            let alert_level = ""

            if (candidate_alerts.length != 0) {
                temp.push(<Badge
                    status="warning"
                    containerStyle={{ position: 'absolute', top: top_position, left: -10 }}
                    value={
                        <Text style={{ color: 'white', padding: 10, fontSize: 10 }}>
                            <Icon name="ios-warning" style={{ fontSize: 15, color: 'white' }}></Icon> New trigger(s)
                            </Text>
                    }
                />)
                top_position = top_position - 20;
            }

            if (current_alerts.latest.length != 0) {

                switch (current_alerts.latest[0].public_alert_symbol.alert_level) {
                    case 1:
                        alert_level = "Alert 1"
                        break;
                    case 2:
                        alert_level = "Alert 2"
                        break;
                    case 3:
                        alert_level = "Alert 3"
                        break;
                    default:
                        alert_level = "Alert 0"
                        break;
                }

                if (alert_level == "Alert 0") {
                    temp.push(<Badge
                        status="success"
                        containerStyle={{ position: 'absolute', top: top_position, left: -10 }}
                        value={
                            <Text style={{ color: 'white', padding: 10, fontSize: 10 }}>
                                {alert_level}
                            </Text>
                        }
                    />)
                } else {
                    temp.push(<Badge
                        status="error"
                        containerStyle={{ position: 'absolute', top: top_position, left: -10 }}
                        value={
                            <Text style={{ color: 'white', padding: 10, fontSize: 10 }}>
                                {alert_level}
                            </Text>
                        }
                    />)
                }

            }

            if (current_alerts.overdue.length != 0) {
                temp.push(<Badge
                    status="warning"
                    containerStyle={{ position: 'absolute', top: top_position, left: -10 }}
                    value={
                        <Text style={{ color: 'white', padding: 10, fontSize: 10 }}>
                            <Icon name="ios-warning" style={{ fontSize: 15, color: 'white' }}></Icon> Alert overdue
                            </Text>
                    }
                />)
                top_position = top_position - 20;
            }

            if (current_alerts.extended.length != 0) {
                temp.push(<Badge
                    status="success"
                    containerStyle={{ position: 'absolute', top: top_position, left: -10 }}
                    value={
                        <Text style={{ color: 'white', padding: 10, fontSize: 10 }}>
                            <Icon name="ios-warning" style={{ fontSize: 15, color: 'white' }}></Icon> Extended Monitoring
                            </Text>
                    }
                />)
                top_position = top_position - 20;
            }

            this.setState({ alert_badge: temp })
        })
    }

    render() {
        return (
            <View style={[dashboard.menuContainer]}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Fetching initial data...'}
                    textStyle={spinner_styles.spinnerTextStyle}
                />

                <NavigationEvents onDidFocus={() => {
                    this.initializeApp()
                    Notification.endOfValidity()
                    this.setBadge()
                }} />
                <View style={[defaults.heading, this.props.style]}>
                    <Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />
                    <View style={dashboard.menulogo}>
                        <Image style={dashboard.logo} source={require('../../assets/images/mdrrmo_logo.png')}></Image>
                        <Image style={dashboard.logo} source={require('../../assets/images/dost-phivolcs-logo.png')}></Image>
                        <Image style={dashboard.logo} source={require('../../assets/images/dews-l-logo.png')}></Image>
                    </View>
                    <View style={dashboard.title}>
                        <Text style={dashboard.titleText}>Early Warning System for Deep-seated Landslides</Text>
                    </View>
                </View>
                <View style={[dashboard.menu]}>
                    <View style={dashboard.rowMenu}>
                        <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("risk_assessment")}>
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/cra.png')} />
                            <Text style={dashboard.menuTexts}>Risk Assessment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("field_survey")}>
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/field_survey.png')} />
                            <Text style={dashboard.menuTexts}>Field Survey</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("situation_report")}>
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/situation_report.png')} />
                            <Text style={dashboard.menuTexts}>Situation Report</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={dashboard.rowMenu}>
                        <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("sensor_maintenance")}>
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/sensor_maintenance.png')} />
                            <Text style={dashboard.menuTexts}> Sensor Maintenance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("surficial_data")}>
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/surficial.png')} />
                            <Text style={dashboard.menuTexts}>Surficial Data</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("ewi")}>
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/ewi.png')} />
                            <Text style={dashboard.menuTexts}>EWI</Text>
                            {this.state.alert_badge}
                        </TouchableOpacity>
                    </View>
                    <View style={dashboard.rowMenu}>
                        <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("reports")}>
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/reports.png')} />
                            <Text style={dashboard.menuTexts}>Reports</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("call")}>
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/call.png')} />
                            <Text style={dashboard.menuTexts}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={dashboard.menuButtons} onPress={() => this.navigateMenu("sms")}>
                            <Image style={dashboard.menuIcons} source={require('../../assets/images/messaging.png')} />
                            <Text style={dashboard.menuTexts}>SMS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
