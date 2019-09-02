$(document).ready(function () {
    initializeLogin();
});

function initializeLogin() {
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
    $.ajax({
        url: "http://192.168.8.100:5000/api/login/validate_credentials",
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
            let session = {
                role: credentials.role,
                user_id: credentials.user_data.account_id,
                first_name: credentials.user_data.user.first_name,
                last_name: credentials.user_data.user.last_name,
            }
            $.ajax({
                url: "http://cbewsl.com/api/register_session",
                type: "POST",
                data: session,
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                }
            }).done(function (data) {
                if (data == 1) {
                    window.location.href = "http://cbewsl.com/dashboard";
                } else {
                    alert("Failed to login.")
                }
            });
        } else {
            alert(data.message);
        }
    });
}