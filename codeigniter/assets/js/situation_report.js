$(document).ready(function () {
    initializeSituationReportCalendar();
    saveSituationReport();
    situationReportSummaryAction();
    initializeTimePicker();
});

function initializeTimePicker() {
    $('#situation_log_time_picker').timepicker({
        uiLibrary: 'bootstrap4'
    });
    $(".gj-icon").addClass("fa fa-clock").removeClass("clock").removeClass("gj-icon")
    $("#situation_log_time_picker").prop('disabled', true);
    $("#situation_log_time_picker").val("");
}

let situation_date_selected = "none";
function initializeSituationReportCalendar() {
    $("#situation_report_calendar").empty();
    let situation_reports = [];
    $.ajax({
        url: "http://192.168.1.10:5000/api/situation_report/get_all_situation_report",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let json_data = JSON.parse(data);
        $.each(json_data, function (key, value) {
            let date = formatDateTime(value.timestamp);
            situation_reports.push({
                title: value.summary,
                start: date.date,
                id: value.situation_report_id
            })
        });
        SITUATION_LOG_DATA = situation_reports
        if (situation_reports[0]) {
            let formatted_date = formatDateTime(situation_reports[0].start);
            let date = formatted_date.date_only_format;
            let time = formatted_date.time_format;
            $("#latest_situation_report_date_time").text("").append("<b>Date : " + date + "</b><br>");
            $("#latest_situation_report_summary").text("").append("<b>Summary :</b><br>" + situation_reports[0].title);
            $("#send_current_situation_report").show();
            $("#print_current_situation_report").show();
            sendSituationReportViaEmail(date);
            generateSituationReportPDF(situation_reports[0]);
            $("#situation_latest_report_details").show();
            $("#no_latest_situation_report").hide();
        } else {
            $("#situation_latest_report_details").hide();
            $("#no_latest_situation_report").show();
            $("#send_current_situation_report").hide();
            $("#print_current_situation_report").hide();
        }

        let situation_report_calendar = document.getElementById("situation_report_calendar");
        $("#situation_report_data").hide();
        let calendar = new FullCalendar.Calendar(situation_report_calendar, {
            plugins: ['interaction', 'dayGrid', 'timeGrid'],
            selectable: true,
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'addReportButton'
            },
            customButtons: {
                addReportButton: {
                    text: '+ Add Report',
                    click: function () {
                        $("#situation_report_data").show(300);
                        $("#situation_report_form").show(300);
                        $("#situation_report_log").hide(300);
                        $("#situation_report_id").val(0);
                        $("#summary").val("");
                    }
                }
            },
            dateClick: function (date, jsEvent, view, resource) {
                let current_date = moment(new Date()).format("YYYY-MM-DD");
                situation_date_selected = date.dateStr;
                let compare_date = moment(current_date).isSameOrAfter(situation_date_selected);
                if (compare_date == false) {
                    alert("Unable to add future report");
                } else {
                    let formatted_date = formatDateTime(situation_date_selected);
                    $("#situation_report_label").text("Add report for " + formatted_date.date_only_format);
                    $("#situation_report_data").show(300);
                    $("#situation_report_form").show(300);
                    $("#situation_report_log").hide(300);
                    $("#situation_report_id").val(0);
                    $("#summary").val("");
                }

                //api get event by date
            },
            eventClick: function (info) {
                let situation_report_summary = info.event;
                let formatted_date = formatDateTime(situation_report_summary.start);
                let date = formatted_date.date_only_format;
                situation_date_selected = formatted_date.date;
                $("#situation_report_id").val(situation_report_summary.id);
                $("#summary").val(situation_report_summary.title);
                $("#situation_report_label").text("").append("Update summary for " + date);
                $("#situation_report_date_time").text("").append("<b>Date :</b> " + date);
                $("#situation_report_summary").text("").append("<b>Summary:</b> <br>" + situation_report_summary.title);
                $("#situation_report_data").show(300);
                $("#situation_report_form").hide(300);
                $("#situation_report_log").show(300);

            },
            events: situation_reports
        });
        calendar.setOption('height', 700);
        calendar.destroy();
        calendar.render();
        calendar.render();
    });
}

