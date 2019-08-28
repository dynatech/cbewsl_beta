$(document).ready(function () {
    getCandidateAndLatestAlerts();
});

function getCandidateAndLatestAlerts() {
    $("#ewi_no_current_alert").hide();
    $("#ewi_current_alert_container").hide();
    $("#candidate_alert_information").hide();
    $("#ewi_for_lowering").hide();
    $("#ewi_lowering_details").hide();
    $.ajax({
        url: "http://192.168.150.10:5000/api/monitoring/get_candidate_and_current_alerts",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let json_data = JSON.parse(data);

        let candidate_alerts = JSON.parse(json_data.candidate_alert);
        console.log(json_data)
        if (candidate_alerts.length != 0) {
            displayCandidateAlert(candidate_alerts);
        } else {
            $("#no_candidate_alert").show();
            $("#candidate_alert_information").hide();
        }
        $("#current_alert_buttons").hide();
        if (json_data.leo.latest.length != 0) {
            displayLatestAlert(json_data.leo.latest, candidate_alerts);
        } else {
            if (json_data.leo.overdue.length != 0) {
                displayOverdueAlert(json_data.leo.overdue, candidate_alerts);
                $("#ewi_no_current_alert").hide();
                $("#ewi_current_alert_container").show();
            } else {
                $("#ewi_no_current_alert").show();
                $("#ewi_current_alert_container").hide();
            }

            if (json_data.leo.extended.length != 0) {
                displayExtendedAlert(json_data.leo.extended, candidate_alerts);
                $("#ewi_no_current_alert").hide();
                $("#ewi_current_alert_container").show();
            } else {
                $("#ewi_no_current_alert").show();
                $("#ewi_current_alert_container").hide();
            }
        }
    });
}

function displayLatestAlert(latest_data, candidate_alerts) {
    $("#ewi_current_alert_container").show();
    let latest = latest_data[0];
    let internal_alert_level = latest.internal_alert_level;
    let alert_level = "Alert " + latest.public_alert_symbol.alert_level;
    let alert_type = latest.public_alert_symbol.alert_type;
    let recommended_response = latest.public_alert_symbol.recommended_response;
    let event_start = latest.event.event_start;
    let validity = formatDateTime(latest.event.validity);
    let trigger = latest.releases[0].triggers;

    $("#ewi_alert_symbol").text(alert_level);
    $("#validity").text(validity["text_format_timestamp"]);
    formatTriggerToText(trigger);
    $("#triggers").append("<br><b>Recommended Response:</b> " + recommended_response);
}

function displayOverdueAlert(overdue_data, candidate_alerts) {
    $("#ewi_current_alert_container").show();
    let overdue = overdue_data[0];
    let internal_alert_level = overdue.internal_alert_level;
    let alert_level = "Alert " + overdue.public_alert_symbol.alert_level;
    let alert_type = overdue.public_alert_symbol.alert_type;
    let recommended_response = overdue.public_alert_symbol.recommended_response;
    let event_start = overdue.event.event_start;
    let validity = formatDateTime(overdue.event.validity);
    let trigger = overdue.releases[0].triggers;

    $("#ewi_alert_symbol").text(alert_level);
    $("#validity").text(validity["text_format_timestamp"]);
    formatTriggerToText(trigger);
    $("#triggers").append("<br><b>Recommended Response:</b> " + recommended_response);
}

function displayExtendedAlert(extended_data, candidate_alerts) {
    $("#ewi_current_alert_container").show();

}

function updateEwiData() {
    return $.ajax({
        url: "http://192.168.150.10:5000/api/monitoring/get_candidate_and_current_alerts",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    })

}

function displayCandidateAlert(candidate_alerts) {
    let trigger_list = candidate_alerts[0].trigger_list_arr;
    $("#candidate_alert_list").empty();
    $("#candidate_alert_information").hide();
    if (trigger_list.length != 0) {
        $.each(trigger_list, function (key, value) {
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
        let alert_level = candidate_alerts[0].public_alert_level;
        if (alert_level == 0) {
            $("#ewi_lowering_details").text("Alert 0 for Lowering");
            $("#ewi_current_alert_container").hide();
            $("#ewi_no_current_alert").hide();
            $("#ewi_for_lowering").show();
            $("#lower_ewi").empty().append('<br><input class="btn btn-success" type="button" id="confirm_lower_ewi" value="Release" style="background-color: #28a745;">');
            $("#confirm_lower_ewi").click(function () {
                let candidate_alerts = updateEwiData();
                candidate_alerts.done(function (data) {
                    let json_data = JSON.parse(data);
                    candidate_alerts = JSON.parse(json_data.candidate_alert);
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
                        // $("#confirm_valid_alert_modal").modal("hide");
                    });
                });
            });
        }
    }


}

