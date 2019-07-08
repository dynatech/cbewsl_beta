$(document).ready(function () {
    initializeSurficialData();
    initializeCurrentMeasurement();
    initializeMonitoringLogs();
    initializeAddMonitoringLogs();
    initializeCRUDMonitoringLogs();

    $('#cancel_add_field_survey').modal('hide');
});

function initializeSurficialData() {
    $('#surficial-data-tab').on('click', function () {
        console.log("Loaded");
        $(".surficial-measuremnt-container h5").text("Change");
        fetch('http://192.168.150.10:5000/api/surficial_data/get_surficial_data').then((response) => response.json())
            .then((responseJson) => {
                let surficial_summary = responseJson;
                let graph_plot_data = [];
                for (let counter = 0; counter < surficial_summary[0].surficial_data.length; counter++) {
                    let temp_data_cont = []
                    for (let sub_counter = 0; sub_counter < surficial_summary[0].surficial_data[counter].ts.length; sub_counter++) {
                        temp_data_cont.push({
                            x: moment(surficial_summary[0].surficial_data[counter].ts[sub_counter], "YYYY-MM-DD HH:mm:ss").valueOf(),
                            y: surficial_summary[0].surficial_data[counter].measurements[sub_counter]
                        })
                    }
                    let temp = {
                        id: surficial_summary[0].surficial_data[counter].crack_name,
                        name: surficial_summary[0].surficial_data[counter].crack_name,
                        data: temp_data_cont
                    }
                    graph_plot_data.push(temp)
                }
                let end_date = surficial_summary[0].surficial_data[0].ts[surficial_summary[0].surficial_data[0].ts.length - 1]
                let formatted_date = formatDateTime(end_date);
                let last_data = "Last surficial data received is on " + formatted_date.text_format_timestamp;
                $(".surficial-measuremnt-container h5").text(last_data);
                $(".moms-container").empty();
                $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Type of Feature: " + surficial_summary[0].moms_data[0].type_of_feature + "</p>");
                $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Description: " + surficial_summary[0].moms_data[0].description + "</p>");
                $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Name of Feature: " + surficial_summary[0].moms_data[0].name_of_feature + "</p>");
                
                $(".surficial-graph-container").highcharts({
                    series: graph_plot_data,
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
                        text: `<b>Surficial Data History Chart of UMI</b>`,
                        y: 22
                    },
                    subtitle: {
                        text: `As of: <b>${moment(end_date).format("D MMM YYYY, HH:mm")}</b>`,
                        style: { fontSize: "13px" }
                    },
                    yAxis: {
                        title: {
                            text: "<b>Displacement (cm)</b>"
                        }
                    },
                    xAxis: {
                        type: "datetime",
                        dateTimeLabelFormats: {
                            month: "%e. %b %Y",
                            year: "%b"
                        },
                        title: {
                            text: "<b>Date</b>"
                        }
                    },
                    tooltip: {
                        shared: true,
                        crosshairs: true
                    },
                    plotOptions: {
                        line: {
                            marker: {
                                enabled: true
                            },
                            dashStyle: "ShortDash"
                        },
                        series: {
                            marker: {
                                radius: 3
                            },
                            cursor: "pointer"
                        }
                    },
                    credits: {
                        enabled: false
                    }
                });
            })
            .catch((error) => {
                console.log(error)
            });
    });
};

function initializeCurrentMeasurement() {
    $("#current_measurement_tab").on('click',function() {
        $('.measurement-header').empty();
        $('.measurements').empty();
        fetch('http://192.168.150.10:5000/api/surficial_data/get_current_measurement').then((response) => response.json())
        .then((responseJson) => {
          let formmated_timestamp = formatDateTime(date = responseJson.current_measurement_date)
          let crack_sets = []
          $('.measurement-header').append(`<h4><b>Date: ${formmated_timestamp["date_only_format"].toUpperCase()}</b></h4>`)
          $('.measurement-header').append(`<h4><b>Time: ${formmated_timestamp["time_format"].toUpperCase()}</b></h4>`)
          for (const [index, value] of responseJson.cracks.entries()) {
            $('.measurements').append(`<h4><b>Crack ${value.crack.toUpperCase()}: ${value.measurement} cm</b></h4>`);
          }
        })
        .catch((error) => {

        });
    });
}

function initializeMonitoringLogs() {
    let formatted_data = []
    fetch('http://192.168.150.10:5000/api/surficial_data/get_moms_data').then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson)
        responseJson.forEach(function(value) {
            let entry = {
                moms_id: value.moms_id,
                date: value.date,
                feature_type: value.type_of_feature,
                feature_name: value.name_of_feature,
                description: value.description
            }
            formatted_data.push(entry);
        })
        console.log(formatted_data);
            let datatable = $('#moms_table').DataTable({
                "data": formatted_data,
                "bDestroy": true,
                "columns": [
                    { "data": "date" },
                    { "data": "feature_type" },
                    { "data": "feature_name" },
                    { "data": "description" },
                    {
                        render(data, type, full) {
                            // ${full.resources_and_capacities_id}
                            return `<a href="#" id="edit_monitoring_logs"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="remove_monitoring_logs"><i class="fas fa-minus-circle text-center"></i></a>`;
                        }
                    }
                ]
            });

            initializeCRUDLogs(datatable);
    })
    .catch((error) => {
      console.log(error)
    });
}

function initializeCRUDLogs(datatable) {
    $('#moms_table tbody').on('click', '#edit_monitoring_logs', function () {
        let data = datatable.row($(this).parents('tr')).data();
        monitoringLogsMod(data);
        $("#add_monitoring_logs").text("Update");
        $("#surficial_data_modal").modal("show");
    });
}

function monitoringLogsMod(data) {
    console.log(data)
    $('#moms_id').val(data.moms_id);
    $('#moms_dt').val(data.date);
    $('#moms_t_feature').val(data.feature_name);
    $('#moms_n_feature').val(data.feature_type);
    $('#moms_description').val(data.description);
}

function initializeAddMonitoringLogs() {
    $("#add_moms_form").on("click", function() {
        console.log($('#moms_id').val(0));
        console.log($('#moms_dt').val(""));
        console.log($('#moms_t_feature').val("data.feature_name"));
        console.log($('#moms_n_feature').val("data.feature_type"));
        console.log($('#moms_description').val(""));
        $("#add_monitoring_logs").text("Add");
        $("#surficial_data_modal").modal("show");
    })
}

function initializeCRUDMonitoringLogs() {
    $('#add_monitoring_logs').on('click', function () {
        console.log($('#moms_id').val(data.moms_id));
        console.log($('#moms_dt').val(data.date));
        console.log($('#moms_t_feature').val(data.feature_name));
        console.log($('#moms_n_feature').val(data.feature_type));
        console.log($('#moms_description').val(data.description));
    });
}

