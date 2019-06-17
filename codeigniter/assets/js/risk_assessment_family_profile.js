$(document).ready(function () {
    getAllFamilyRiskProfile();
});

function getAllFamilyRiskProfile() {
    $.ajax({
        url: "http://192.168.150.191:5000/api/family_profile/get_all_family_profile",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let hazard_data = JSON.parse(data)
        $('#family_risk_profile_table').DataTable({
            "data": hazard_data,
            "columns": [
                { "data": "family_profile_id" },
                { "data": "members_count" },
                { "data": "vulnerable_members_count" },
                { "data": "vulnerability_nature" },
                {
                    render(data, type, full) {
                        // ${full.resources_and_capacities_id}
                        return `<i class="fas fa-pencil-alt text-center"></i>&nbsp;&nbsp;&nbsp;&nbsp;</i><i class="fas fa-minus-circle text-center"></i>`;
                    }
                }
            ]
        });
        $('#family_risk_profile_main_table').DataTable({
            "data": hazard_data,
            "columns": [
                { "data": "family_profile_id" },
                { "data": "members_count" },
                { "data": "vulnerable_members_count" },
                { "data": "vulnerability_nature" }
            ]
        });
    });
}

