import moment from 'moment';
import { Alert } from 'react-native';
import Storage from './storage';

const Notification = {
    endOfValidity: async function () {
        let current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
        let offline_data = Storage.getItem("AlertGeneration");
        offline_data.then(response => {

            if (response == null || response == undefined) {
                fetch('http://192.168.150.10:5000/api/monitoring/get_latest_cbewls_release/50').then((response) => response.json())
                .then((responseJson) => {
                    let set_offline_data =  Storage.setItem("AlertGeneration", responseJson)
                    if (moment(current_timestamp) >= moment(responseJson.alert_validity)) {
                        let alert_title = ""
                        switch (responseJson.alert_level) {
                            case "2":
                                alert_title = "Alert 2"
                                break;
                            case "3":
                                alert_title = "Alert 3"
                                break;
                            case "1":
                                alert_title = "Alert 1"
                                break;
                        }
                        Alert.alrt(
                            alert_title,
                            'Current alert is now end of validity',
                            [
                                {
                                    text: 'OK', onPress: () => {
                                        Storage.removeItem("AlertGeneration");
                                    }
                                },
                            ]
                        );
                    } 
                }).catch((error) => {
                    console.log("No alerts")
                    return
                });
            } else {
                if (moment(current_timestamp) >= moment(response.alert_validity)) {
                    let alert_title = ""
                    switch (response.alert_level) {
                        case "2":
                            alert_title = "Alert 2"
                            break;
                        case "3":
                            alert_title = "Alert 3"
                            break;
                        case "1":
                            alert_title = "Alert 1"
                            break;
                    }
                    Alert.alrt(
                        alert_title,
                        'Current alert is now end of validity',
                        [
                            {
                                text: 'OK', onPress: () => {
                                    Storage.removeItem("AlertGeneration");
                                }
                            },
                        ]
                    );
                } 
            }
        })
    }
};

export default Notification;