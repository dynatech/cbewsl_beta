$(document).ready(function () {
    getAllHazardData();
    getAllHazardMapData();
    saveHazardData();
    onUploadHazardMapChange();
    uploadHazardMap();
});

function getAllHazardData() {
    $.ajax({
        url: "http://192.168.1.10:5000/api/hazard_data/get_all_hazard_data",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let hazard_data = JSON.parse(data)
        let table = $('#hazard_data_table').DataTable({
            "data": hazard_data,
            "bDestroy": true,
            "columns": [
                { "data": "hazard" },
                { "data": "speed_of_onset" },
                { "data": "early_warning" },
                { "data": "impact" },
                {
                    render(data, type, full) {
                        return `<a href="#hazard_data" id="edit_hazard_data"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#hazard_data" id="remove_hazard_data"><i class="fas fa-minus-circle text-center"></i></a>`;
                    }
                }
            ]
        });
        HAZARD_DATA = hazard_data;
        $('#hazard_data_table tbody').on('click', '#edit_hazard_data', function () {
            let data = table.row($(this).parents('tr')).data();
            setHazardDataForm(data);
            $("#add_hazard_data").text("Update");
        });

        $('#hazard_data_table tbody').on('click', '#remove_hazard_data', function () {
            let data = table.row($(this).parents('tr')).data();
            deleteHazardDataConfirmation(data);
        });

        $('#hazard_data_main_table').DataTable({
            "data": hazard_data,
            "bDestroy": true,
            "columns": [
                { "data": "hazard" },
                { "data": "speed_of_onset" },
                { "data": "early_warning" },
                { "data": "impact" }
            ]
        });
    });
}

function getAllHazardMapData() {
    $.ajax({
        url: "http://192.168.1.10:5000/api/hazard_data/get_all_hazard_map_data",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let response_data = JSON.parse(data);
        if (response_data[0].path) {
            $("#latest_hazard_map_preview").empty();
            $("#latest_hazard_map_preview").append('<img src="http://cbewsl.com' + response_data[0].path + '" class="img-fluid" alt="Latest hazard map" style="width: 100 % ">');
        }
        hazard_map_data = []
        $.each(response_data, function (key, value) {
            let formatted_datetime = formatDateTime(value.timestamp);
            hazard_map_data.push({
                "date_time": formatted_datetime["text_format_timestamp"],
                "file_name": "hazard_map_" + value.hazard_map_id,
                "link": "http://cbewsl.com" + value.path
            });
        });
        let table = $('#hazard_map_table').DataTable({
            "data": hazard_map_data,
            "bDestroy": true,
            "columns": [
                { "data": "date_time" },
                { "data": "file_name" },
                {
                    render(data, type, full) {
                        // ${full.resources_and_capacities_id}
                        return `<a href="#hazard_data" id="edit_hazard_map"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#hazard_map" id="remove_hazard_map"><i class="fas fa-minus-circle text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="${full.link}"  target="_blank" id="view_hazard_map"><i class="fas fa-eye text-center"></i></a>`;
                    }
                }
            ]
        });
        $('#hazard_map_table tbody').on('click', '#edit_hazard_map', function () {
            let data = table.row($(this).parents('tr')).data();
            // setHazardDataForm(data);
            // $("#add_hazard_data").text("Update");
        });

        $('#hazard_map_table tbody').on('click', '#remove_hazard_map', function () {
            let data = table.row($(this).parents('tr')).data();
            // deleteHazardDataConfirmation(data);
        });

    });
}

function setHazardDataForm(data) {
    $("#hazard_data_id").val(data.hazard_data_id);
    $("#hazard").val(data.hazard);
    $("#speed_of_onset").val(data.speed_of_onset);
    $("#early_warning").val(data.early_warning);
    $("#impact").val(data.impact);
}

