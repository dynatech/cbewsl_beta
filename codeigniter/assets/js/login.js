$(document).ready(function () {
    initializeLogin();
});

function initializeLogin() {
    $.ajax({
        url: "http://192.168.1.10:5000/api/check_session",
        beforeSend: function (xhr) {
            // xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
            console.log(data)
        if(data == true){
            window.location.replace("http://cbewsl.com/dashboard");
        }
    })
    $('#login-form #submit').on('click', function () {
        if ($('#username').val() != "" || $('#password').val() != "") {
            let username = $('#username').val();
            let password = $('#password').val();
            validateCredentials(username, password);
        } else {
            alert("Username and Password is required.")
        }
    });
}

function validateCredentials(username, password) {
    $("#submit_spinner").show();
    $("#submit").hide();
    $.ajax({
        url: "http://192.168.1.10:5000/api/login/validate_credentials",
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
            $("#submit_spinner").hide();
            $("#submit").show();
            console.log(credentials)
            let session = {
                role: credentials.role,
                user_id: credentials.user_data.account_id,
                first_name: credentials.user_data.username,
                last_name: credentials.user_data.username,
            }
            setTimeout(function(){ 
                window.location.href = "http://cbewsl.com/dashboard";
            }, 2000);
        } else {
            $("#submit_spinner").hide();
            $("#submit").show();
            alert("Invalid login.");
        }
    });
}