function onValidateCandidateAlert(trigger_id, candidate_alerts, alert_data, trigger_type) {

    $("#candidate_alert_valid_" + trigger_id).unbind();
    $("#candidate_alert_invalid_" + trigger_id).unbind();
    $("#candidate_alert_valid_" + trigger_id).click(function () {

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
                formatCandidateAlerts(trigger_id);
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

function formatCandidateAlerts(trigger_id) {
    $("#valid_alert_information").empty();
    let candidate_alerts = updateEwiData();
    candidate_alerts.done(function (data) {
        let json_data = JSON.parse(data);
        updated_data = JSON.parse(json_data.candidate_alert);
        console.log("HERE", updated_data)
        $.each(updated_data[0].trigger_list_arr, function (key, value) {
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
                body: JSON.stringify(updated_data[0]),
            }).then((response) => response.json()).then((responseJson) => {
                let release_data = responseJson;
                releaseAlert(release_data);
                $("#confirm_valid_alert_modal").modal("hide");
            });
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
    }).then((responseJson) => {
        publicAlert();
    });
}

function publicAlert(is_onset = false) {
    let url = 'http://192.168.150.10:5000/api/monitoring/update_alert_gen/' + is_onset;
    fetch(url).then((response) => response.json())
        .then((responseJson) => {

            getCandidateAndLatestAlerts();
        });
}

function formatTriggerToText(trigger) {
    $("#triggers").empty();
    $.each(trigger, function (key, value) {
        if (value == undefined) {
            $("#triggers").append("No new retriggers");
        } else {
            let internal_symbol = value.internal_sym.alert_symbol;
            if (internal_symbol == "E") {
                let trigger_type = "Earthquake: ";
                let magnitude = value.trigger_misc.eq.magnitude;
                let longitude = value.trigger_misc.eq.longitude;
                let latitude = value.trigger_misc.eq.latitude;
                let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
                $("#triggers").append("<b>" + trigger_type + "</b>" + earth_quake_info + "<br>");
            } else if (internal_symbol == "R") {
                let trigger_type = "Rainfall: ";
                let info = value.info;
                $("#triggers").append("<b>" + trigger_type + "</b>" + info + "<br>");
            } else if (internal_symbol == "m" || internal_symbol == "M") {
                console.log(trigger);
                let trigger_type = "Manifestation of movements: ";
                let info = value.info;
                $("#triggers").append("<b>" + trigger_type + "</b>" + info + "<br>");
            }
        }
    });


    $("#release_ewi").empty().append('<br><input class="btn btn-success" type="button" id="confirm_release_ewi" value="Release" style="background-color: #28a745;">')
        .append('<br><input class="btn btn-success" type="button" id="ewi_send_to_email" value="Send to email" style="background-color: #28a745;">');
    sendEwiToEmail();
    $("#confirm_release_ewi").unbind();
    $("#confirm_release_ewi").click(function () {
        console.log("Im clicked")
        let candidate_alerts = updateEwiData();
        candidate_alerts.done(function (data) {
            let json_data = JSON.parse(data);
            candidate_alerts = JSON.parse(json_data.candidate_alert);
            let leo = json_data.leo;
            if (leo.latest.length != 0) {
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
                    $("#confirm_valid_alert_modal").modal("hide");
                });
            } else {
                alert('Please wait for the next release time.')
            }
        });
    });
}

function sendEwiToEmail() {
    $("#ewi_send_to_email").unbind();
    $("#ewi_send_to_email").click(function () {
        $("#sendEwiToEmailModal").modal("show");
    });

    $("#confirm_send_ewi").click(function () {
        let email = $("#email_for_ewi").val();
        let url = "http://192.168.150.10:5000/api/ewi/send_ewi_via_email";
        let data = {
            email: email
        }
        $("#confirm_send_ewi").prop('disabled', true);

        $.post(url, data).done(function (response) {
            alert(response.message);
            if (response.status == true) {
                $("#email_for_ewi").val("");
                $("#sendEwiToEmailModal").modal("hide");
            }
            $("#confirm_send_ewi").prop('disabled', false);
        });
    });
}
