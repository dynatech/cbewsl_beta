$(document).ready(function () {
    getAllHazardData();
});

function getAllHazardData() {
    $.ajax({
        url: "http://192.168.150.191:5000/api/hazard_data/get_all_hazard_data",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let hazard_data = JSON.parse(data)
        $('#hazard_data_table').DataTable({
            "data": hazard_data,
            "columns": [
                { "data": "hazard" },
                { "data": "speed_of_onset" },
                { "data": "early_warning" },
                { "data": "impact" },
                {
                    render(data, type, full) {
                        // ${full.hazard_data_id}
                        return `<i class="fas fa-pencil-alt text-center"></i>&nbsp;&nbsp;&nbsp;&nbsp;</i><i class="fas fa-minus-circle text-center"></i>`;
                    }
                }
            ]
        });
        $('#hazard_data_main_table').DataTable({
            "data": hazard_data,
            "columns": [
                { "data": "hazard" },
                { "data": "speed_of_onset" },
                { "data": "early_warning" },
                { "data": "impact" }
            ]
        });
    });
}

