$(document).ready(function () {
    getAllFamilyRiskProfile();
    getRiskProfile();
    saveRiskProfile();
    saveFamilyRisk();
});

function getAllFamilyRiskProfile() {
    $.ajax({
        url: "http://192.168.1.10:5000/api/family_profile/get_all_family_profile",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let family_profile_data = JSON.parse(data)
        let table = $('#family_risk_profile_table').DataTable({
            dom: 'Bfrtip',
            buttons: [
                {
                    text: 'My button',
                    action: function (e, dt, node, config) {
                        alert('Button activated');
                    }
                }
            ],
            "data": family_profile_data,
            "bDestroy": true,
            "columns": [
                { "data": "family_profile_id" },
                { "data": "members_count" },
                { "data": "vulnerable_members_count" },
                { "data": "vulnerability_nature" },
                {
                    render(data, type, full) {
                        // ${full.resources_and_capacities_id}
                        return `<a href="#family_risk_profile" id="edit_family_risk"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#family_risk_profile" id="remove_family_risk"><i class="fas fa-minus-circle text-center"></i></a>`;
                    }
                }
            ]
        });
        FAMILY_RISK_PROFILE_DATA = family_profile_data
        $('#family_risk_profile_table tbody').on('click', '#edit_family_risk', function () {
            let data = table.row($(this).parents('tr')).data();
            setFamilyRiskDataForm(data);
            $("#add_family_risk").text("Update");
        });

        $('#family_risk_profile_table tbody').on('click', '#remove_family_risk', function () {
            let data = table.row($(this).parents('tr')).data();
            deleteFamilyRiskConfirmation(data);
        });

        $('#family_risk_profile_main_table').DataTable({
            "data": family_profile_data,
            "bDestroy": true,
            "columns": [
                { "data": "family_profile_id" },
                { "data": "members_count" },
                { "data": "vulnerable_members_count" },
                { "data": "vulnerability_nature" }
            ]
        });
    });
}

function getRiskProfile() {
    $.ajax({
        url: "http://192.168.1.10:5000/api/family_profile/get_all_risk_profile",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let risk_profile_data = JSON.parse(data);
        if (risk_profile_data.length != 0) {
            $("#current_risk_profile").text(risk_profile_data[0].entry);
        } else {
            $("#current_risk_profile").text("No latest entry");
        }

        let table = $('#risk_profile_table').DataTable({
            "data": risk_profile_data,
            "bDestroy": true,
            "columns": [
                { "data": "timestamp" },
                { "data": "entry" },
                {
                    render(data, type, full) {
                        // ${full.resources_and_capacities_id}
                        return `<a href="#risk_profile" id="edit_risk_profile"><i class="fas fa-pencil-alt text-center"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#risk_profile" id="remove_risk_profile"><i class="fas fa-minus-circle text-center"></i></a>`;
                    }
                }
            ]
        });
        RISK_PROFILE_DATA = risk_profile_data
        $('#risk_profile_table tbody').on('click', '#edit_risk_profile', function () {
            let data = table.row($(this).parents('tr')).data();
            setRiskProfileDataForm(data);
            $("#add_risk_profile").text("Update");
        });

        $('#risk_profile_table tbody').on('click', '#remove_risk_profile', function () {
            let data = table.row($(this).parents('tr')).data();
            deleteRiskConfirmation(data);
        });
    });
}


function setRiskProfileDataForm(data) {
    $("#risk_profile_id").val(data.risk_profile_id);
    $("#entry").val(data.entry);
}

function setFamilyRiskDataForm(data) {
    $("#family_profile_id").val(data.family_profile_id);
    $("#number_of_members").val(data.members_count);
    $("#number_of_vulnerable").val(data.vulnerable_members_count);
    $("#nature_of_vulnerability").val(data.vulnerability_nature);
}

function saveFamilyRisk() {
    $("#add_family_risk").click(function () {
        let url = "http://192.168.1.10:5000/api/family_profile/save_family_profile";
        let data = {
            family_profile_id: $("#family_profile_id").val(),
            members_count: $("#number_of_members").val(),
            vulnerable_members_count: $("#number_of_vulnerable").val(),
            vulnerability_nature: $("#nature_of_vulnerability").val()
        }

        $.post(url, data).done(function (response) {
            alert(response.message);
            if (response.status == true) {
                $("#family_profile_id").val(0);
                $("#number_of_members").val("");
                $("#number_of_vulnerable").val("");
                $("#nature_of_vulnerability").val("");
                $("#add_family_risk").text("Add");
                $('#family_risk_profile_table tbody').unbind();
                getAllFamilyRiskProfile();
            }
        });
    });
}

function saveRiskProfile() {
    $("#add_risk_profile").click(function () {
        let url = "http://192.168.1.10:5000/api/family_profile/save_risk_profile";
        let data = {
            risk_profile_id: $("#risk_profile_id").val(),
            entry: $("#entry").val()
        }

        $.post(url, data).done(function (response) {
            alert(response.message);
            if (response.status == true) {
                $("#risk_profile_id").val(0);
                $("#entry").val("");
                $("#add_risk_profile").text("Add");
                $('#risk_profile_table tbody').unbind();
                getRiskProfile();
            }
        });
    });
}

function deleteRiskConfirmation(data) {

    if (confirm('Are you sure you want to delete this entry?')) {
        deleteRiskProfile(data.risk_profile_id);
    } else {
        $('#risk_profile_table tbody').unbind();
    }

}

function deleteFamilyRiskConfirmation(data) {
    if (confirm('Are you sure you want to delete this entry?')) {
        deleteFamilyRisk(data.family_profile_id);
    } else {
        $('#family_risk_profile_table tbody').unbind();
    }
}

function deleteFamilyRisk(family_profile_id) {
    let url = "http://192.168.1.10:5000/api/family_profile/delete_family_profile";
    let data = {
        "family_profile_id": family_profile_id
    }

    $.post(url, data).done(function (response) {
        alert(response.message);
        if (response.status == true) {
            $('#family_risk_profile_table tbody').unbind();
            $("#family_profile_id").val(0);
            $("#number_of_members").val("");
            $("#number_of_vulnerable").val("");
            $("#nature_of_vulnerability").val("");
            getAllFamilyRiskProfile();
        }
    });
}

function deleteRiskProfile(risk_profile_id) {
    let url = "http://192.168.1.10:5000/api/family_profile/delete_risk_profile";
    let data = {
        "risk_profile_id": risk_profile_id
    }

    $.post(url, data).done(function (response) {
        alert(response.message);
        if (response.status == true) {
            $('#risk_profile_table tbody').unbind();
            $("#risk_profile_id").val(0);
            $("#entry").val("");
            getRiskProfile();
        }
    });
}