function generateSituationReportPDF(data) {
    $("#print_current_situation_report").unbind();
    $("#print_current_situation_report").click(function () {

        let data = [SITUATION_LOG_DATA[0]];
        if (data[0] == undefined) {
            alert("No data.");
        } else {
            printJS({
                printable: data,
                type: 'json',
                properties: [
                    { field: 'title', displayName: 'Summary' },
                    { field: 'start', displayName: 'Date' }
                ],
                header: '<img src="http://cbewsl.com/assets/images/letter_header1.png" width="1200px" height="70px"></img><img src="http://cbewsl.com/assets/images/banner_new.png" width="1200px" height="90px"></img><h3>Current Situation Report</h3><img src="http://cbewsl.com/assets/images/letter_footer1.png" width="1200px" height="90px" style="position: fixed;left: 0;bottom: 0;width: 100%;"></img>'
            });
        }
    });
}

function sendSituationReportViaEmail(date) {
    $("#send_situation_report_spinner").hide();
    $("#send_current_situation_report").unbind();
    $("#send_current_situation_report").click(function () {
        $("#sendEmailSituationReportModal").modal({
            backdrop: "static",
            keyboard: false
        })
    });

    $("#confirm_send_situation_report").unbind();
    $("#confirm_send_situation_report").click(function () {
        $("#send_situation_report_spinner").show();
        $("#confirm_send_situation_report").hide();
        let url = "http://192.168.1.10:5000/api/situation_report/send_email";
        let data = {
            date: date,
            email: $("#email_for_situation_report").val()
        }

        $.post(url, data).done(function (response) {
            alert(response.message);
            $("#send_situation_report_spinner").hide();
            $("#confirm_send_situation_report").show();
            if (response.status == true) {
                $("#email_for_situation_report").val("");
                $("#sendEmailSituationReportModal").modal("hide");
            }
        });
    });
}

function saveSituationReport() {
    $("#add_situation_report").click(function () {
        let url = "http://192.168.1.10:5000/api/situation_report/save_situation_report";
        let summary = $("#summary").val();
        let time = $("#situation_log_time_picker").val();
        let data = {
            situation_report_id: $("#situation_report_id").val(),
            timestamp: situation_date_selected,
            summary: summary,
            time_selected: time,
            pdf_path: "",
            image_path: ""
        }
        if (situation_date_selected != "none") {
            if (summary != "" && time != "") {
                $.post(url, data).done(function (response) {
                    alert(response.message);
                    if (response.status == true) {
                        $("#situation_report_id").val(0);
                        $("#summary").val("");
                        $("#situation_log_time_picker").val("");
                        initializeSituationReportCalendar();
                        $("#situation_report_label").text("Please select a date.");
                        $("#add_situation_report").text("Add");
                        situation_date_selected = "none"
                        $("#situation_report_data").show(300);
                        $("#situation_report_form").show(300);
                        $("#situation_report_log").show(300);
                    }
                });
            } else {
                alert("All fields are required!");
            }

        } else {
            alert("Please select date");
        }

    });
}

function situationReportSummaryAction() {
    $("#edit_situation_report").click(function () {
        $("#situation_report_form").show(300);
        $("#situation_report_log").hide(300);
        $("#add_situation_report").text("Update");
    });

    $("#delete_situation_report").click(function () {
        if (confirm('Are you sure you want to delete this entry?')) {
            let url = "http://192.168.1.10:5000/api/situation_report/delete_situation_report";
            let data = {
                "situation_report_id": $("#situation_report_id").val()
            }

            $.post(url, data).done(function (response) {
                alert(response.message);
                if (response.status == true) {
                    $("#situation_report_id").val(0);
                    $("#summary").val("");
                    initializeSituationReportCalendar();
                    $("#situation_report_label").text("Please select a date.");
                    $("#add_situation_report").text("Add");
                    situation_date_selected = "none"
                    $("#situation_report_data").show(300);
                    $("#situation_report_form").show(300);
                    $("#situation_report_log").show(300);
                }
            });
        }
    });
}
