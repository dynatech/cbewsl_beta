
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
    getCandidateAndLatestAlerts();
});

function getCandidateAndLatestAlerts() {
    $("#ewi_no_current_alert").hide();
    $("#ewi_current_alert_container").hide();
    $("#candidate_alert_information").hide();
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
    let trigger_list = candidate_alerts[0].trigger_list_arr;
    $("#candidate_alert_list").empty();
    $("#candidate_alert_information").hide();
    if (trigger_list.length != 0) {
        $.each(trigger_list, function (key, value) {
            console.log(value);
            let public_alert_symbol = "Alert " + value.alert_level;
            let tech_info = value.tech_info;
            let trigger_type = value.trigger_type;
            let alert_timestamp = formatDateTime(value.ts_updated);
            let trigger_id = value.trigger_id;
            let valid_text = "<h4><b style='color: #ee9d01;' id='alert_level_" + trigger_id + "'>" + public_alert_symbol + "</b></h4>";
            if (value.invalid == true) {
                valid_text = "<h4><b style='color: red;' id='alert_level_" + trigger_id + "'>" + public_alert_symbol + " (Invalid)</b></h4>";
            }
            $("#candidate_alert_list").append(valid_text)
                .append("<h5 class='alert_trigger'>" + trigger_type + "</h5>")
                .append("<h5>" + tech_info + "<br>")
                .append("Timestamp: " + alert_timestamp["text_format_timestamp"] + "<br></h5><br>")
                .append("<input class='btn btn-primary' type='button' value='Valid' style='background-color: #195770;' id='candidate_alert_valid_" + trigger_id + "'>&nbsp;")
                .append("<input class='btn btn-primary' type='button' value='Invalid' style='background-color: #195770;' id='candidate_alert_invalid_" + trigger_id + "'><hr>");

            $('.alert_trigger').css('textTransform', 'capitalize');
            if (value.invalid == true) {
                $("#candidate_alert_invalid_" + trigger_id).prop('disabled', true);
            }
            onValidateCandidateAlert(trigger_id, candidate_alerts, value, trigger_type);

        });
        $("#no_candidate_alert").hide();
        $("#candidate_alert_information").show();
    } else {
        $("#no_candidate_alert").show();
        $("#candidate_alert_information").hide();
    }


}

function onValidateCandidateAlert(trigger_id, candidate_alerts, alert_data, trigger_type) {

    $("#candidate_alert_valid_" + trigger_id).unbind();
    $("#candidate_alert_invalid_" + trigger_id).unbind();
    $("#candidate_alert_valid_" + trigger_id).click(function () {
        console.log("1")
        $("#validate_alert_modal").modal("show");
        $("#validateAlertModalLabel").text("Remarks for this valid alert");
        alertValidation(trigger_id, 1, 1, candidate_alerts, alert_data, trigger_type);
    });

    $("#candidate_alert_invalid_" + trigger_id).click(function () {
        $("#validate_alert_modal").modal("show");
        $("#validateAlertModalLabel").text("Remarks for this invalid alert");
        alertValidation(trigger_id, -1, 1, candidate_alerts, "", trigger_type);
    });
}

function alertValidation(trigger_id, valid, user_id, candidate_alerts, alert_data, trigger_type) {
    $("#alert_remarks").val("");

    $("#save_alert_validation").unbind();
    $("#save_alert_validation").click(function () {

        let url = "http://192.168.150.10:5000/api/monitoring/update_alert_status"
        let remarks = $("#alert_remarks").val();

        fetch(url, {
            method: 'POST',
            dataType: 'jsonp',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "trigger_id": trigger_id,
                "alert_status": valid,
                "remarks": remarks,
                "user_id": user_id,
            }),
        }).then((response) => {
            let alert_message = "";
            if (valid == 1) {
                alert_message = "Alert validated!";
                $("#alert_level_" + trigger_id).text("Alert " + alert_data.alert_level).css("color", "#ee9d01");
                $("#candidate_alert_valid_" + trigger_id).css("background-color", "#28a745").val("Raise");
                $("#candidate_alert_invalid_" + trigger_id).prop('disabled', false);
                formatCandidateAlerts(candidate_alerts, trigger_id);
            } else {
                alert_message = "Alert invalidated!";
                alert_level = $("#alert_level_" + trigger_id).text();
                $("#alert_level_" + trigger_id).text(alert_level + " (invalid)").css("color", "red")
                $("#candidate_alert_valid_" + trigger_id).css("background-color", "#195770").val("Valid");
                $("#candidate_alert_invalid_" + trigger_id).prop('disabled', true);
            }
            alert(alert_message);
            $("#validate_alert_modal").modal("hide");
        });
    });

}




function formatCandidateAlerts(candidate_alerts, trigger_id) {

    $("#valid_alert_information").empty();
    console.log(candidate_alerts);
    $.each(candidate_alerts[0].trigger_list_arr, function (key, value) {
        console.log(value);
        console.log(value.invalid);
        if (value.invalid != true) {
            let public_alert_symbol = "Alert " + value.alert_level;
            let tech_info = value.tech_info;
            let alert_timestamp = formatDateTime(value.ts_updated);
            $("#valid_alert_information").append("<h4><b style='color: #ee9d01;'>" + public_alert_symbol + "</b></h4>")
                .append("<h5 class='alert_trigger'>" + value.trigger_type + "</h5>")
                .append("<h5>" + tech_info + "<br>")
                .append("Timestamp: " + alert_timestamp["text_format_timestamp"] + "<br></h5><br>");
        }
    });

    $('.alert_trigger').css('textTransform', 'capitalize');

    $("#candidate_alert_valid_" + trigger_id).unbind();
    $("#candidate_alert_valid_" + trigger_id).click(function () {
        console.log("2")
        $("#validate_alert_modal").modal("hide");
        $("#confirm_valid_alert_modal").modal("show");
    });

    $("#confirm_release_alert").unbind();
    $("#confirm_release_alert").click(function () {
        let url = 'http://192.168.150.10:5000/api/monitoring/format_candidate_alerts_for_insert'
        fetch(url, {
            method: 'POST',
            dataType: 'jsonp',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(candidate_alerts[0]),
        }).then((response) => response.json()).then((responseJson) => {
            let release_data = responseJson;
            releaseAlert(release_data);
        });
    });

}

function releaseAlert(release_data) {
    let url = 'http://192.168.150.10:5000/api/monitoring/insert_ewi';
    fetch(url, {
        method: 'POST',
        dataType: 'jsonp',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(release_data),
    }).then((response) => response.json()).then((responseJson) => {
        publicAlert();
    });
}

function publicAlert() {
    let url = 'http://192.168.150.10:5000/api/monitoring/update_alert_gen'
    fetch(url).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            getCandidateAndLatestAlerts();
        });
}
