$(document).ready(function () {
    getAllHazardData();
    saveHazardData();
});

function getAllHazardData() {
    $.ajax({
        url: "http://192.168.150.10:5000/api/hazard_data/get_all_hazard_data",
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
                        // ${full.resources_and_capacities_id}
                        return `<a href="#hazard_data" id="edit_hazard_data"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#hazard_data" id="remove_hazard_data"><i class="fas fa-minus-circle text-center"></i></a>`;
                    }
                }
            ]
        });

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

function setHazardDataForm(data) {
    $("#hazard_data_id").val(data.hazard_data_id);
    $("#hazard").val(data.hazard);
    $("#speed_of_onset").val(data.speed_of_onset);
    $("#early_warning").val(data.early_warning);
    $("#impact").val(data.impact);
}

function saveHazardData() {
    $("#add_hazard_data").click(function () {
        let url = "http://192.168.150.10:5000/api/hazard_data/save_hazard_data";
        let data = {
            hazard_data_id: $("#hazard_data_id").val(),
            hazard: $("#hazard").val(),
            speed_of_onset: $("#speed_of_onset").val(),
            early_warning: $("#early_warning").val(),
            impact: $("#impact").val()
        }

        $.post(url, data).done(function (response) {
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
    let url = "http://192.168.150.10:5000/api/hazard_data/delete_hazard_data";
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

