$(document).ready(function () {
    getAllResourcesAndCapacity();
});

function getAllResourcesAndCapacity() {
    $.ajax({
        url: "http://192.168.150.191:5000/api/resources_and_capacities/get_all_resources_and_capacities",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let hazard_data = JSON.parse(data)
        $('#resources_and_capacities_table').DataTable({
            "data": hazard_data,
            "columns": [
                { "data": "resource_and_capacity" },
                { "data": "status" },
                { "data": "owner" },
                {
                    render(data, type, full) {
                        // ${full.resources_and_capacities_id}
                        return `<i class="fas fa-pencil-alt text-center"></i>&nbsp;&nbsp;&nbsp;&nbsp;</i><i class="fas fa-minus-circle text-center"></i>`;
                    }
                }
            ]
        });
        $('#resources_and_capacities_main_table').DataTable({
            "data": hazard_data,
            "columns": [
                { "data": "resource_and_capacity" },
                { "data": "status" },
                { "data": "owner" }
            ]
        });
    });
}

