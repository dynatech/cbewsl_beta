$(document).ready(function () {
    initializeLogin();
});

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
        url: "http://192.168.150.10:5000/api/login/validate_credentials",
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
            storeSession(credentials)
            window.location.href = 'http://cbewsl/dashboard';
        } else {
            alert("Invalid Username/Password.")
        }
        
    });
}

function storeSession(credentials) {

}