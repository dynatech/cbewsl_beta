$(document).ready(function () {
    initializeSituationReportCalendar();
    saveSituationReport();
    situationReportSummaryAction();
});

let situation_date_selected = "none";
function initializeSituationReportCalendar() {
    $("#situation_report_calendar").empty();
    let situation_reports = [];
    $.ajax({
        url: "http://192.168.150.10:5000/api/situation_report/get_all_situation_report",
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

        if (situation_reports[0]) {
            let formatted_date = formatDateTime(situation_reports[0].start);
            let date = formatted_date.date_only_format;
            let time = formatted_date.time_format;
            $("#latest_situation_report_date_time").text("").append("<b>Date : " + date + "</b><br>");
            $("#latest_situation_report_summary").text("").append("<b>Summary :</b><br>" + situation_reports[0].title);
        } else {
            $("#latest_situation_report_date_time").text("No latest report.");
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
                situation_date_selected = date.dateStr;
                let formatted_date = formatDateTime(situation_date_selected);
                $("#situation_report_label").text("Add report for " + formatted_date.date_only_format);
                $("#situation_report_data").show(300);
                $("#situation_report_form").show(300);
                $("#situation_report_log").hide(300);
                $("#situation_report_id").val(0);
                $("#summary").val("");
                //api get event by date
            },
            eventClick: function (info) {
                let situation_report_summary = info.event;
                let formatted_date = formatDateTime(situation_report_summary.start);
                let date = formatted_date.date_only_format;
                situation_date_selected = formatted_date.current_timestamp;
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
        calendar.destroy();
        calendar.render();
        calendar.render();
    });
}

function saveSituationReport() {
    $("#add_situation_report").click(function () {
        let url = "http://192.168.150.10:5000/api/situation_report/save_situation_report";
        let summary = $("#summary").val();
        let data = {
            situation_report_id: $("#situation_report_id").val(),
            timestamp: situation_date_selected,
            summary: summary,
            pdf_path: "",
            image_path: ""
        }
        if (situation_date_selected != "none") {
            if (summary != "") {
                $.post(url, data).done(function (response) {
                    alert(response.message);
                    if (response.status == true) {
                        $("#situation_report_id").val(0);
                        $("#summary").val("");
                        $("#situation_report_data").hide(300);
                        $("#situation_report_form").hide(300);
                        $("#situation_report_log").hide(300);
                        $("#situation_report_label").text("Please select a date.");
                        $("#add_situation_report").text("Add");
                        situation_date_selected = "none"
                        initializeSituationReportCalendar();
                    }
                });
            } else {
                alert("Summary field is required!");
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
            let url = "http://192.168.150.10:5000/api/situation_report/delete_situation_report";
            let data = {
                "situation_report_id": $("#situation_report_id").val()
            }

            $.post(url, data).done(function (response) {
                alert(response.message);
                if (response.status == true) {
                    $("#situation_report_id").val(0);
                    $("#summary").val("");
                    $("#situation_report_data").hide(300);
                    $("#situation_report_form").hide(300);
                    $("#situation_report_log").hide(300);
                    $("#situation_report_label").text("Please select a date.");
                    $("#add_situation_report").text("Add");
                    situation_date_selected = "none"
                    initializeSituationReportCalendar();
                }
            });
        }
    });
}
