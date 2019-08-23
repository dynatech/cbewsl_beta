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
        let counter = 0;
        let ret_val = {}
        let to_local_data = []

        if (storage_key != "") {
            let temp = []
            temp_key = {
                storage_key: response[Object.keys(response)[0]]
            }
            temp.push(temp_key);
            KEYS_N_API = temp;
        }

        KEYS_N_API.forEach(response => {
            fetch(response[Object.keys(response)[0]]).then((response) => response.json())
                .then((responseJson) => {
                    switch (Object.keys(response)[0]) {
                        case "FieldSurveyLogs":
                            to_local_data = []
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    field_survey_id: value.field_survey_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    mat_characterization: value.mat_characterization,
                                    mechanism: value.mechanism,
                                    exposure: value.exposure,
                                    note: value.note,
                                    date: value.date,
                                });
                            }
                            Storage.setItem("FieldSurveyLogs", to_local_data)
                            break;
                        case "FieldSurveyLatestReportSummary":
                            to_local_data = []
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    field_survey_id: value.field_survey_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    features: value.features,
                                    mat_characterization: value.mat_characterization,
                                    mechanism: value.mechanism,
                                    exposure: value.exposure,
                                    note: value.note,
                                    date: value.date
                                });
                            }
                            Storage.setItem("FieldSurveyLatestReportSummary", to_local_data)
                            break;
                        case "RiskAssessmentFamilyRiskProfile":
                            to_local_data = []
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    family_profile_id: value.family_profile_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    members_count: value.members_count,
                                    vulnerable_members_count: value.vulnerable_members_count,
                                    vulnerability_nature: value.vulnerability_nature
                                })
                            }
                            Storage.setItem("RiskAssessmentFamilyRiskProfile", to_local_data)
                            break;
                        case "RiskAssessmentHazardData":
                            to_local_data = [];
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    hazard_data_id: value.hazard_data_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    hazard: value.hazard,
                                    speed_of_onset: value.speed_of_onset,
                                    early_warning: value.early_warning,
                                    impact: value.impact
                                });
                            }
                            Storage.setItem("RiskAssessmentHazardData", to_local_data)
                            break;
                        case "RiskAssessmentRNC":
                            to_local_data = [];
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    resources_and_capacities_id: value.resources_and_capacities_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    resource_and_capacity: value.resource_and_capacity,
                                    status: value.status,
                                    owner: value.owner
                                })
                            }
                            Storage.setItem("RiskAssessmentRNC", to_local_data)
                            break;
                        case "RiskAssessmentSummary":
                            to_local_data = [];
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    summary_id: value.summary_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    location: value.location,
                                    impact: value.impact,
                                    adaptive_capacity: value.adaptive_capacity,
                                    vulnerability: value.vulnerability
                                });
                            }
                            Storage.setItem("RiskAssessmentSummary", to_local_data)
                            break;
                        case "SensorMaintenanceLogs":
                            to_local_data = [];
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    sensor_maintenance_id: value.sensor_maintenance_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    working_nodes: value.working_nodes,
                                    anomalous_nodes: value.anomalous_nodes,
                                    rain_gauge_status: value.rain_gauge_status,
                                    timestamp: value.timestamp,
                                });
                            }
                            Storage.setItem("SensorMaintenanceLogs", to_local_data)
                            break;
                        case "SituationReportLatest":
                            to_local_data = [];
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    situation_report_id: value.situation_report_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    timestamp: value.timestamp,
                                    summary: value.summary,
                                    pdf_path: value.pdf_path,
                                    image_path: value.image_path
                                });
                            }
                            Storage.setItem("SituationReportLatest", to_local_data)
                            break;
                        case "SituationReportLogs":
                            to_local_data = [];
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    situation_report_id: value.situation_report_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    timestamp: value.timestamp,
                                    summary: value.summary,
                                    pdf_path: value.pdf_path,
                                    image_path: value.image_path
                                });
                            }
                            Storage.setItem("SituationReportLogs", to_local_data)
                            break;
                        case "SurficialDataMomsSummary":
                            to_local_data = []
                            for (const [index, value] of responseJson.entries()) {
                                to_local_data.push({
                                    moms_id: value.moms_id,
                                    local_storage_id: 3,
                                    sync_status: 3,
                                    type_of_feature: value.type_of_feature,
                                    description: value.description,
                                    name_of_feature: value.name_of_feature,
                                    date: value.date
                                })
                            }
                            Storage.setItem("SurficialDataMomsSummary", to_local_data)
                            break;
                        case "SurficialDataSummary":
                            Storage.setItem("SurficialDataSummary", responseJson[0].surficial_data)
                            break;
                        case "RainfallSummary":
                            Storage.setItem("RainfallSummary", responseJson)
                            break;
                        default:
                            Storage.setItem(Object.keys(response)[0], responseJson);
                            to_local_data = responseJson
                            break;
                    }
                }).catch((error) => {
                    console.log("Catching network failed");
                });

            if (counter < KEYS_N_API.length - 1) {
                ret_val = { "status": false }
            } else {
                ret_val = { "status": true, 'storage': to_local_data }
            }
            counter++;
        })
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
            if (response.status == "In-active") {
                ToastAndroid.show("You are offline.", ToastAndroid.SHORT);
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
                                    body: JSON.stringify(value),
                                }).then((response) => response.json())
                                    .then((responseJson) => {
                                        ToastAndroid.show("Syncing client to server...", ToastAndroid.SHORT);
                                    })
                                    .catch((error) => {
                                        ToastAndroid.show("No network detected, Unable to network sync..", ToastAndroid.SHORT);
                                    });
                            } else {
                                ToastAndroid.show("Syncing server to client...", ToastAndroid.SHORT);
                            }
                        });
                    } else {
                        Alert.alert('Data Syncing', 'No new data to sync.');
                    }
                });
            }
        });

        return true;
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
