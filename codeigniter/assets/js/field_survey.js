$(document).ready(function () {
    getAllFieldSurvey();
});

function formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    let date_format = ""
    let time_format = ""
    if (timestamp == null) {
        current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
        date_format = moment(new Date()).format("YYYY-MM-DD")
        time_format = moment(new Date()).format("h:mm:ss A")
        text_format_timestamp = moment(new Date()).format("MMMM D, YYYY hh:MM a")
    } else {
        current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
        date_format = moment(date).format("YYYY-MM-DD")
        time_format = moment(date).format("h:mm:ss A")
        text_format_timestamp = moment(date).format("MMMM D, YYYY hh:MM a")
    }

    return {
        current_timestamp: current_timestamp,
        date: date_format,
        time: time_format,
        text_format_timestamp: text_format_timestamp
    }
}

function getAllFieldSurvey() {
    $.ajax({
        url: "http://192.168.150.10:5000/api/field_survey/get_all_field_survey",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let field_survey_logs = JSON.parse(data)
        let formatted_data = []
        $.each(field_survey_logs, function (key, value) {
            console.log(value)
            let field_survey_id = value.field_survey_id
            let features = value.features
            let mat_characterization = value.mat_characterization
            let mechanism = value.mechanism
            let exposure = value.exposure
            let note = value.note
            let date = value.date
            let formatted_date_time = formatDateTime(value.date)
            let title_label = "Field Survey for " + String(formatted_date_time["text_format_timestamp"])
            let datas = {
                date: formatted_date_time["text_format_timestamp"],
                report: title_label,
                action: ""
            }

            formatted_data.push(datas)

        });

        console.log(formatted_data);
        let latest_data = formatted_data[0]
        let latest_date = latest_data.date
        $("#date_of_survey").text("Date: " + latest_date)
        $("#features").text(latest_data.features)
        $("#mat_characterization").text(latest_data.mat_characterization)
        $("#mechanism").text(latest_data.mechanism)
        $("#exposure").text(latest_data.exposure)
        $("#note").text(latest_data.note)
        let table = $('#field_survey_logs_table').DataTable({
            "data": formatted_data,
            "bDestroy": true,
            "columns": [
                { "data": "date" },
                { "data": "report" },
                { "data": "action" }
            ]
        });

        // $('#family_risk_profile_table tbody').on('click', '#edit_family_risk', function () {
        //     let data = table.row($(this).parents('tr')).data();
        //     setFamilyRiskDataForm(data);
        //     $("#add_family_risk").text("Update");
        // });

        // $('#family_risk_profile_table tbody').on('click', '#remove_family_risk', function () {
        //     let data = table.row($(this).parents('tr')).data();
        //     deleteFamilyRiskConfirmation(data);
        // });

    });
}