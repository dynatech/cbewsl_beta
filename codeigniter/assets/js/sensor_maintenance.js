$(document).ready(function () {
    initializeMaintenanceLogsCalendar();
    saveMaintenanceLogs();
    maintenanceLogsDataAction();
});

let maintenance_log_date_selected = "";

function initializeMaintenanceLogsCalendar() {
    $("#maintenance_logs_calendar").empty();
    let maintenance_logs = [];
    $.ajax({
        url: "http://192.168.150.10:5000/api/sensor_maintenance/get_all_sensor_maintenance",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let json_data = JSON.parse(data);
        $.each(json_data, function (key, value) {
            let date = formatDateTime(value.timestamp);
            let title = "Working Nodes: " + value.working_nodes + ", Anomalous Nodes: " + value.anomalous_nodes + ", Rain Gauge Status: " + value.rain_gauge_status;
            maintenance_logs.push({
                title: title,
                working_nodes: value.working_nodes,
                anomalous_nodes: value.anomalous_nodes,
                rain_gauge_status: value.rain_gauge_status,
                start: date.date,
                id: value.sensor_maintenance_id
            })
        });

        latestSensorMaintenanceData(maintenance_logs[0]);
        let maintenance_logs_calendar = document.getElementById("maintenance_logs_calendar");
        $("#maintenance_logs_data").hide();

        let calendar = new FullCalendar.Calendar(maintenance_logs_calendar, {
            plugins: ['interaction', 'dayGrid', 'timeGrid'],
            selectable: true,
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'addLogsButton'
            },
            customButtons: {
                addLogsButton: {
                    text: '+ Add Log',
                    click: function () {
                        $("#maintenance_logs_data").show(300);
                        $("#maintenance_log_form").show(300);
                        $("#maintenance_log").hide(300);
                        $("#sensor_maintenance_id").val(0);
                        $("#working_nodes").val("");
                        $("#anomalous_nodes").val("");
                        $("#rain_gauge_status").val("");
                        $("#add_maintenance_logs").text("Add");
                    }
                }
            },
            dateClick: function (date, jsEvent, view, resource) {
                maintenance_log_date_selected = date.dateStr;
                let formatted_date = formatDateTime(maintenance_log_date_selected);
                $("#maintenance_log_label").text("Add log for " + formatted_date.date_only_format);
                $("#maintenance_logs_data").show(300);
                $("#maintenance_log_form").show(300);
                $("#maintenance_log").hide(300);
                $("#sensor_maintenance_id").val(0);
                $("#working_nodes").val("");
                $("#anomalous_nodes").val("");
                $("#rain_gauge_status").val("");
                $("#add_maintenance_logs").text("Add");
            },
            eventClick: function (info) {
                let maintenance_log = info.event;
                let formatted_date = formatDateTime(maintenance_log.start);
                let date = formatted_date.date_only_format;
                maintenance_log_date_selected = formatted_date.current_timestamp;
                $("#sensor_maintenance_id").val(maintenance_log.id);
                $("#working_nodes").val(maintenance_log.extendedProps.working_nodes);
                $("#anomalous_nodes").val(maintenance_log.extendedProps.anomalous_nodes);
                $("#rain_gauge_status").val(maintenance_log.extendedProps.rain_gauge_status);
                $("#maintenance_log_label").text("").append("Update summary for " + date);
                $("#maintenance_log_date_time").text("").append("<b>Date :</b> " + date);
                $("#maintenance_log_summary").text("").append("<b>Working Nodes: </b> " + maintenance_log.extendedProps.working_nodes + "<br><b>Anomalous Nodes: </b> " + maintenance_log.extendedProps.anomalous_nodes + "<br><b>Rain Gauge Status: </b>" + maintenance_log.extendedProps.rain_gauge_status);
                $("#maintenance_logs_data").show(300);
                $("#maintenance_log_form").hide(300);
                $("#maintenance_log").show(300);
                $("#add_maintenance_logs").text("Update");

            },
            events: maintenance_logs
        });
        calendar.destroy();
        calendar.render();
        calendar.render();
    });
}

