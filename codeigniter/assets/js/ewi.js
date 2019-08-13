
// //Not Jquery !!! just a helper function to return an object
// // function $(i_obj) {
// //     return document.getElementById(i_obj);
// // }

// window.fbAsyncInit = function () {
//     FB.init({
//         appId: '1991811884256968', // App ID : Insert the APP ID of the APP you created here
//         status: true,
//     });
// }


// function fbLogin() {
//     FB.login(function (response) {
//         if (response.status == "connected") {
//             //User has logged in, hide the login button and show the launch button

//             $("btnlogin").className = "Hide";
//             $("btnlauncher").className = "Show";

//         } else {
//             // user has not yet logged in, hide launcher button and display login button

//             $("btnlogin").className = "Show";
//             $("btnlauncher").className = "Hide";
//         }
//     });
// }

// //Function displays the Feed Dialog
// function LaunchFeedDialog() {

//     //Create an object with the below properties.
//     //There are a lot more parameters than what I have written below. Will explain each one of them in coming posts.
//     var obj = {
//         method: 'feed',
//         link: 'http://cbewsl.com/',
//         name: 'A Title for Feed Dialog',
//         caption: 'SAMPLE',
//         description: 'A description for the URL which is to be displayed',
//         message: 'ALert!'
//     };

//     //Calling the Facebook API : Important
//     FB.ui(obj, callback);
// }

// function callback(response) {
//     //Do anything you want here :)
//     //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
//     //alert(response['post_id']); Some diagnostics lol :)
// }

// // Load the SDK Asynchronously. This is a very important part. It loads the Facebook javascript SDK automatically.
// (function (d) {
//     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//     if (d.getElementById(id)) { return; }
//     js = d.createElement('script'); js.id = id; js.async = true;
//     js.src = "//connect.facebook.net/en_US/all.js";
//     ref.parentNode.insertBefore(js, ref);
// }(document));

$(document).ready(function () {
    getCurrentAlert();
});

function getCurrentAlert() {
    $("#ewi_no_current_alert").hide();
    $("#ewi_current_alert_container").hide();
    $.ajax({
        url: "http://192.168.150.10:5000/api/monitoring/get_candidate_and_current_alerts",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let json_data = JSON.parse(data);
        console.log(json_data);
        let candidate_alerts = JSON.parse(json_data.candidate_alert);
        if (candidate_alerts.length != 0) {
            displayCandidateAlert(candidate_alerts);
            $("#no_candidate_alert").hide();
            $("#candidate_alert_information").show();
        } else {
            $("#no_candidate_alert").show();
            $("#candidate_alert_information").hide();
        }

        if (json_data.leo.latest.length != 0) {

        } else {

        }
    });
}

function displayCurrentAlert() {

}

function displayCandidateAlert(candidate_alerts) {
    console.log(candidate_alerts)
    let public_alert_symbol = getPublicAlertSymbol(candidate_alerts[0].public_alert_symbol);
    let tech_info = candidate_alerts[0].trigger_list_arr[0].tech_info;
    let trigger_type = candidate_alerts[0].trigger_list_arr[0].trigger_type;
    let alert_timestamp = formatDateTime(candidate_alerts[0].trigger_list_arr[0].ts_updated);
    let trigger_id = candidate_alerts[0].trigger_list_arr[0].trigger_id;

    $("#alert_symbol").text(public_alert_symbol);
    $("#alert_information").empty().append(tech_info + "<br>")
        .append("Data Timestamp: " + alert_timestamp["text_format_timestamp"]);
    $('#alert_trigger').empty().append(trigger_type);
    $('#alert_trigger').css('textTransform', 'capitalize');

    onValidateCandidateAlert(trigger_id);
}

function getPublicAlertSymbol(alert_symbol) {
    let alert_level = ""
    switch (alert_symbol) {
        case "A1":
            alert_level = "Alert 1"
            break;
        case "A2":
            alert_level = "Alert 2"
            break;
        case "A3":
            alert_level = "Alert 3"
            break;
        default:
        // code block
    }

    return alert_level;
}

function onValidateCandidateAlert(trigger_id) {
    $("#candidate_alert_valid").unbind();
    $("#candidate_alert_invalid").unbind();

    $("#candidate_alert_valid").click(function () {
        $("#validate_alert_modal").modal("show");
        $("#validateAlertModalLabel").text("Remarks for this valid alert");
        alertValidation(trigger_id, 1, 1);
    });

    $("#candidate_alert_invalid").click(function () {
        $("#validate_alert_modal").modal("show");
        $("#validateAlertModalLabel").text("Remarks for this invalid alert");
        alertValidation(trigger_id, -1, 1);
    });
}

function alertValidation(trigger_id, valid, user_id) {

    $("#save_alert_validation").unbind();
    $("#save_alert_validation").click(function () {

        let url = "http://192.168.150.10:5000/api/monitoring/update_alert_status"
        let remarks = $("#alert_remarks").val();
        let data = {
            "trigger_id": trigger_id,
            "alert_status": valid,
            "remarks": remarks,
            "user_id": user_id,
        }
        console.log(data)
        $.ajax({
            url: url,
            method: "POST",
            data: data,
            dataType: 'jsonp',
            contentType: false,
            cache: false,
            processData: false,
            success: function (response) {
                console.log(response);
            }
        });
    });

}
