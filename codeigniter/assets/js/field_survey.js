$(document).ready(function () {
    getAllFieldSurvey();
    fieldSurveyButtonAction();
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
                field_survey_id: field_survey_id,
                features: features,
                mat_characterization: mat_characterization,
                mechanism: mechanism,
                exposure: exposure,
                note: note,
                date: formatted_date_time["text_format_timestamp"],
                report: title_label
            }

            formatted_data.push(datas)

        });

        setLatestFieldSurvey(formatted_data);

        let table = $('#field_survey_logs_table').DataTable({
            "data": formatted_data,
            "bDestroy": true,
            "columns": [
                { "data": "date" },
                { "data": "report" },
                {
                    render(data, type, full) {
                        // ${full.resources_and_capacities_id}
                        return `<a href="#field_survey_logs" id="edit_field_survey"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#field_survey_logs" id="remove_field_survey"><i class="fas fa-minus-circle text-center"></i></a>`;
                    }
                }
            ]
        });

        $('#field_survey_logs_table tbody').on('click', '#edit_field_survey', function () {
            let data = table.row($(this).parents('tr')).data();
            setFieldSurveyDataForm(data);
            $("#add_field_survey").text("Update");
            $("#field_survey_form_container").show(300);
        });

        // $('#field_survey_logs_table tbody').on('click', '#remove_field_survey', function () {
        //     let data = table.row($(this).parents('tr')).data();
        //     deleteFamilyRiskConfirmation(data);
        // });

    });
}

function setLatestFieldSurvey(formatted_data) {
    let latest_data = formatted_data[0]
    let latest_date = latest_data.date
    $("#latest_date_of_survey").text("Date: " + latest_date);
    $("#latest_features").text(latest_data.features);
    $("#latest_mat_characterization").text(latest_data.mat_characterization);
    $("#latest_mechanism").text(latest_data.mechanism);
    $("#latest_exposure").text(latest_data.exposure);
    $("#latest_note").text(latest_data.note);
}

function setFieldSurveyDataForm(data) {
    console.log(data)
    $("#field_survey_id").val(data.field_survey_id);
    $("#features").val(data.features);
    $("#mat_characterization").val(data.mat_characterization);
    $("#mechanism").val(data.mechanism);
    $("#exposure").val(data.exposure);
    $("#note").val(data.note);
}

function fieldSurveyButtonAction() {
    $("#add_field_survey").click(function () {
        let url = "http://192.168.150.10:5000/api/field_survey/save_field_survey";
        let data = {
            field_survey_id: $("#field_survey_id").val(),
            features: $("#features").val(),
            mat_characterization: $("#mat_characterization").val(),
            mechanism: $("#mechanism").val(),
            exposure: $("#exposure").val(),
            note: $("#note").val()
        }

        $.post(url, data).done(function (response) {
            alert(response.message);
            if (response.status == true) {
                $("#field_survey_id").val(0);
                $("#features").val("");
                $("#mat_characterization").val("");
                $("#mechanism").val("");
                $("#exposure").val("");
                $("#note").val("");
                $("#add_field_survey").text("Add");
                $('#field_survey_logs_table tbody').unbind();
                $("#field_survey_form_container").hide(300);
                getAllFieldSurvey();
            }
        });
    });

    $("#cancel_add_field_survey").click(function () {
        $("#field_survey_form_container").hide(300);
        $("#field_survey_id").val(0);
        $("#features").val("");
        $("#mat_characterization").val("");
        $("#mechanism").val("");
        $("#exposure").val("");
        $("#note").val("");
        $("#add_field_survey").text("Add");
    });

    $("#add_field_survey_form").click(function () {
        $("#field_survey_form_container").show(300);
        $("#add_field_survey").text("Add");
    });
}