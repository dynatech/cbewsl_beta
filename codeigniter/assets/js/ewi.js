
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
    $.ajax({
        url: "http://192.168.150.10:5000/api/monitoring/get_candidate_and_public_alert",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let json_data = JSON.parse(data);
        console.log(json_data);
        let candidate_alerts = JSON.parse(json_data.candidate_alerts);
        // let public_alerts = JSON.parse(json_data.public_alerts);
        // displayCurrentAlert()
        displayCandidateAlert(candidate_alerts)
        // console.log(public_alerts)
        // if (candidate_alerts.length != 0) {
        //     $("#ewi_current_alert_container").show();
        //     $("#ewi_no_current_alert").hide();
        //     let public_alert_symbol = getPublicAlertSymbol(public_alerts[0].public_alert);
        //     let triggers = public_alerts[0].event_triggers[0].trigger_type;
        //     let tech_info = public_alerts[0].event_triggers[0].tech_info;
        //     let validity = formatDateTime(public_alerts[0].validity);
        //     $("#ewi_alert_symbol").text(public_alert_symbol);
        //     $("#triggers").empty().append("Rainfall<br>")
        //         .append(tech_info);
        //     $("#validity").empty().append(validity.text_format_timestamp);

        // } else {
        //     $("#ewi_current_alert_container").hide();
        //     $("#ewi_no_current_alert").show();
        // }
    });
}

function displayCurrentAlert() {

}

function displayCandidateAlert(data) {
    if (data.length != 0 || data.length != undefined) {
        console.log(data)
        let tech_info = data[0].trigger_list_arr[0].tech_info;
        let alert_symbol = "Alert " + data[0].trigger_list_arr[0].alert_level;
        $("#alert_information").text(tech_info);
        $("#alert_symbol").text(alert_symbol);
    } else {

    }

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
