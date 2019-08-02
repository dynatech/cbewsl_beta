import Storage from './storage';
import Network from './network_checker'
import { Alert, ToastAndroid } from 'react-native';

const Sync = {
    serverToClient: async function (storage_key = "") {
        const DOCROOT = 'http://192.168.150.10:5000'
        let KEYS_N_API = [
            { 'Pub&CandidAlert': DOCROOT + '/api/monitoring/get_candidate_and_current_alerts' },
            { 'FieldSurveyLogs': DOCROOT + '/api/field_survey/get_all_field_survey' },
            { 'FieldSurveyLatestReportSummary': DOCROOT + '/api/field_survey/get_latest_field_survey_data' },
            { 'RiskAssessmentFamilyRiskProfile': DOCROOT + '/api/family_profile/get_all_family_profile' },
            { 'RiskAssessmentHazardData': DOCROOT + '/api/hazard_data/get_all_hazard_data' },
            { 'RiskAssessmentRNC': DOCROOT + '/api/resources_and_capacities/get_all_resources_and_capacities' },
            { 'RiskAssessmentSummary': DOCROOT + '/api/risk_assesment_summary/get_all_risk_assessment_summary' },
            { 'SensorMaintenanceLogs': DOCROOT + '/api/sensor_maintenance/get_all_sensor_maintenance' },
            { 'RainfallSummary': DOCROOT + '/api/rainfall/get_rainfall_plot_data' },
            { 'SituationReportLatest': DOCROOT + '/api/situation_report/get_latest_situation_report_data' },
            { 'SituationReportLogs': DOCROOT + '/api/situation_report/get_all_situation_report' },
            { 'SurficialDataCurrentMeasurement': DOCROOT + '/api/surficial_data/get_current_measurement' },
            { 'SurficialDataMomsSummary': DOCROOT + '/api/surficial_data/get_moms_data' },
            { 'SurficialDataSummary': DOCROOT + '/api/surficial_data/get_surficial_data' }
        ];
        let COUNTER = 0;
        let ret_val = {}
        // let to_local_data = []
        if (storage_key != "") {
            let temp = []
            KEYS_N_API.forEach(response => {
                if (storage_key == Object.keys(response)[0]) {
                    temp_key = {
                        storage_key: response[storage_key]
                    }
                    temp.push(temp_key);
                }
            })
            KEYS_N_API = temp;
        }

        KEYS_N_API.forEach(response => {
            let url = response[Object.keys(response)[0]];
            let key = Object.keys(response)[0];
            fetch(url).then((response) => response.json())
                .then((responseJson) => {
                    let to_local_data = [];
                    let counter = 0;
                    switch (key) {
                        case "FieldSurveyLogs":
                            for (const [index, value] of responseJson.entries()) {
                                counter += 1;
                                to_local_data.push({
                                    field_survey_id: value.field_survey_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    mat_characterization: value.mat_characterization,
                                    mechanism: value.mechanism,
                                    exposure: value.exposure,
                                    note: value.note,
                                    date: value.date,
                                });
                            }
                            Storage.setItem(key, to_local_data)
                            break;
                        case "FieldSurveyLatestReportSummary":
                            for (const [index, value] of responseJson.entries()) {
                                counter += 1;
                                to_local_data.push({
                                    field_survey_id: value.field_survey_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    features: value.features,
                                    mat_characterization: value.mat_characterization,
                                    mechanism: value.mechanism,
                                    exposure: value.exposure,
                                    note: value.note,
                                    date: value.date
                                });
                            }
                            Storage.setItem(key, to_local_data)
                            break;
                        case "RiskAssessmentFamilyRiskProfile":
                            for (const [index, value] of responseJson.entries()) {
                                counter += 1;
                                to_local_data.push({
                                    family_profile_id: value.family_profile_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    members_count: value.members_count,
                                    vulnerable_members_count: value.vulnerable_members_count,
                                    vulnerability_nature: value.vulnerability_nature
                                })
                            }
                            Storage.setItem(key, to_local_data)
                            break;
                        case "RiskAssessmentHazardData":
                            for (const [index, value] of responseJson.entries()) {
                                counter += 1;
                                to_local_data.push({
                                    hazard_data_id: value.hazard_data_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    hazard: value.hazard,
                                    speed_of_onset: value.speed_of_onset,
                                    early_warning: value.early_warning,
                                    impact: value.impact
                                });
                            }
                            Storage.setItem(key, to_local_data);
                            break;
                        case "RiskAssessmentRNC":
                            for (const [index, value] of responseJson.entries()) {
                                counter += 1;
                                to_local_data.push({
                                    resources_and_capacities_id: value.resources_and_capacities_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    resource_and_capacity: value.resource_and_capacity,
                                    status: value.status,
                                    owner: value.owner
                                })
                            }
                            Storage.setItem(key, to_local_data)
                            break;
                        case "RiskAssessmentSummary":
                            for (const [index, value] of responseJson.entries()) {
                                counter += 1;
                                to_local_data.push({
                                    summary_id: value.summary_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    location: value.location,
                                    impact: value.impact,
                                    adaptive_capacity: value.adaptive_capacity,
                                    vulnerability: value.vulnerability
                                });
                            }
                            Storage.setItem(key, to_local_data)
                            break;
                        case "SensorMaintenanceLogs":
                            for (const [index, value] of responseJson.entries()) {
                                counter += 1;
                                to_local_data.push({
                                    sensor_maintenance_id: value.sensor_maintenance_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    working_nodes: value.working_nodes,
                                    anomalous_nodes: value.anomalous_nodes,
                                    rain_gauge_status: value.rain_gauge_status,
                                    timestamp: value.timestamp,
                                });
                            }
                            Storage.setItem(key, to_local_data)
                            break;
                        case "SituationReportLatest":
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    situation_report_id: value.situation_report_id,
                                    local_storage_id: 1,
                                    sync_status: 3,
                                    timestamp: value.timestamp,
                                    summary: value.summary,
                                    pdf_path: value.pdf_path,
                                    image_path: value.image_path
                                });
                            }
                            Storage.setItem(key, to_local_data)
                            break;
                        case "SituationReportLogs":
                            for (const [index, value] of responseJson.entries()) {
                                counter += 1;
                                to_local_data.push({
                                    situation_report_id: value.situation_report_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    timestamp: value.timestamp,
                                    summary: value.summary,
                                    pdf_path: value.pdf_path,
                                    image_path: value.image_path
                                });
                            }
                            Storage.setItem(key, to_local_data)
                            break;
                        case "SurficialDataMomsSummary":
                            for (const [index, value] of responseJson.entries()) {
                                counter += 1;
                                to_local_data.push({
                                    moms_id: value.moms_id,
                                    local_storage_id: counter,
                                    sync_status: 3,
                                    type_of_feature: value.type_of_feature,
                                    description: value.description,
                                    name_of_feature: value.name_of_feature,
                                    date: value.date
                                })
                            }
                            Storage.setItem(key, to_local_data)
                            break;
                        case "SurficialDataSummary":
                            Storage.setItem(key, responseJson[0].surficial_data)
                            break;
                        default:
                            Storage.setItem(key, responseJson)
                    }
                }).catch((error) => {
                    return ret_val = { "status": false }
                });

            COUNTER++;
        });
        if (COUNTER < KEYS_N_API.length - 1) {
            ret_val = { "status": false }
        } else {
            ret_val = { "status": true }
        }
        return ret_val
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
            "Pub&CandidAlert": "9",
            "SituationReportLogs": "http://192.168.150.10:5000/api/situation_report/save_situation_report"
        }
        let url = API_LIST[storage_key];
        let data = Storage.getItem(storage_key);
        const ms = Network.getPing();

        ms.then(response => {
            console.log(response)
            if (response.status == "In-active") {
                Alert.alert('Notice', response.msg);
            } else {
                data.then(local_data => {
                    if (local_data != null || local_data != undefined) {
                        local_data.forEach((value) => {
                            if (value.sync_status == 1 || value.sync_status == 2) {
                                fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ value }),
                                }).then((response) => response.json())
                                    .then((responseJson) => {
                                        ToastAndroid.show("Syncing...", ToastAndroid.SHORT);
                                    })
                                    .catch((error) => {
                                        ToastAndroid.show("No network detected, Unable to network sync..", ToastAndroid.SHORT);
                                    });
                            } else {
                                ToastAndroid.show("Syncing...", ToastAndroid.SHORT);
                            }
                        });
                    } else {
                        Alert.alert('Data Syncing', 'No new data to sync.');
                    }
                });
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
