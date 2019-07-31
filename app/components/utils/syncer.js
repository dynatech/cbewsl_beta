import Storage from './storage';
import Network from './network_checker'
import { Alert, ToastAndroid } from 'react-native';

const Sync = {
    serverToClient: async function (keys) {

    },
    clientToServer: async function (storage_key) {
        const API_LIST = {
            "RiskAssessmentSummary": "http://192.168.150.10:5000/api/risk_assesment_summary/save_risk_assessment_summary",
            "RiskAssessmentFamilyRiskProfile": "http://192.168.150.10:5000/api/family_profile/save_family_profile",
            "RiskAssessmentHazardData": "http://192.168.150.10:5000/api/hazard_data/save_hazard_data",
            "RiskAssessmentRNC": "http://192.168.150.10:5000/api/resources_and_capacities/save_resources_and_capacities",
            "FieldSurveyLogs": "http://192.168.150.10:5000/api/field_survey/save_field_survey",
            "SurficialDataMeasurements": "6",
            "SurficialDataMomsSummary": "http://192.168.150.10:5000/api/surficial_data/save_monitoring_log",
            "SensorMaintenanceLogs": "http://192.168.150.10:5000/api/sensor_maintenance/save_sensor_maintenance_logs",
            "Pub&CandidAlert": "9"
        }
        let url = API_LIST[storage_key];
        let data = Storage.getItem(storage_key);
        const ms = Network.getPing();

        ms.then(response => {
            console.log(response)
            if (response.status == "In-active") {
                Alert.alert('Notice', response.msg);
            } else {
                Alert.alert('Active', response.msg);
                // data.then(local_data => {
                //     if (local_data != null || local_data != undefined) {
                //         local_data.forEach((value) => {
                //             if (value.sync_status == 1 || value.sync_status == 2) {
                //                 fetch(url, {
                //                     method: 'POST',
                //                     headers: {
                //                         Accept: 'application/json',
                //                         'Content-Type': 'application/json',
                //                     },
                //                     body: JSON.stringify({ value }),
                //                 }).then((response) => response.json())
                //                     .then((responseJson) => {
                //                         ToastAndroid.show("Syncing...", ToastAndroid.SHORT);
                //                     })
                //                     .catch((error) => {
                //                         ToastAndroid.show("No network detected, Unable to network sync..", ToastAndroid.SHORT);
                //                     });
                //             } else {
                //                 ToastAndroid.show("Syncing...", ToastAndroid.SHORT);
                //             }
                //         });
                //     } else {
                //         Alert.alert('Data Syncing', 'No new data to sync.');
                //     }
                // });
            }
        });
    },
    overrideServer: async function (keys) {

    },
    overrideClient: async function (keys) {

    },
    updateStorage: async function (key) {
        let stored_data = Storage.getItem(key)
        let updated_data = []
        stored_data.then(response => {
            response.forEach(value => {
                value.sync_status = 3
                updated_data.push(value)
            });
            Storage.setItem(key, updated_data)
        })
    }
};

export default Sync;
