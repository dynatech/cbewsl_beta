$(document).ready(function () {
    initializeSurficialData();
    initializeCurrentMeasurement();
    initializeAddMonitoringLogs();
    initializeCRUDMonitoringLogs();
    onUploadMOMSChange();
    // uploadMomsData();
    $('#cancel_add_field_survey').modal('hide');
    $('#moms_dt').datetimepicker();
    $('#observance_timestamp').datetimepicker();
    jQuery('#observance_ts').bind('keypress', function(e) {
        e.preventDefault(); 
    });
    initializeMomsFeatures();
});

function initializeMomsFeatures(){
    let url = 'http://192.168.1.10:5000/api/moms/get_moms_features';
    fetch(url).then((response) => response.json())
        .then((responseJson) => {
            let moms_features = responseJson;
            $("#moms_t_feature").empty();
            moms_features.forEach(function (value) {
                let feature_value = value.feature_value;
                $("#moms_t_feature").append('<option value="'+feature_value+'">'+value.feature_type+'</option>');
            })
        });
}

function initializeSurficialData() {
    $('#surficial-data-tab').on('click', function () {
        initializeMonitoringLogs();
        $(".surficial-measuremnt-container h5").text("Change");
        fetch('http://192.168.1.10:5000/api/surficial_data/get_surficial_data').then((response) => response.json())
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
                
                if(surficial_summary[0].moms_data.length != 0){let latest_moms_date = formatDateTime(surficial_summary[0].moms_data[0].date)
                    $(".surficial-measuremnt-container h5").text(last_data);
                    $(".moms-container").empty();
                    $(".moms-container").append("<h4 style='color: #717171'>Manifestations of movement</h4>");
                    $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Type of Feature: " + surficial_summary[0].moms_data[0].type_of_feature + "</p>");
                    $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Description: " + surficial_summary[0].moms_data[0].description + "</p>");
                    $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Name of Feature: " + surficial_summary[0].moms_data[0].name_of_feature + "</p>");
                    $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Latest Date Time: " + latest_moms_date.text_format_timestamp + "</p>");
                }else{
                    $(".surficial-measuremnt-container h5").text(last_data);
                    $(".moms-container").empty();
                    $(".moms-container").append("<h4 style='color: #717171'>Manifestations of movement</h4>");
                    $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>No latest manifestation of movements</p>");
                }
                
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
        fetch('http://192.168.1.10:5000/api/surficial_data/get_current_measurement').then((response) => response.json())
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


function inializeAddMomsForm(data, all_moms,count){
    let counter = count;
    $("#add_moms_forms").unbind();
    $("#add_moms_forms").on('click', function () {
        counter+=1;
        $("#moms_forms").append("<hr><label>Select Moms</label><select id='moms_data_"+counter+"' class='form-control'>"+
        "</select>")
        $("#moms_forms").append("<label for='number_of_members'>Observation Timestamp</label>"+
        "<div class='input-group date' id='observance_timestamp"+counter+"' data-target-input='nearest'>"+
        "<input type='text' class='form-control datetimepicker-input' data-target='#observance_timestamp"+counter+"' id='observance_ts_"+counter+"'/>"+
        "<div class='input-group-append' data-target='#observance_timestamp"+counter+"' data-toggle='datetimepicker'>"+
        "<div class='input-group-text'><i class='fa fa-calendar'></i></div>"+
        "</div></div>");
        $("#moms_forms").append("<label>Select alert level</label>"+
        "<select id='moms_alert_level_"+counter+"'' class='form-control .moms_alert_level'>"+
        "<option value='0'>Non-significant</option>"+
        "<option value='2'>Significant</option>"+
        "<option value='3'>Critical</option>"+
        "<select>");
        $("#moms_forms").append("<label>Remarks</label>"+
        "<textarea class='form-control .moms_remarks' id='moms_remarks_"+counter+"'' style='height : 100px'></textarea>");
        all_moms.forEach(function (value) {
            let moms_data_value = value.feature_type+"|"+value.feature_name;
            let moms_data_label = "Feature type: "+value.feature_type+" | Feature name: "+value.feature_name +" | Description: "+value.description;
            $("#moms_data_"+counter).append("<option value='"+moms_data_value+"'>"+moms_data_label+"</option>")
        });
        $("#moms_form_count").val(counter);

        jQuery('.datetimepicker-input').bind('keypress', function(e) {
            e.preventDefault(); 
        });
    });

    $("#clear_moms_forms").unbind();
    $("#clear_moms_forms").on('click', function () {
        $("#moms_forms").empty();
        counter = 0;
        $("#moms_form_count").val(0);
    });
}

function initializeMonitoringLogs() {
    $("#moms_forms").empty();
    $("#moms_form_count").val(0);
    $('#moms_table').empty();
    $('#moms_table').append("<thead>"+
    "<tr>"+
    "<th>Date Inserted</th>"+
    "<th>Observance Timestamp</th>"+
    "<th>Type of feature</th>"+
    "<th>Name of feature</th>"+
    "<th>Description</th>"+
    "<th>Actions</th>"+
    "</tr>"+
    "</thead>"+
    "<tfoot>"+
    "<tr>"+
    "<th>Date Inserted</th>"+
    "<th>Observance Timestamp</th>"+
    "<th>Type of feature</th>"+
    "<th>Name of feature</th>"+
    "<th>Description</th>"+
    "<th>Actions</th>"+
    "</tr>"+
    "</tfoot>");
    let formatted_data = []
    fetch('http://192.168.1.10:5000/api/surficial_data/get_moms_data').then((response) => response.json())
        .then((responseJson) => {
            responseJson.forEach(function (value) {
                let entry = {
                    moms_id: value.moms_id,
                    date: value.date,
                    date_updated: value.date_updated,
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
                    { "data": "date_updated" },
                    { "data": "feature_type" },
                    { "data": "feature_name" },
                    { "data": "description" },
                    {
                        render(data, type, full) {
                            // ${full.resources_and_capacities_id}
                            return `<a href="#" id="edit_monitoring_logs"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="remove_monitoring_logs"><i class="fas fa-minus-circle text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="add_moms_images"><i class="fas fa-upload text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="view_moms_images"><i class="fas fa-eye text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="release_moms">Raise&nbsp;<i class="fas fa-share text-center"></i></a>`;
                        }
                    }
                ]
            });

            initializeCRUDLogs(datatable, formatted_data);
        })
        .catch((error) => {
            console.log(error)
        });
}

function initializeCRUDLogs(datatable, all_moms) {
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
        uploadMomsData(data.moms_id);
    });

    $('#moms_table tbody').on('click', '#view_moms_images', function () {
        let data = datatable.row($(this).parents('tr')).data();
        displayMomsImages(data);
    });

    $('#moms_table tbody').on('click', '#release_moms', function () {
        let data = datatable.row($(this).parents('tr')).data();
        $("#add_moms_form").show();
        $("#clear_moms_form").show();
        displayRaiseMomsModal(data);
        $("#raiseMomsModalLabel").text("Raise Moms");
        $("#moms_forms").empty();
        $("#observance_ts").val("");
        $("#moms_remarks").val("");
        inializeAddMomsForm(data, all_moms, 0);
    });
}


function monitoringLogsMod(data) {
    $('#moms_id').val(data.moms_id);
    $('#moms_dt').val(data.date);
    $('#moms_t_feature').val(data.feature_type);
    $('#moms_n_feature').val(data.feature_name);
    $('#moms_description').val(data.description);
}

function initializeAddMonitoringLogs() {
    $("#add_moms_form").on("click", function () {
        $('#moms_id').val(0);
        $('#moms_dt').val("");
        $('#moms_date_time').val("");
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
    let url = "http://192.168.1.10:5000/api/moms_data/delete_moms_data";
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
        let url = "http://192.168.1.10:5000/api/surficial_data/save_monitoring_log";
        let date_picker = $("#moms_date_time").val();
        let formatted_datetime = moment(date_picker).format('YYYY-MM-DD H:mm:ss')
        let type_of_feature_field = $("#moms_t_feature").val();
        let description_field = $("#moms_description").val();
        let name_of_feature = $("#moms_n_feature").val();
    
        let data = {
            moms_id: $("#moms_id").val(),
            type_of_feature: type_of_feature_field,
            description: description_field,
            name_of_feature: name_of_feature,
            timestamp: formatted_datetime,
            observance_ts: formatted_datetime
        }
        if(type_of_feature_field != "" && name_of_feature != "" && description_field != ""){
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
        }else{
            alert("All fields are required");
        }
    });

    $('#cancel_monitoring_logs').on('click', function () {
        $("#surficial_data_modal").modal("hide")
    });
}


function onUploadMOMSChange() {
    $("#moms_image").change(function (e) {
        if (this.disabled) {
            return alert('File upload not supported!');
        }
        let FILES = this.files;
        if (FILES && FILES[0]) {
            for (let i = 0; i < FILES.length; i++) {
                readMomsImages(FILES[i]);
            }
        }
    });
}

function readMomsImages(file) {
    let reader = new FileReader();
    let image = new Image();
    $('#momsUploadPreview').empty();
    reader.readAsDataURL(file);
    reader.onload = function (_file) {
        image.src = _file.target.result; // url.createObjectURL(file);
        image.onload = function () {
            let w = this.width,
                h = this.height,
                t = file.type, // ext only: // file.type.split('/')[1],
                n = file.name,
                s = ~~(file.size / 1024) + 'KB';
            $('#momsUploadPreview').append('<img src="' + this.src + '" class="img-thumbnail" height="200px" width="200px">');
        };

        image.onerror = function () {
            alert('Invalid file type: ' + file.type);
        };
    };

}

function uploadMomsData(moms_id) {
    $("#addMomsImagesModal").modal({ backdrop: 'static', keyboard: false })
    $('#upload_moms_images').unbind();
    $('#moms_image').val('');
    $('#momsUploadPreview').empty();
    $('#upload_moms_images').on('click', function (e) {
        $("#moms_upload_status").hide();
        $("#upload_spinner").show();
        $("#upload_buttons").hide();
        e.preventDefault();
        if ($('#moms_image').val() == '') {
            alert("Please Select the File");
            $("#upload_spinner").hide();
            $("#upload_buttons").show();
        }
        else {
            let form_data = new FormData();
            let ins = document.getElementById('moms_image').files.length;
            for (let x = 0; x < ins; x++) {
                form_data.append("files[]", document.getElementById('moms_image').files[x]);
            }
            $.ajax({
                url: "http://cbewsl.com/dashboard/uploadMomsImages/" + moms_id,
                method: "POST",
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                dataType: "json",
                success: function (response) {
                    if (response.status == true) {
                        $('#moms_image').val('');
                        $('#momsUploadPreview').empty();
                        $("#moms_upload_status").text(response.message);

                        $("#upload_spinner").hide();
                        $("#upload_buttons").show();
                    }
                    else if (response.status == false) {
                        $("#moms_upload_status").text(response.message);

                        $("#upload_spinner").hide();
                        $("#upload_buttons").show();
                    }
                }
            });
        }
    });
}

function displayMomsImages(data) {
    let moms_id = data.moms_id;
    $("#view_moms_modal").modal({ backdrop: 'static', keyboard: false });
    $("#moms_details").empty();
    $("#moms_image_container").empty();
    $("#moms_details").append("<b>Type of Feature:</b>" + data.feature_type + "<br>");
    $("#moms_details").append("<b>Name of Feature:</b>" + data.feature_name + "<br>");
    $("#moms_details").append("<b>Description:</b>" + data.description + "<br>");

    $.ajax({
        url: "http://cbewsl.com/dashboard/get_moms_files/" + moms_id,
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
            $("#moms_image_container").append("<b>Loading images. . . .  Please wait</b>");
        }
    }).done(function (response) {
        let data = JSON.parse(response);
        if (data.status == true) {
            $("#moms_image_container").empty();
            let files = data.files;
            $.each(files, function (key, value) {
                let file_name = value;
                let file_source = "http://cbewsl.com/uploads/moms/" + moms_id + "/" + file_name;
                $("#moms_image_container").append("<a href='" + file_source + "' target='_blank'><img src='" + file_source + "' alt='" + file_name + "' class='img-thumbnail' height='200px' width='200px'></a>");
            });

        } else {
            $("#moms_image_container").empty();
            $("#moms_image_container").append("<b>No uploaded images.</b>");
        }
    });
}