function saveMaintenanceLogs() {
    $("#add_maintenance_logs").click(function () {
        let url = "http://192.168.150.10:5000/api/sensor_maintenance/save_sensor_maintenance_logs";
        let working_nodes = $("#working_nodes").val();
        let anomalous_nodes = $("#anomalous_nodes").val();
        let rain_gauge_status = $("#rain_gauge_status").val();
        let data = {
            sensor_maintenance_id: $("#sensor_maintenance_id").val(),
            working_nodes: working_nodes,
            anomalous_nodes: anomalous_nodes,
            rain_gauge_status: rain_gauge_status,
            timestamp: maintenance_log_date_selected
        }
        if (maintenance_log_date_selected != "none") {
            if (working_nodes != "" || anomalous_nodes != "" || rain_gauge_status != "") {
                $.post(url, data).done(function (response) {
                    alert(response.message);
                    if (response.status == true) {
                        $("#sensor_maintenance_id").val(0);
                        $("#working_nodes").val("");
                        $("#anomalous_nodes").val("");
                        $("#rain_gauge_status").val("");
                        $("#maintenance_logs_data").hide(300);
                        $("#maintenance_log_form").hide(300);
                        $("#maintenance_log").hide(300);
                        $("#maintenance_log_label").text("Please select a date.");
                        $("#add_maintenance_logs").text("Add");
                        maintenance_log_date_selected = "none"
                        initializeMaintenanceLogsCalendar();
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

function maintenanceLogsDataAction() {
    $("#edit_maintenance_log").click(function () {
        $("#maintenance_log_form").show(300);
        $("#maintenance_log").hide(300);
        $("#add_maintenance_logs").text("Update");
    });

    $("#delete_maintenance_log").click(function () {
        if (confirm('Are you sure you want to delete this entry?')) {
            let url = "http://192.168.150.10:5000/api/sensor_maintenance/delete_sensor_maintenance";
            let data = {
                "sensor_maintenance_id": $("#sensor_maintenance_id").val()
            }

            $.post(url, data).done(function (response) {
                alert(response.message);
                if (response.status == true) {
                    $("#sensor_maintenance_id").val(0);
                    $("#working_nodes").val("");
                    $("#anomalous_nodes").val("");
                    $("#rain_gauge_status").val("");
                    $("#maintenance_logs_data").hide(300);
                    $("#maintenance_log_form").hide(300);
                    $("#maintenance_log").hide(300);
                    $("#maintenance_log_label").text("Please select a date.");
                    $("#add_maintenance_logs").text("Add");
                    maintenance_log_date_selected = "none"
                    initializeMaintenanceLogsCalendar();
                }
            });
        }
    });
}

function latestSensorMaintenanceData(latest_data) {
    console.log(latest_data)
    if (latest_data != null || latest_data != undefined) {
        if (latest_data.length != 0) {
            let formatted_date = formatDateTime(latest_data.start);
            $("#latest_sensor_status").empty().append("<b>NUMBER OF WORKING NODES: </b>" + latest_data.working_nodes + "<br><br>");
            $("#latest_sensor_status").append("<b>ANOMALOUS NODES: </b>" + latest_data.anomalous_nodes + "<br><br>");
            $("#latest_sensor_status").append("<b>RAIN GUAGE STATUS: </b>" + latest_data.anomalous_nodes + "<br><br>");
            $("#latest_sensor_status").append("<b>LAST MAINTENANCE: </b>" + formatted_date.date_only_format + "");
        } else {
            $("#latest_sensor_status").empty().append("<b>No latest sensor status data. </b>");
        }
    } else {
        $("#latest_sensor_status").empty().append("<b>No latest sensor status data. </b>");
    }
}