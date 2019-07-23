import moment from 'moment';
import { Alert } from 'react-native';
import Storage from './storage';

const Notification = {
    endOfValidity: async function () {
        let current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
        let offline_data = Storage.getItem("Pub&CandidAlert");
        offline_data.then(response => {
            console.log(response)
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
    fetchCandidateAlert: async function() {
        console.log("Fetching candidate alert...")
        let offline_data = Storage.getItem("Pub&CandidAlert");
        offline_data.then(offline_response => {
            if (offline_response != null || offline_response != undefined) {
                fetch('http://192.168.150.10:5000/api/monitoring/get_candidate_and_public_alert').then((response) => response.json())
                .then((online_data) => {
                    if (online_data != offline_data) {
                        Alert.alert(
                            'Landslide Alert',
                            'New data generated for Public and Candidate Alerts.\nPlease refer to the EWI Menu.'
                          );
                        Storage.setItem("Pub&CandidAlert", online_data)
                    }
                }).catch((error) => {
                    console.log("Network error. offline data will be used...")
                    return
                });
            } else {
                fetch('http://192.168.150.10:5000/api/monitoring/get_candidate_and_public_alert').then((response) => response.json())
                .then((online_data) => {
                    Alert.alert(
                        'Landslide Alert',
                        'New data generated for Public and Candidate Alerts.\n\nPlease refer to the EWI Menu.'
                        );
                    Storage.setItem("Pub&CandidAlert", online_data)
                }).catch((error) => {
                    console.log("Network error. offline data will be used...")
                    return  
                })
            }
        });
    }
};

export default Notification;