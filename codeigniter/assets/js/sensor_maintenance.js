
$(document).ready(function () {
    initializeMaintenanceLogsCalendar();
    initalizeSensorMaintenanceData();
    saveMaintenanceLogs();
    maintenanceLogsDataAction();
});
const rainfall_colors = {
    "24h": "rgba(73, 105, 252, 0.9)",
    "72h": "rgba(239, 69, 50, 0.9)",
    rain: "rgba(0, 0, 0, 0.9)"
};
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

function initalizeSensorMaintenanceData() {
    $.ajax({
        url: "http://192.168.150.10:5000/api/rainfall/get_rainfall_plot_data",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
            $("#one_day_rain").text("Loading. . . ");
            $("#three_day_rain").text("Loading. . . ");
        }
    }).done(function (data) {
        let rainfall_data = JSON.parse(data);
        console.log(rainfall_data);
        let rain_percentage = displaySensorMaintenanceSummary(rainfall_data);
        renderRainfallChart(rainfall_data[0], rain_percentage);
    });
}

function displaySensorMaintenanceSummary(rainfall_data) {
    let one_day_rain = "";
    let three_day_rain = "";

    let data = rainfall_data[0]

    one_day_rain = Math.round((data["1D cml"] / data["half of 2yr max"]) * 100);
    three_day_rain = Math.round((data["3D cml"] / data["2yr max"]) * 100);

    $("#one_day_rain").text(one_day_rain + "%");
    $("#three_day_rain").text(three_day_rain + "%");

    return {
        "one_day_rain": one_day_rain,
        "three_day_rain": three_day_rain
    }
}

function renderRainfallChart(rainfall_data, rain_percentage) {
    let one_day_threshold = rainfall_data["half of 2yr max"]
    let three_day_threshold = rainfall_data["2yr max"]
    console.log("1 day " + one_day_threshold);
    console.log("3 day " + three_day_threshold);
    createPlotContainer(rainfall_data.plot, one_day_threshold, three_day_threshold);

}

function createPlotContainer(data, one_day_threshold, three_day_threshold) {
    $("#rainfall_graphs_container").empty();
    $.each(data, function (key, value) {
        instantaneous_container = value.gauge_name + "_instantaneous";
        cumulative_container = value.gauge_name + "_cumulative";
        $("#rainfall_graphs_container").append("<div class='row'><div class='col' id=" + instantaneous_container + "></div><div class='col' id=" + cumulative_container + "></div></div>");

        renderCumulativeRainfallGraph(value, cumulative_container, three_day_threshold);
    });

}

function renderCumulativeRainfallGraph(data, container, three_day_threshold) {
    let length = data.data.length - 1;
    let temp_a = []
    let temp_b = []
    let return_values = []
    let previous_one_day = 0
    let previous_three_day = 0
    let ts_container = []

    const div = `#${container}`;
    let rain_data = data.data;
    rain_data.forEach(element => {
        if (element['24hr cumulative rainfall'] == null) {
            element['24hr cumulative rainfall'] = previous_one_day
        } else {
            previous_one_day = element['24hr cumulative rainfall']
        }

        if (element['72hr cumulative rainfall'] == null) {
            element['72hr cumulative rainfall'] = previous_three_day
        } else {
            previous_three_day = element['72hr cumulative rainfall']
        }

        temp_a.push([element['24hr cumulative rainfall']])
        temp_b.push([element['72hr cumulative rainfall']])
        ts_container.push(element.ts)
    });

    $(div).highcharts({
        series: [{
            name: '24hr',
            data: temp_a,
            color: '#5c77fc'
        }, {
            name: '72hr',
            data: temp_b,
            color: '#f0594a'
        }],
        chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 400,
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -30
                }
            }
        },
        title: {
            text: `<b>Cumulative Rainfall Chart of UMI</b>`,
            style: { fontSize: "13px" },
            margin: 20,
            y: 16
        },
        subtitle: {
            text: `Source: <b>${createRainPlotSubtitle(data.distance, data.gauge_name)}</b></b>`,
            style: { fontSize: "11px" }
        },
        xAxis: {
            categories: ts_container,
            visible: false,
        },
        yAxis: {
            title: {
                text: "<b>Value (mm)</b>"
            },
            max: Math.max(0, (three_day_threshold - parseFloat(three_day_threshold))) + parseFloat(three_day_threshold),
            min: 0,
            plotBands: [{
                value: Math.round(parseFloat(three_day_threshold / 2) * 10) / 10,
                color: rainfall_colors["24h"],
                dashStyle: "shortdash",
                width: 2,
                zIndex: 0,
                label: {
                    text: `24-hr threshold (${three_day_threshold / 2})`

                }
            }, {
                value: three_day_threshold,
                color: rainfall_colors["72h"],
                dashStyle: "shortdash",
                width: 2,
                zIndex: 0,
                label: {
                    text: `72-hr threshold (${three_day_threshold})`
                }
            }]
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    });
}

function renderInstantaneousRainfallGraph() {

}

function createRainPlotSubtitle(distance, gauge_name) {
    let source = gauge_name.toUpperCase();
    if (isFinite(gauge_name)) {
        source = `NOAH ${gauge_name}`;
    }
    const subtitle = distance === null ? source : `${source} (${distance} KM)`;
    return subtitle;
}

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    const thisChart = this.chart;
    const tag = "rainfall-chart";
    const charts = Highcharts.charts.filter((x) => {
        if (typeof x !== "undefined") return $(x.renderTo).hasClass(tag);
        return false;
    });

    if (e.trigger !== "syncExtremes") { // Prevent feedback loop
        Highcharts.each(charts, (chart) => {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: "syncExtremes" });
                }
            }
        });
    }
}