function saveHazardData() {
    $("#add_hazard_data").click(function () {
        $("#add_hazard_data_spinner").show();
        $("#add_hazard_data").hide();
        let url = "http://192.168.1.10:5000/api/hazard_data/save_hazard_data";
        let hazard_data_id_field = $("#hazard_data_id").val();
        let hazard_field = $("#hazard").val();
        let speed_of_onset_field = $("#speed_of_onset").val();
        let early_warning_field = $("#early_warning").val();
        let impact_field = $("#impact").val();
        let data = {
            hazard_data_id: hazard_data_id_field,
            hazard: hazard_field,
            speed_of_onset: speed_of_onset_field,
            early_warning: early_warning_field,
            impact: impact_field
        }

        if(hazard_field != "" && speed_of_onset_field != "" && early_warning_field != "" && impact_field != ""){
            $.post(url, data).done(function (response) {
                $("#add_hazard_data_spinner").hide();
                $("#add_hazard_data").show();
                alert(response.message);
                if (response.status == true) {
                    $("#hazard_data_id").val(0);
                    $("#hazard").val("");
                    $("#speed_of_onset").val("");
                    $("#early_warning").val("");
                    $("#impact").val("");
                    $("#add_hazard_data").text("Add");
                    $('#hazard_data_table tbody').unbind();
                    getAllHazardData();
                }
            });
        }else{
            $("#add_hazard_data_spinner").hide();
            $("#add_hazard_data").show();
            alert("All fields are required.");
        }

        
    });
}

function deleteHazardDataConfirmation(data) {
    if (confirm('Are you sure you want to delete this entry?')) {
        deleteHazardData(data.hazard_data_id);
    } else {
        $('#hazard_data_table tbody').unbind();
    }
}

function deleteHazardData(hazard_data_id) {
    let url = "http://192.168.1.10:5000/api/hazard_data/delete_hazard_data";
    let data = {
        "hazard_data_id": hazard_data_id
    }

    $.post(url, data).done(function (response) {
        alert(response.message);
        if (response.status == true) {
            $('#hazard_data_table tbody').unbind();
            $("#hazard_data_id").val(0);
            $("#hazard").val("");
            $("#speed_of_onset").val("");
            $("#early_warning").val("");
            $("#impact").val("");
            getAllHazardData();
        }

    });
}


function onUploadHazardMapChange() {
    $("#image_file").change(function (e) {
        if (this.disabled) {
            return alert('File upload not supported!');
        }
        let FILES = this.files;
        if (FILES && FILES[0]) {
            for (let i = 0; i < FILES.length; i++) {
                readImage(FILES[i]);
            }
        }
    });

    $("#open_hazard_data_modal").click(function (e) {
        $("#image_file").val("");
        $("#uploadPreview").empty();
    });
}

function readImage(file) {
    let reader = new FileReader();
    let image = new Image();
    $('#uploadPreview').empty();
    reader.readAsDataURL(file);
    reader.onload = function (_file) {
        image.src = _file.target.result; // url.createObjectURL(file);
        image.onload = function () {
            let w = this.width,
                h = this.height,
                t = file.type, // ext only: // file.type.split('/')[1],
                n = file.name,
                s = ~~(file.size / 1024) + 'KB';
            $('#uploadPreview').append('<img src="' + this.src + '" class="img-thumbnail" height="200px" width="200px">');
        };

        image.onerror = function () {
            alert('Invalid file type: ' + file.type);
        };
    };

}

function uploadHazardMap() {

    $("#upload_hazard_map_spinner").hide();
    $('#save_hazard_map').on('click', function (e) {
        $("#upload_hazard_map_spinner").show();
        $("#save_hazard_map").hide();
        $("#upload_status").text("Uploading. . . . . Please wait.");
        e.preventDefault();
        if ($('#image_file').val() == '') {
            alert("Please Select the File");
            $("#upload_status").text("");
            $("#upload_hazard_map_spinner").hide();
            $("#save_hazard_map").show();
        } else {
            let form_data = new FormData();
            let ins = document.getElementById('image_file').files.length;
            for (let x = 0; x < ins; x++) {
                form_data.append("files[]", document.getElementById('image_file').files[x]);
            }
            $.ajax({
                url: "http://cbewsl.com/dashboard/uploadHazardMap",
                method: "POST",
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                dataType: "json",
                success: function (response) {
                    if (response.status == true) {
                        $('#image_file').val('');
                        $('#uploadPreview').empty();
                        $("#upload_status").text(response.message);
                        getAllHazardMapData();
                    }
                    else if (response.status == false) {
                        $("#upload_status").text(response.message);
                    }

                    $("#upload_hazard_map_spinner").hide();
                    $("#save_hazard_map").show();
                }
            });
        }
    });
}