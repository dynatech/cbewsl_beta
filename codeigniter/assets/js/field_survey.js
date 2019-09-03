$(document).ready(function () {
    getAllFieldSurvey();
    fieldSurveyButtonAction();

});

function getAllFieldSurvey() {
    $.ajax({
        url: "http://192.168.8.101:5000/api/field_survey/get_all_field_survey",
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

        FIELD_SURVEY_LOG_DATA = formatted_data
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

        $('#field_survey_logs_table tbody').on('click', '#remove_field_survey', function () {
            let data = table.row($(this).parents('tr')).data();
            console.log(data)
            deleteFieldSurveyConfirmation(data);
        });

    });
}

function deleteFieldSurveyConfirmation(data) {
    if (confirm('Are you sure you want to delete this entry?')) {
        deleteFieldSurvey(data.field_survey_id);
    } else {
        $('#field_survey_logs_table tbody').unbind();
    }
}

function deleteFieldSurvey(field_survey_id) {
    let url = "http://192.168.8.101:5000/api/field_survey/delete_field_survey";
    let data = {
        "field_survey_id": field_survey_id
    }

    $.post(url, data).done(function (response) {
        alert(response.message);
        if (response.status == true) {
            $('#field_survey_logs_table tbody').unbind();
            $("#field_survey_id").val(0);
            $("#features").val("");
            $("#mat_characterization").val("");
            $("#mechanism").val("");
            $("#exposure").val("");
            $("#note").val("");
            getAllFieldSurvey();
        }
    });
}

function setLatestFieldSurvey(formatted_data) {
    let latest_data = formatted_data[0]

    if (latest_data != undefined) {
        let latest_date = latest_data.date
        $("#latest_date_of_survey").text("Date: " + latest_date);
        $("#latest_features").text(latest_data.features);
        $("#latest_mat_characterization").text(latest_data.mat_characterization);
        $("#latest_mechanism").text(latest_data.mechanism);
        $("#latest_exposure").text(latest_data.exposure);
        $("#latest_note").text(latest_data.note);
        $("#field_survey_status").text("");
        $("#latest_report_summary_details").show();
        $("#field_survey_status").hide();
        generateFieldSurveyPDF(latest_data, latest_data.date);
        sendFieldSurveyViaEmail(latest_date);
        $("#send_latest_field_survey").show();
        $("#print_latest_field_survey").show();
    } else {
        $("#field_survey_status").text("No latest report");
        $("#latest_report_summary_details").hide();
        $("#field_survey_status").show();
        $("#send_latest_field_survey").hide();
        $("#print_latest_field_survey").hide();
    }


}

function generateFieldSurveyPDF(data, date) {
    $("#print_latest_field_survey").unbind();
    $("#print_latest_field_survey").click(function () {
        let pageWidth = 8.5,
            lineHeight = 1.2,
            margin = 0.5,
            maxLineWidth = pageWidth - margin * 2,
            fontSize = 20,
            ptsPerInch = 72,
            oneLineHeight = fontSize * lineHeight / ptsPerInch,
            text = 'Features: ' + data.features + '\n' +
                '\n' +
                'Material Characterization: ' + data.mat_characterization + '\n' +
                '\n' +
                'Mechanism: ' + data.mechanism + '\n' +
                '\n' +
                'Exposure: ' + data.exposure + '\n' +
                '\n' +
                'Note: ' + data.note + '\n',
            doc = new jsPDF({
                unit: 'in',
                lineHeight: lineHeight
            }).setProperties({ title: 'Latest Field Survey Report' });

        let textLines = doc
            .setFontSize(fontSize)
            .splitTextToSize(text, maxLineWidth);

        doc.text(textLines, margin, margin + 2 * oneLineHeight);

        let format_date_time = formatDateTime(date);
        let file_name = 'Latest_Field_Survey_Date_' + format_date_time.for_file_name
        doc.setFontStyle('bold')
            .text('Latest Field Survey Date: ' + date + '', margin, margin + oneLineHeight);

        doc.save(file_name + '.pdf');
        doc.output('dataurlnewwindow');
    });

}

function sendFieldSurveyViaEmail(date) {
    $("#send_latest_field_survey").unbind();
    $("#send_latest_field_survey").click(function () {
        $("#sendEmailFieldSurveyModal").modal("show");
    });

    $("#confirm_send_field_survey").unbind();
    $("#confirm_send_field_survey").click(function () {
        let url = "http://192.168.8.101:5000/api/field_survey/send_email";
        let data = {
            date: date,
            email: $("#email_for_field_survey").val()
        }
        $("#confirm_send_field_survey").prop('disabled', true);
        $.post(url, data).done(function (response) {
            alert(response.message);
            if (response.status == true) {
                $("#email_for_field_survey").val("");
                $("#sendEmailFieldSurveyModal").modal("hide");
                $("#confirm_send_field_survey").prop('disabled', false);
            } else {
                $("#confirm_send_field_survey").prop('disabled', false);
            }
        });
    });
}

function setFieldSurveyDataForm(data) {
    $("#field_survey_id").val(data.field_survey_id);
    $("#features").val(data.features);
    $("#mat_characterization").val(data.mat_characterization);
    $("#mechanism").val(data.mechanism);
    $("#exposure").val(data.exposure);
    $("#note").val(data.note);
    $("#field_survey_modal").modal("show");
}

function fieldSurveyButtonAction() {
    $("#add_field_survey").click(function () {
        let url = "http://192.168.8.101:5000/api/field_survey/save_field_survey";
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
                $("#field_survey_modal").modal("hide");
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
        $("#field_survey_modal").modal("hide");
    });

    $("#add_field_survey_form").click(function () {
        $("#field_survey_form_container").show(300);
        $("#add_field_survey").text("Add");
        $("#field_survey_modal").modal("show");
    });
}