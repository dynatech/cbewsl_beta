$(document).ready(function () {
    initializeSurficialData();
    initializeCurrentMeasurement();
    initializeMonitoringLogs();
    initializeAddMonitoringLogs();
    initializeCRUDMonitoringLogs();
    uploadMomsImages();
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
                console.log(graph_plot_data)
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
    $("#current_measurement_tab").on('click', function () {
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
            responseJson.forEach(function (value) {
                let entry = {
                    moms_id: value.moms_id,
                    date: value.date,
                    feature_type: value.type_of_feature,
                    feature_name: value.name_of_feature,
                    description: value.description
                }
                formatted_data.push(entry);
            })
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
                            return `<a href="#" id="edit_monitoring_logs"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="remove_monitoring_logs"><i class="fas fa-minus-circle text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="add_moms_images"><i class="fas fa-upload text-center"></i></a>`;
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

    $('#moms_table tbody').on('click', '#remove_monitoring_logs', function () {
        let data = datatable.row($(this).parents('tr')).data();
        deleteMonitoringLogsConfirmation(data);
    });

    $('#moms_table tbody').on('click', '#add_moms_images', function () {
        let data = datatable.row($(this).parents('tr')).data();
        console.log(data)
        $("#addMomsImagesModal").modal({ backdrop: 'static', keyboard: false })
    });
}

function uploadMomsImages() {
    $("#upload_moms_images").click(function () {
        let url = "http://192.168.150.10:5000/api/moms/upload";
        // var formDataRaw = $('#moms_upload_form')[0];
        // var form_data = new FormData(formDataRaw);
        // $.ajax({
        //     type: 'POST',
        //     url: url,
        //     data: form_data,
        //     dataType: 'jsonp',
        //     contentType: false,
        //     cache: false,
        //     processData: false,
        //     async: false,
        //     success: function (data) {
        //         console.log(data);
        //     },
        //     error: function (data) {
        //         console.log(data);
        //     }
        // });
        var form_data = new FormData($('#moms_upload_form')[0]);
        $.ajax({
            type: 'POST',
            url: url,
            data: form_data,
            dataType: 'jsonp',
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                alert('Success!');
            },
        });
    });
}

function monitoringLogsMod(data) {
    $('#moms_id').val(data.moms_id);
    $('#moms_dt').val(data.date);
    $('#moms_t_feature').val(data.feature_name);
    $('#moms_n_feature').val(data.feature_type);
    $('#moms_description').val(data.description);
}

function initializeAddMonitoringLogs() {
    $("#add_moms_form").on("click", function () {
        $('#moms_id').val(0);
        $('#moms_dt').val("");
        $('#moms_t_feature').val("");
        $('#moms_n_feature').val("");
        $('#moms_description').val("");
        $("#add_monitoring_logs").text("Add");
        $("#surficial_data_modal").modal("show");
    })
}

function deleteMonitoringLogsConfirmation(data) {
    if (confirm('Are you sure you want to delete this entry?')) {
        deleteMonitoringLogs(data.moms_id);
    }
}

function deleteMonitoringLogs(moms_id) {
    let url = "http://192.168.150.10:5000/api/moms_data/delete_moms_data";
    let data = {
        "moms_id": moms_id
    }

    $.post(url, data).done(function (response) {
        alert(response.message);
        if (response.status == true) {
            $('#moms_table tbody').unbind();
            $('#moms_id').val(0);
            $('#moms_dt').val("");
            $('#moms_t_feature').val("");
            $('#moms_n_feature').val("");
            $('#moms_description').val("");
            initializeMonitoringLogs();
        }
    });
}

function initializeCRUDMonitoringLogs() {
    $('#add_monitoring_logs').on('click', function () {
        let url = "http://192.168.150.10:5000/api/surficial_data/save_monitoring_log";
        let data = {
            moms_id: $("#moms_id").val(),
            type_of_feature: $("#moms_t_feature").val(),
            description: $("#moms_description").val(),
            name_of_feature: $("#moms_n_feature").val()
        }

        $.post(url, data).done(function (response) {
            alert(response.message);
            if (response.status == true) {
                $('#moms_id').val(0);
                $('#moms_dt').val("");
                $('#moms_t_feature').val("");
                $('#moms_n_feature').val("");
                $('#moms_description').val("");
                $('#moms_table tbody').unbind();
                $("#add_monitoring_logs").text("Add");
                $("#surficial_data_modal").modal("hide");
                initializeMonitoringLogs();
            }
        });
    });
}

