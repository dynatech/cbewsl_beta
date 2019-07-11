let RISK_PROFILE_DATA = null;
let HAZARD_DATA = null;
let RESOURCE_AND_CAPACITIES_DATA = null;
let FAMILY_RISK_PROFILE_DATA = null;
let FIELD_SURVEY_LOG_DATA = null;
let SITUATION_LOG_DATA = null;
let MAINTENANCE_LOG_DATA = null;
let MONITORING_LOG_DATA = null;
let specialElementHandlers = {
    '#editor': function (element, renderer) {
        return true;
    }
};
$(document).ready(function () {
    reportData();
});
function formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    let date_format = ""
    let date_only_format = ""
    let time_format = ""
    if (timestamp == null) {
        current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS");
        date_format = moment(new Date()).format("YYYY-MM-DD");
        date_only_format = moment(new Date()).format("MMMM D, YYYY");
        time_format = moment(new Date()).format("hh:MM a");
        text_format_timestamp = moment(new Date()).format("MMMM D, YYYY hh:MM a");
    } else {
        current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS");
        date_format = moment(date).format("YYYY-MM-DD");
        date_only_format = moment(date).format("MMMM D, YYYY");
        time_format = moment(date).format("hh:MM a");
        text_format_timestamp = moment(date).format("MMMM D, YYYY hh:MM a");
    }

    return {
        current_timestamp: current_timestamp,
        date: date_format,
        time_format: time_format,
        date_only_format: date_only_format,
        text_format_timestamp: text_format_timestamp
    }
}

function reportData() {
    let data = [
        { "type": "Risk Profile", "logs": "risk_profile" },
        { "type": "Hazard Data", "logs": "hazard_data" }];

    let table = $('#reports_table').DataTable({
        "data": data,
        "bDestroy": true,
        "columns": [
            { "data": "type" },
            {
                render(data, type, full) {
                    return `<button type="button" class="btn btn-primary btn-sm btn-block" id="print_report"><i class="fas fa-print text-center"></i> Print / Save</button>`;
                }
            }
        ]
    });

    $('#reports_table tbody').on('click', '#print_report', function () {
        let data = table.row($(this).parents('tr')).data();
        printData();
    });
}


function printData() {
    // if (logs == "hazard_data") {
    //     printJS({
    //         printable: HAZARD_DATA,
    //         type: 'json',
    //         properties: [
    //             { field: 'hazard', displayName: 'Hazard' },
    //             { field: 'speed_of_onset', displayName: 'Speed of onset' },
    //             { field: 'early_warning', displayName: 'Early Warning' },
    //             { field: 'impact', displayName: 'Impact' }
    //         ],
    //         header: '<h3>Hazard Data</h3>'
    //     });
    // } else if (logs == "risk_profile") {

    // }else if (logs == "risk_profile") {

    // }else if (logs == "risk_profile") {

    // }else if (logs == "risk_profile") {

    // }else if (logs == "risk_profile") {

    // }

}