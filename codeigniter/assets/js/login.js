$(document).ready(function () {
    getLoginSession()
    initializeLogin();
});

function getLoginSession() {
    let credentials = localStorage.getItem("login_credentials");
    let status = false
    if (credentials != null | credentials != undefined) {
        window.location.href = 'http://cbewsl/dashboard';
        status = true
    } else {
        window.location.href = 'http://cbewsl/';
    }
    return status
}

function initializeLogin() {
    $('#login-form #submit').on('click',function(){
        if ($('#username').val() != ""|| $('#password').val() != "") {
            let username = $('#username').val();
            let password = $('#password').val();
            validateCredentials(username, password);
        } else {
            alert("Username and Password is required.")
        }
    });
}

function validateCredentials(username, password){
    $.ajax({
        url: "http://192.168.150.191:5000/api/login/validate_credentials",
        type: "POST",
        data: {
            "username": username,
            "password": password,
            },
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let credentials = JSON.parse(data)
        if (credentials.status == true) {
            localStorage.getItem("login_credentials", credentials);
            window.location.href = 'http://cbewsl/dashboard';
        } else {
            alert("Invalid Username/Password.")
        }
        
    });
}

// function getAllResourcesAndCapacity() {
//     $.ajax({
//         url: "http://192.168.150.191:5000/api/resources_and_capacities/get_all_resources_and_capacities",
//         beforeSend: function (xhr) {
//             xhr.overrideMimeType("text/plain; charset=x-user-defined");
//         }
//     }).done(function (data) {
//         let hazard_data = JSON.parse(data)
//         $('#resources_and_capacities_table').DataTable({
//             "data": hazard_data,
//             "columns": [
//                 { "data": "resource_and_capacity" },
//                 { "data": "status" },
//                 { "data": "owner" },
//                 {
//                     render(data, type, full) {
//                         // ${full.resources_and_capacities_id}
//                         return `<i class="fas fa-pencil-alt text-center"></i>&nbsp;&nbsp;&nbsp;&nbsp;</i><i class="fas fa-minus-circle text-center"></i>`;
//                     }
//                 }
//             ]
//         });
//         $('#resources_and_capacities_main_table').DataTable({
//             "data": hazard_data,
//             "columns": [
//                 { "data": "resource_and_capacity" },
//                 { "data": "status" },
//                 { "data": "owner" }
//             ]
//         });
//     });
// }