function displayRaiseMomsModal(data) {
    $("#raise_moms_modal").modal("show");
    let selected_feature_name = data.feature_name;
    let selected_feature_type = data.feature_type;
    let selected_feature_description = data.description;
    $("#current_moms_selected").empty();
    $("#current_moms_selected").append("<b>Type of feature:</b> "+selected_feature_type+ "<br>");
    $("#current_moms_selected").append("<b>Name of feature:</b> "+selected_feature_name+ "<br>");
    $("#current_moms_selected").append("<b>Description:</b> "+selected_feature_description+ "<br><br>");

    $('#raise_moms').unbind();
    $('#raise_moms').on('click', function () {
        let moms_forms_count = $("#moms_form_count").val();
        let alert_level = $("#moms_alert_level").val();
        let alert_validity = ""
        let int_sym = ""
        let date_picker = $("#observance_ts").val();
        let formatted_datetime = moment(date_picker).format('YYYY-MM-DD HH:mm:ss')

        let current_date = moment(new Date()).format("YYYY-MM-DD H:mm:ss");
        let compare_date = moment(current_date).isSameOrAfter(formatted_datetime);
        if(compare_date == false){
            alert('Unable to add future date and time');
        }else{
            let moms_collection = []
            
            if (alert_level == "2") {
                int_sym = "m2"
                alert_validity = moment(data.date).add(24, 'hours').format("YYYY-MM-DD HH:mm:00")
            } else if (alert_level == "3") {
                int_sym = "m3"
                alert_validity = moment(data.date).add(48, 'hours').format("YYYY-MM-DD HH:mm:00")
            } else {
                int_sym = "m0"
            }
    
            
    
            let trigger_list = {
                alert_validity: alert_validity.toString(),
                data_ts: formatted_datetime,
                user_id: 1,
                trig_list: [
                    {
                        alert_level: alert_level,
                        observance_ts: formatted_datetime,
                        int_sym: int_sym,
                        remarks: $("#moms_remarks").val(),
                        f_name: data.feature_name,
                        f_type: data.feature_type
                    }
                ]
            }
            moms_collection.push(trigger_list);
            for (i = 1; i <= moms_forms_count; i++) {
                let moms_data = $("#moms_data_"+i).val();
                let moms = moms_data.split("|")
                let moms_observance_ts = $("#observance_ts_"+i).val();
                let moms_formatted_datetime = moment(moms_observance_ts).format('YYYY-MM-DD HH:mm:ss');
                let moms_alert_validity = ""
                let moms_int_sym = ""
                let moms_remarks = $("#moms_remarks_"+i).val();
                let moms_alert_level = $("#moms_alert_level_"+i).val();
                if (moms_alert_level == "2") {
                    moms_int_sym = "m2"
                    moms_alert_validity = moment(moms_formatted_datetime).add(24, 'hours').format("YYYY-MM-DD HH:mm:00")
                } else if (moms_alert_level == "3") {
                    moms_int_sym = "m3"
                    moms_alert_validity = moment(moms_formatted_datetime).add(48, 'hours').format("YYYY-MM-DD HH:mm:00")
                } else {
                    moms_int_sym = "m0"
                }

                let hour = moment(alert_validity).hours()
                if (hour >= 0 && hour < 4) {
                    moms_alert_validity = moment(moms_alert_validity).format("YYYY-MM-DD 04:00:00")
                } else if (hour >= 4 && hour < 8) {
                    moms_alert_validity = moment(moms_alert_validity).format("YYYY-MM-DD 08:00:00")
                } else if (hour >= 8 && hour < 12) {
                    moms_alert_validity = moment(moms_alert_validity).format("YYYY-MM-DD 12:00:00")
                } else if (hour >= 12 && hour < 16) {
                    moms_alert_validity = moment(moms_alert_validity).format("YYYY-MM-DD 16:00:00")
                } else if (hour >= 16 && hour < 20) {
                    moms_alert_validity = moment(moms_alert_validity).format("YYYY-MM-DD 20:00:00")
                } else if (hour >= 20) {
                    moms_alert_validity = moment(moms_alert_validity).format("YYYY-MM-DD 00:00:00")
                }
                
                moms_collection[0].trig_list.push({
                    alert_level: moms_alert_level,
                    observance_ts: moms_formatted_datetime,
                    int_sym: moms_int_sym,
                    remarks: moms_remarks,
                    f_name: moms[1],
                    f_type: moms[0]
                })
            }
            let trig_list_collection = moms_collection[0].trig_list
            let final_trig_list_collection = [];
            const map = new Map();
            for (const item of trig_list_collection) {
                if(!map.has(item.f_name) && !map.has(item.f_type) && !map.has(item.alert_level)){
                    map.set(item.f_name, true);    // set any value to Map
                    final_trig_list_collection.push({
                        alert_level: item.alert_level,
                        observance_ts: item.observance_ts,
                        int_sym: item.int_sym,
                        remarks: item.remarks,
                        f_name: item.f_name,
                        f_type: item.f_type
                    });
                }
            }
            let has_same_timestamp = false;
            let has_blank_remarks = false;
            let has_blank_timestamp = false;
            let observance_timestamp_collections = [];
            $.each(final_trig_list_collection, function (key, value) {
                let remarks = value.remarks;
                let observance_ts = value.observance_ts;
                let obs_ts_checker  = observance_timestamp_collections.includes(observance_ts);
                if(has_blank_timestamp == false){
                    if(observance_ts == "Invalid date"){
                        has_blank_timestamp = true;
                    }
                }
                
                if(has_same_timestamp == false){
                    if(obs_ts_checker == false){
                        observance_timestamp_collections.push(observance_ts);
                    }else{
                        has_same_timestamp = true;
                    }
                }

                let remarks_checker = isBlank(remarks);
                if(has_blank_remarks == false){
                    if(remarks_checker == true){
                        has_blank_remarks = true;
                    }
                }
            });
            let validation_message = "";
            if(has_same_timestamp == true || has_blank_remarks == true || has_blank_timestamp == true ){
                validation_message += "Please check the following:\n"
            }
            if(has_same_timestamp == true){
                validation_message += "-Same observation timestamp.\n";
            }
            if(has_blank_remarks == true){
                validation_message += "-Blank/empty remarks.\n";
            }
            if(has_blank_timestamp == true){
                validation_message += "-Blank or Empty observation timestamp.\n";
            }
            if(validation_message != ""){
                alert(validation_message);
            }else{
                moms_collection[0].trig_list = final_trig_list_collection;
                let moms_data = {
                    moms_id: data.moms_id,
                    type_of_feature: data.feature_type,
                    description: data.description,
                    name_of_feature: data.feature_name,
                    timestamp: data.date,
                    observance_ts: formatted_datetime
                }

                let url = 'http://192.168.1.10:5000/api/monitoring/insert_cbewsl_moms_ewi_web2';
                isOnSet(alert_level)
                    .then((response) => {
                        fetch(url, {
                            method: 'POST',
                            dataType: 'jsonp',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(moms_collection),
                        }).then((responseJson) => {
                            $("#moms_forms").empty();
                            $("#raise_moms_modal").modal("hide");
                            $("#observance_ts").val("");
                            $("#moms_remarks").val("");
                            if(int_sym == "m0"){
                                publicAlert()
                                alert("Successfuly comfirmed MOMs.");
                            }else{
                                publicAlert(true);
                                alert("Successfuly raised MOMs.");
                            }
                            updateObservanceTs(moms_data);
                            $("#moms_forms").empty();
                            $("#moms_form_count").val(0);
                            initializeMonitoringLogs();
                            $("body > ul > li:nth-child(6) > a").trigger("click")
                        });
                    })
            }
            
        }
        
    });
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function updateObservanceTs(moms_data){
    let url = "http://192.168.1.10:5000/api/surficial_data/save_monitoring_log";
    $.post(url, moms_data).done(function (response) {
        console.log("Updated observance timestamp");
    });
}

function isOnSet(moms_alert_level) {
    let candidate_alerts = updateEwiData();
    return candidate_alerts.then(function (data) {
        let json_data = JSON.parse(data);
        const { leo: { overdue, latest } } = json_data;

        const merged_arr = [...latest, ...overdue];

        let public_alert_level = 0;
        if (merged_arr.length !== 0) {
            const [current_alert] = merged_arr;
            const { public_alert_symbol: { alert_level } } = current_alert;
            public_alert_level = alert_level;
        }

        if (moms_alert_level > public_alert_level) {
            return true;
        } else {
            return false;
        }
    });
}
