import moment from 'moment';
import { Alert } from 'react-native';
import Storage from './storage';

const Notification = {
    endOfValidity: async function () {
        let current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
        let offline_data = Storage.getItem("Pub&CandidAlert");
        this.fetchCandidateAlert()
        offline_data.then(response => {
            if (response == null || response == undefined) {
                // fetch('http://192.168.150.10:5000/api/monitoring/get_latest_cbewls_release/50').then((response) => response.json())
                //     .then((responseJson) => {
                //         console.log(responseJson)
                //         let set_offline_data = Storage.setItem("Pub&CandidAlert", responseJson)
                //         if (moment(current_timestamp) >= moment(responseJson.alert_validity)) {
                //             let alert_title = ""
                //             switch (responseJson.alert_level) {
                //                 case "2":
                //                     alert_title = "Alert 2"
                //                     break;
                //                 case "3":
                //                     alert_title = "Alert 3"
                //                     break;
                //                 case "1":
                //                     alert_title = "Alert 1"
                //                     break;
                //             }
                //             Alert.alrt(
                //                 alert_title,
                //                 'Current alert is now end of validity',
                //                 [
                //                     {
                //                         text: 'OK', onPress: () => {
                //                             Storage.removeItem("Pub&CandidAlert");
                //                         }
                //                     },
                //                 ]
                //             );
                //         }
                //     }).catch((error) => {
                //         this.fetchCandidateAlert()
                //         return
                //     });
            } else {

                let candidate_alerts = JSON.parse(response.candidate_alerts);
                let current_alerts = response.current_alerts;

                // if () {

                // } else {

                // }

                // if (moment(current_timestamp) >= moment(response.alert_validity)) {
                //     let alert_title = ""
                //     switch (response.alert_level) {
                //         case "2":
                //             alert_title = "Alert 2"
                //             break;
                //         case "3":
                //             alert_title = "Alert 3"
                //             break;
                //         case "1":
                //             alert_title = "Alert 1"
                //             break;
                //     }
                //     Alert.alrt(
                //         alert_title,
                //         'Current alert is now end of validity',
                //         [
                //             {
                //                 text: 'OK', onPress: () => {
                //                     Storage.removeItem("Pub&CandidAlert");
                //                 }
                //             },
                //         ]
                //     );
                // }
            }
        })
    },
    fetchCandidateAlert: async function () {
        this.updateAlertGen()
        let offline_data = Storage.getItem("Pub&CandidAlert");
        offline_data.then(offline_response => {
            if (offline_response != null || offline_response != undefined) {
                fetch('http://192.168.150.10:5000/api/monitoring/get_candidate_and_current_alerts').then((response) => response.json())
                    .then((online_data) => {
                        if (JSON.stringify(online_data) != JSON.stringify(offline_response)) {
                            Alert.alert(
                                'Notification',
                                'New data generated for Public and Candidate Alerts.\nPlease refer to the EWI Menu.'
                            );
                            Storage.setItem("Pub&CandidAlert", online_data)
                            return online_data
                        }
                    }).catch((error) => {
                        console.log("Network error. offline data will be used...")
                        return
                    });
            } else {
                fetch('http://192.168.150.10:5000/api/monitoring/get_candidate_and_current_alerts').then((response) => response.json())
                    .then((online_data) => {
                        Alert.alert(
                            'Notification',
                            'New data generated for Public and Candidate Alerts.\n\nPlease refer to the EWI Menu.'
                        );
                        Storage.setItem("Pub&CandidAlert", online_data)
                    }).catch((error) => {
                        console.log("Network error. offline data will be used...")
                        return
                    })
            }
        });
    },
    validateAlert: async function (trigger_id, valid, remarks, user_id, candidate_alerts, flag = false) {
        fetch('http://192.168.150.10:5000/api/monitoring/update_alert_status', {
            method: 'POST',
            dataType: 'jsonp',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "trigger_id": trigger_id,
                "alert_status": valid,
                "remarks": remarks,
                "user_id": user_id,
            }),
        }).then((response) => {
            // this.formatCandidateAlerts(candidate_alerts);
            if (valid == 1) {
                Alert.alert('Info', 'Alert Validated');
            } else {
                Alert.alert('Info', 'Alert Invalidated');
            }
            return this.updateAlertGen();
        }).catch((error) => {
            // console.log(error)
        });
    }, formatCandidateAlerts: async function (candidate_alerts) {
        let url = 'http://192.168.150.10:5000/api/monitoring/format_candidate_alerts_for_insert'
        fetch(url, {
            method: 'POST',
            dataType: 'jsonp',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(candidate_alerts),
        }).then((response) => response.json()).then((responseJson) => {
            let release_data = responseJson;
            this.releaseAlert(release_data)
        });
    }, releaseAlert: async function (release_data) {
        let url = 'http://192.168.150.10:5000/api/monitoring/insert_ewi';
        fetch(url, {
            method: 'POST',
            dataType: 'jsonp',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(release_data),
        }).then((response) => {
            Alert.alert('Success', 'Successfully Released!');
            this.updateAlertGen();
        });
    }, updateAlertGen: async function () {
        fetch('http://192.168.150.10:5000/api/monitoring/update_alert_gen/false').then((response) => response.json())
            .then((online_data) => {
                console.log("Updating alert gen...")
                if (online_data.status == true) {
                    // this.fetchCandidateAlert()
                }
            }).catch((error) => {
                console.log("Network error. offline data will be used...")
                return
            });
    }


};

export default Notification;