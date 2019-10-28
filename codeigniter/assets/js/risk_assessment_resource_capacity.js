$(document).ready(function () {
    getAllResourcesAndCapacity();
    saveRNC();
});

function getAllResourcesAndCapacity() {
    $.ajax({
        url: "http://192.168.1.10:5000/api/resources_and_capacities/get_all_resources_and_capacities",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let rnc_data = JSON.parse(data)
        let table = $('#resources_and_capacities_table').DataTable({
            "data": rnc_data,
            "bDestroy": true,
            "columns": [
                { "data": "resource_and_capacity" },
                { "data": "status" },
                { "data": "owner" },
                {
                    render(data, type, full) {
                        return `<a href="#resources_and_capacities" id="edit_rnc"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#resources_and_capacities" id="remove_rnc"><i class="fas fa-minus-circle text-center"></i></a>`;
                    }
                }
            ]
        });

        RESOURCE_AND_CAPACITIES_DATA = rnc_data

        $('#resources_and_capacities_table tbody').on('click', '#edit_rnc', function () {
            let data = table.row($(this).parents('tr')).data();
            setRNCDataForm(data);
            $("#add_resources_capacity").text("Update");
        });

        $('#resources_and_capacities_table tbody').on('click', '#remove_rnc', function () {
            let data = table.row($(this).parents('tr')).data();
            deleteRNCConfirmation(data);
        });


        $('#resources_and_capacities_main_table').DataTable({
            "data": rnc_data,
            "bDestroy": true,
            "columns": [
                { "data": "resource_and_capacity" },
                { "data": "status" },
                { "data": "owner" }
            ]
        });
    });
}

function setRNCDataForm(data) {
    $("#resources_and_capacities_id").val(data.resources_and_capacities_id);
    $("#resources_capacity").val(data.resource_and_capacity);
    $("#status").val(data.status);
    $("#owner").val(data.owner);
}

function saveRNC() {
    $("#add_resources_capacity").click(function () {
        $("#add_resources_capacity_spinner").show();
        $("#add_resources_capacity").hide();
        let url = "http://192.168.1.10:5000/api/resources_and_capacities/save_resources_and_capacities";
        let resource_and_capacity_field = $("#resources_capacity").val();
        let status_field = $("#status").val();
        let owner_field = $("#owner").val();
        let data = {
            resources_and_capacities_id: $("#resources_and_capacities_id").val(),
            resource_and_capacity: resource_and_capacity_field,
            status: status_field,
            owner: owner_field
        }

        if(resource_and_capacity_field != "" && status_field != "" && owner_field != ""){
            $.post(url, data).done(function (response) {
                alert(response.message);
                if (response.status == true) {
                    $("#add_resources_capacity_spinner").hide();
                    $("#add_resources_capacity").show();
                    $("#resources_and_capacities_id").val(0);
                    $("#resources_capacity").val("");
                    $("#status").val("");
                    $("#owner").val("");
                    $("#add_resources_capacity").text("Add");
                    $('#resources_and_capacities_table tbody').unbind();
                    getAllResourcesAndCapacity();
                }
            });
        }else{
            $("#add_resources_capacity_spinner").hide();
            $("#add_resources_capacity").show();
            alert("All fields are required");
        }
    });
}

function deleteRNCConfirmation(data) {

    if (confirm('Are you sure you want to delete this entry?')) {
        deleteRNC(data.resources_and_capacities_id);
    } else {
        $('#risk_profile_table tbody').unbind();
    }

}

function deleteRNC(resources_and_capacities_id) {
    let url = "http://192.168.1.10:5000/api/resources_and_capacities/delete_resources_and_capacities";
    let data = {
        "resources_and_capacities_id": resources_and_capacities_id
    }

    $.post(url, data).done(function (response) {
        alert(response.message);
        if (response.status == true) {
            $('#resources_and_capacities_table tbody').unbind();
            $("#resources_and_capacities_id").val(0);
            $("#resources_capacity").val("");
            $("#status").val("");
            $("#owner").val("");
            getAllResourcesAndCapacity();
        }
    });
}

