import Storage from './storage';

const Sync = {
    serverToClient: async function () {
        const DOCROOT = 'http://192.168.150.10:5000'
        let KEYS_N_API = [
            // {'Pub&CandidAlert': DOCROOT+'/api/monitoring/get_candidate_and_current_alerts'},
            {'FieldSurveyLogs': DOCROOT+'/api/field_survey/get_all_field_survey'},
            {'FieldSurveyLatestReportSummary': DOCROOT+'/api/field_survey/get_latest_field_survey_data'},
            {'RiskAssessmentFamilyRiskProfile': DOCROOT+'/api/family_profile/get_all_family_profile'},
            {'RiskAssessmentHazardData':  DOCROOT+'/api/hazard_data/get_all_hazard_data'},
            {'RiskAssessmentRNC':  DOCROOT+'/api/resources_and_capacities/get_all_resources_and_capacities'}, 
            {'RiskAssessmentSummary':  DOCROOT+'/api/risk_assesment_summary/get_all_risk_assessment_summary'},
            {'SensorMaintenanceLogs':  DOCROOT+'/api/sensor_maintenance/get_all_sensor_maintenance'},
            {'RainfallSummary':  DOCROOT+'/api/rainfall/get_rainfall_plot_data'},
            {'SituationReportLatest':  DOCROOT+'/api/situation_report/get_latest_situation_report_data'},
            {'SituationReportLogs':  DOCROOT+'/api/situation_report/get_all_situation_report'},
            {'SurficialDataCurrentMeasurement':  DOCROOT+'/api/surficial_data/get_current_measurement'},
            {'SurficialDataMomsSummary':  DOCROOT+'/api/surficial_data/get_moms_data'},
            {'SurficialDataSummary':  DOCROOT+'/api/surficial_data/get_surficial_data'}
        ];
        let counter = 0;
        let ret_val = {}
        let to_local_data = []
        let etc_counter = 0
        KEYS_N_API.forEach(response => {
            fetch(response[Object.keys(response)[0]]).then((response) => response.json())
            .then((responseJson) => {
              switch(Object.keys(response)[0]) {
                case "FieldSurveyLogs":
                    etc_counter = 0
                    to_local_data = []
                    for (const [index, value] of responseJson.entries()) {
                        let format_date_time = this.formatDateTime(date = value.date);
                        etc_counter += 1
                        to_local_data.push({
                        field_survey_id: value.field_survey_id,
                        local_storage_id: etc_counter,
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
                        let format_date_time = this.formatDateTime(date = value.date);
                        to_local_data.push({
                            field_survey_id: value.field_survey_id,
                            local_storage_id: 1,
                            sync_status: 3,
                            features: value.features,
                            mat_characterization: value.mat_characterization,
                            mechanism: value.mechanism,
                            exposure: value.exposure,
                            note: value.note,
                            date: format_date_time["text_format_timestamp"]
                        });
                    }
                    Storage.setItem("FieldSurveyLatestReportSummary", to_local_data)
                    break;
                case "RiskAssessmentFamilyRiskProfile":
                    etc_counter = 0
                    to_local_data = []
                    for (const [index, value] of responseJson.entries()) {
                        etc_counter += 1
                        to_local_data.push({
                        family_profile_id: value.family_profile_id,
                        local_storage_id: etc_counter,
                        sync_status: 3,
                        members_count: value.members_count,
                        vulnerable_members_count: value.vulnerable_members_count,
                        vulnerability_nature: value.vulnerability_nature
                        })
                    }
                    Storage.setItem("RiskAssessmentFamilyRiskProfile", to_local_data)
                    break;
                case "RiskAssessmentHazardData":
                    etc_counter = 0;
                    to_local_data = [];
                    for (const [index, value] of responseJson.entries()) {
                        etc_counter += 1
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
                    Storage.setItem("RiskAssessmentHazardData", to_local_data)
                    break;
                case "RiskAssessmentRNC":
                    etc_counter = 0;
                    to_local_data = [];
                    for (const [index, value] of responseJson.entries()) {
                        etc_counter += 1
                        to_local_data.push({
                        resources_and_capacities_id: value.resources_and_capacities_id,
                        local_storage_id: etc_counter,
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
                    etc_counter = 0;
                    for (const [index, value] of responseJson.entries()) {
                        etc_counter += 1
                        to_local_data.push({
                        summary_id: value.summary_id,
                        local_storage_id: etc_counter,
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
                    etc_counter = 0;
                    for (const [index, value] of responseJson.entries()) {
                        let format_date_time = this.formatDateTime(date = value.timestamp);
                        etc_counter += 1;
                        to_local_data.push({
                            sensor_maintenance_id: value.sensor_maintenance_id,
                            local_storage_id: etc_counter,
                            sync_status: 3,
                            working_nodes: value.working_nodes,
                            anomalous_nodes: value.anomalous_nodes,
                            rain_gauge_status: value.rain_gauge_status,
                            timestamp: format_date_time["current_timestamp"],
                        });
                    }
                    Storage.setItem("SensorMaintenanceLogs", to_local_data)
                    break;
              }
            });

            if (counter < KEYS_N_API.length - 1) {
                ret_val = {"status": false}
            } else {
                ret_val = {"status": true}
            }
            counter++;
        })
        return ret_val
    },
    clientToServer: async function (key, value) {

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
