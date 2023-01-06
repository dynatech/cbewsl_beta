$(document).ready(function() {
    let raw_credentials = localStorage.getItem("login_credentials");
    let credentials = JSON.parse(raw_credentials)
    console.log(credentials)
    console.log(window.location.href)
    if (window.location.href != "http://www.cbewsl/") {
        if (credentials == null || credentials == undefined) {
            window.location.href = 'http://www.cbewsl/';
        } else {
            window.location.href = 'http://www.cbewsl/dashboard';
        }
    } else {
        if (credentials == null || credentials == undefined) {
            window.location.href = 'http://www.cbewsl/';
        } else {
            window.location.href = 'http://www.cbewsl/dashboard';
        }
    }
})
