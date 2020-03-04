$(document).ready(function () {
    getCandidateAndLatestAlerts();
});

function getCandidateAndLatestAlerts() {
    $("#ewi_no_current_alert").hide();
    $("#ewi_current_alert_container").hide();
    $("#candidate_alert_information").hide();
    $("#ewi_for_lowering").hide();
    $("#ewi_lowering_details").hide();
    $("#extended_column").hide();
    $.ajax({
        url: "http://192.168.1.10:5000/api/monitoring/get_candidate_and_current_alerts",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let json_data = JSON.parse(data);
        let has_alert_data = false;
        let candidate_alerts = JSON.parse(json_data.candidate_alert);
        let releases = json_data.releases;
        let latest_event_moms = json_data.latest_event_moms;
        let latest_released_moms = json_data.latest_released_moms;

        console.log("json_data", json_data);

        $("#current_alert_buttons").hide();
        if (json_data.leo.extended.length != 0) {
            has_alert_data = true;
            displayExtendedAlert(json_data.leo.extended);
            $("#ewi_no_current_alert").hide();
        }

        if (has_alert_data == false) {
            $("#ewi_no_current_alert").show();
        } else {
            $("#ewi_no_current_alert").hide();
        }

        if (json_data.leo.latest.length != 0) {
            displayLatestAlert(json_data.leo.latest, candidate_alerts, true, json_data);
        }

        if (json_data.leo.overdue.length != 0) {
            displayOverdueAlert(json_data.leo.overdue, candidate_alerts, true, json_data);
        }

        if (candidate_alerts.length != 0) {
            $("#no_candidate_alert").hide();
            displayCandidateAlert(candidate_alerts);
        } else {
            $("#no_candidate_alert").show();
        }



    });
}

function displayLatestAlert(latest_data, candidate_alerts, has_alert_data, json_data) {
    let latest = latest_data[0];
    formatEwiDetails(candidate_alerts, latest, has_alert_data, false, json_data);

}

function displayOverdueAlert(overdue_data, candidate_alerts, has_alert_data, json_data) {
    let overdue = overdue_data[0];
    formatEwiDetails(candidate_alerts, overdue, has_alert_data, true, json_data);
}

function displayExtendedAlert(extended_data) {
    $("#ewi_current_alert_container").show();
    $("#lower_ewi").hide();
    $("#triggers_column").hide();
    $("#validity_column").hide();
    $("#ewi_alert_symbol").empty().append("Alert 0");
    $("#extended_column").show();
    let day_of_extended = "Day " + extended_data[0].day + " of Extended monitoring";
    let latest_release = extended_data[0].releases[0].release_time;
    let data_ts = formatDateTime(extended_data[0].releases[0].data_ts);
    let formatted_latest_release = moment(latest_release, 'HH:mm').format('h:mm A');
    let latest_release_text = data_ts["date_only_format"] + " " + formatted_latest_release;

    $("#extended_day").empty().append(day_of_extended);
    $("#extended_latest_release").empty().append("Latest Release: " + latest_release_text);
    onClickReleaseExtended();

}

function updateEwiData() {
    return $.ajax({
        url: "http://192.168.1.10:5000/api/monitoring/get_candidate_and_current_alerts",
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

            $('.alert_trigger').css('text-transform', 'capitalize');
            if (value.invalid == true) {
                $("#candidate_alert_invalid_" + trigger_id).prop('disabled', true);
            }
            onValidateCandidateAlert(trigger_id, candidate_alerts, value, trigger_type);

        });
        $("#no_candidate_alert").hide();
        $("#candidate_alert_information").show();
    } else {
        $("#no_candidate_alert").show();
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

        let url = "http://192.168.1.10:5000/api/monitoring/update_alert_status"
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
                publicAlert();
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
            let url = 'http://192.168.1.10:5000/api/monitoring/format_candidate_alerts_for_insert'
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

function onClickReleaseExtended() {
    $("#release_ewi").empty().append('<br><input class="btn btn-success" type="button" id="confirm_release_ewi" value="Release" style="background-color: #28a745;">')
        .append('&nbsp;<input class="btn btn-success" type="button" id="ewi_send_to_email" value="Send to email" style="background-color: #28a745;">');
    sendEwiToEmail();
    $("#confirm_release_ewi").unbind();
    $("#confirm_release_ewi").click(function () {
        $("#confirmReleaseModal").modal("show");
    });

    $("#confirm_release_ewi_modal").unbind();
    $("#confirm_release_ewi_modal").click(function () {
        let candidate_alerts = updateEwiData();
        candidate_alerts.done(function (data) {
            let json_data = JSON.parse(data);
            candidate_alerts = JSON.parse(json_data.candidate_alert);
            let leo = json_data.leo;
            // is_for_release = false;
            // if(candidate_alerts.length != 0){
            //     let is_release_time = candidate_alerts[0].is_release_time;
            //     if(is_release_time == true){
            //         is_for_release = true;
            //     }
            // }else{
            //     is_for_release = false;
            // }

            if (candidate_alerts.length != 0) {
                if (leo.extended.length != 0) {
                    let url = 'http://192.168.1.10:5000/api/monitoring/format_candidate_alerts_for_insert'
                    fetch(url, {
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(candidate_alerts[0]),
                    }).then((response) => response.json()).then((responseJson) => {
                        $("#confirmReleaseModal").modal("hide");
                        let release_data = responseJson;
                        releaseAlert(release_data);
                        $("#confirm_valid_alert_modal").modal("hide");
                    });
                } else {
                    alert('Please wait for the next release time.')
                }
            } else {
                alert('Unable to release this time.')
                $("#confirm_valid_alert_modal").modal("hide");
            }

        });
    });

}

function releaseAlert(release_data, is_moms = false) {
    let url = 'http://192.168.1.10:5000/api/monitoring/insert_ewi';
    fetch(url, {
        method: 'POST',
        dataType: 'jsonp',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(release_data),
    }).then((responseJson) => {
        publicAlert(is_moms);
    });
}

function publicAlert(is_onset = false) {
    let url = 'http://192.168.1.10:5000/api/monitoring/update_alert_gen/' + is_onset;
    fetch(url).then((response) => response.json())
        .then((responseJson) => {
            getCandidateAndLatestAlerts();
        });
}

function onClickReleaseAlert(is_overdue) {

    $("#release_ewi").empty().append('<br><input class="btn btn-success" type="button" id="confirm_release_ewi" value="Release" style="background-color: #28a745;">')
        .append('&nbsp;<input class="btn btn-success" type="button" id="ewi_send_to_email" value="Send to email" style="background-color: #28a745;">');
    sendEwiToEmail();
    $("#confirm_release_ewi").unbind();
    $("#confirm_release_ewi").click(function () {
        $("#confirmReleaseModal").modal({
            backdrop: 'static',
            keyboard: false
        })
    });

    $("#confirm_release_ewi_modal").unbind();
    $("#confirm_release_ewi_modal").click(function () {
        $("#confirm_release_ewi_modal_spinner").show();
        $("#close_release_ewi_modal").hide();
        $("#confirm_release_ewi_modal").hide();
        let candidate_alerts = updateEwiData();
        candidate_alerts.done(function (data) {
            let json_data = JSON.parse(data);
            candidate_alerts = JSON.parse(json_data.candidate_alert);
            let leo = json_data.leo;
            is_for_release = false;
            let is_moms = false


            if (candidate_alerts.length != 0) {
                let is_release_time = candidate_alerts[0].is_release_time;
                let internal_alert_level = candidate_alerts[0].internal_alert_level;
                let check_moms = internal_alert_level.split("")
                $.each(check_moms, function (key, value) {
                    if (is_moms == false) {
                        if (value == "m" || value == "M") {
                            is_moms = true
                        }
                    }
                });
                if (is_release_time == true) {
                    is_for_release = true;
                }
                if (candidate_alerts[0].public_alert_symbol == "A0") {
                    is_for_release = true
                }
            } else {
                is_for_release = false;
            }

            if (is_for_release == true || is_overdue == true) {
                $("#confirm_release_ewi_modal_spinner").hide();
                $("#close_release_ewi_modal").show();
                $("#confirm_release_ewi_modal").show();
                candidate_alerts[0].is_overdue = is_overdue;
                if (leo.latest.length != 0 || leo.overdue.length != 0) {
                    let url = 'http://192.168.1.10:5000/api/monitoring/format_candidate_alerts_for_insert';
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
                        alert("Successfully Released!");
                        $("#ewi_send_to_email").show();
                        $("#confirm_release_ewi").hide();
                        $("#confirmReleaseModal").modal("hide");
                        releaseAlert(release_data, is_moms);
                        $("#confirm_valid_alert_modal").modal("hide");
                    });
                } else {
                    alert('Please wait for the next release time.')
                }
            } else {
                $("#confirm_release_ewi_modal_spinner").hide();
                $("#close_release_ewi_modal").show();
                $("#confirm_release_ewi_modal").show();
                alert('Unable to release this time.')
                $("#confirmReleaseModal").modal("hide");
            }

        });
    });
}

function identifyOPTriggerDisplay (op_trigger, return_type="txt") {
    let color = "";
    let op_status = "";
    switch (op_trigger) {
        case 0:
            op_status = "No significant changes"; color = "green"; break;
        case 2:
            op_status = "SIGNIFICANT"; color = "#ee9d01"; break;
        case 3:
            op_status = "CRITICAL"; color = "red"; break;
        default:
            console.error("invalid op trigger");
    }
    return return_type === "txt" ? op_status : `<b style='color:${color};'>(${op_status})</b>`;
}

// function getLatestReleasedMoms (releases) {
//     const moms_list = [];
//     const instance_id_list = [];
//     releases.forEach(release => {
//         const { triggers } = release;
//         const moms_triggers = triggers.filter(trig => ["m", "M"].includes(trig.internal_sym.alert_symbol));
//         moms_triggers.forEach(moms_trig => {
//             const { moms_releases } = moms_trig.trigger_misc;

//             moms_releases.forEach(moms_rel => {
//                 const instance_id = moms_rel.moms_details.moms_instance.instance_id;
//                 if (!instance_id_list.includes(instance_id)) {
//                     instance_id_list.push(instance_id);
//                     moms_list.push(moms_rel.moms_details);
//                 }
//             })
//         });
//     })
//     return moms_list;
// }

function getAllLastRetrigger (releases, event_start, validity) {
    let all_triggers = []
    let has_latest_rainfall_trigger = false;
    const instance_id_arr = [];

    releases.forEach(release => {
        let release_triggers = release.triggers;

        release_triggers.forEach(rel_trig => {
            const {
                internal_sym: { alert_symbol: internal_symbol },
                ts
            } = rel_trig;

            const { current_timestamp: curr_ts, text_format_timestamp: str_format_ts } = formatDateTime(ts);
            
            let update_ts = moment(curr_ts).add(1, "minutes").format("YYYY-MM-DD HH:mm:SS");
            let check_date_range = moment(update_ts).isBetween(event_start, validity);
            if (internal_symbol == "E") {
                const { magnitude, longitude, latitude } = rel_trig.trigger_misc.eq;
                let earth_quake_info = `Magnitude: ${magnitude} Longitude: ${longitude} Latitude: ${latitude}`;
                all_triggers.push({
                    "trigger_type": "earthquake",
                    "tech_info": earth_quake_info,
                    "ts": str_format_ts,
                    "internal_sym": internal_symbol
                });

            } else if (internal_symbol == "R") {
                if (has_latest_rainfall_trigger == false) {
                    has_latest_rainfall_trigger = true;
                    let info = rel_trig.info;
                    all_triggers.push({
                        "trigger_type": "rainfall",
                        "tech_info": info,
                        "ts": str_format_ts,
                        "internal_sym": internal_symbol
                    });
                }

            }
        });
    });

    return all_triggers
}

function latestReleaseMoms(latest_moms) {
    let moms_data = [];
    $.each(latest_moms, function (key, value) {
        let remarks = value.narrative.narrative;
        let observance_ts = value.observance_ts;
        let instance_id = value.moms_instance.instance_id;
        let op_trigger = value.op_trigger;
        moms_data.push({ "trigger_type": "moms", "tech_info": remarks, "ts": observance_ts, "instance_id": instance_id, "op_trigger": op_trigger });
    });
    return moms_data
}

function returnFormattedMomsDetails (released_moms, triggers, critical_instance_ids) {
    const { moms_id } = released_moms;
    const {
        reporter, remarks, validator, op_trigger, narrative: { narrative },
        observance_ts, moms_instance: { feature, site, feature_name, instance_id }
    } = released_moms;

    // All these do is get all moms_intances from triggers to check if data is available
    const moms_triggers_arr = triggers.filter(trig => ["m", "M"].includes(trig.internal_sym.alert_symbol));
    const triggering_moms_instances = [];
    moms_triggers_arr.forEach(mta => {
        const { moms_releases } = mta.trigger_misc;
        moms_releases.forEach(mom_rel => {
            triggering_moms_instances.push(mom_rel.moms_details.moms_instance);
        });
    });

    const has_found = triggering_moms_instances.find(tmi => tmi.instance_id === instance_id);
    let is_triggering = true;
    if (typeof has_found === "undefined") is_triggering = false;

    const { feature_type: f_type } = feature;

    const str_obs_ts = moment(observance_ts).format("dddd, MMMM Do YYYY, h:mm a")
    const str_reporter = `${validator.first_name} ${validator.last_name}`;
    const str_validator = `${reporter.first_name} ${reporter.last_name}`;
    const instance_name = `(${f_type.toUpperCase()}) ${feature_name}`; 

    console.log("critical_instance_ids".toUpperCase(), critical_instance_ids);
    let color_code = critical_instance_ids.includes(instance_id) ? 3 : 2;
    // override if m0
    let retrigger_status = is_triggering ? `Retriggered at ${str_obs_ts}` : `No retrigger as of ${str_obs_ts}`;
    console.log("op_trigger", op_trigger);
    if (op_trigger === 0) {
        color_code = 0;
        retrigger_status = `Resolved as of ${str_obs_ts}`;
    }

    console.log("critical_instance_ids", critical_instance_ids);
    console.log("color_code", color_code);
    const temp2 = identifyOPTriggerDisplay(color_code, "html");
    let summary = `${str_reporter}: ${narrative} ${temp2}`
    summary = `${summary} ${retrigger_status}`;
    return {
        moms_id, instance_name, op_trigger, remarks, observance_ts, summary,
        "site_code": site.site_code.toUpperCase(), "instance_id": instance_id,
        "validator": str_validator, "reporter": str_reporter
    };
}


function recommendedResponse(alert_level) {
    let recommended_response = "Monitor routine monitoring data sent by the LEWC";//alert 0

    if (alert_level == "Alert 1") {
        recommended_response = "<br>&#9679;Alert validation<br>&#9679;Normal OpCen operations<br>&#9679;Once a day EWI";
    } else if (alert_level == "Alert 2") {
        recommended_response = "<br>&#9679;Shifting<br>&#9679;Mobilize additional staff<br>&#9679;Activate EOC<br>&#9679;6x a day EWI";
    } else if (alert_level == "Alert 3") {
        recommended_response = "<br>&#9679;Forced evacuate community members/stakeholders<br>&#9679;Pre-positioning of response rescue<br>&#9679;Convene MDRRMC<br>&#9679;6x a day EWI";
    }

    return recommended_response
}


function formatEwiDetails(candidate_alerts, leo_data, has_alert_data, is_overdue, json_data) {
    const releases = json_data.releases;
    const latest_event_moms = json_data.latest_event_moms;
    const latest_released_moms = json_data.latest_released_moms;
    const critical_instance_ids = json_data.critical_instance_ids;

    let alert_level = "Alert " + leo_data.public_alert_symbol.alert_level;
    if (alert_level == "Alert 0") {
        if (has_alert_data == true) {
            $("#ewi_no_current_alert").show();
        } else {
            $("#ewi_no_current_alert").hide();
        }
        $("#ewi_current_alert_container").hide();
    } else {
        $("#ewi_no_current_alert").hide();
        $("#ewi_current_alert_container").show();
        let recommended_response = recommendedResponse(alert_level);
        let event_start = formatDateTime(leo_data.event.event_start);
        let validity = formatDateTime(leo_data.event.validity);
        let release_triggers = leo_data.releases[0].triggers;
        let all_latest_triggers = getAllLastRetrigger(releases, event_start.current_timestamp, validity.current_timestamp);
        // let latest_released_moms = getLatestReleasedMoms(releases);
        let latest_release_moms_per_instance = latestReleaseMoms(latest_event_moms)
        let formatted_as_of = "";
        let latest_data_information = "";
        let has_trigger = false;
        let trigger_list_trigger_id = 0;
        let release_schedule = "";
        let general_status = "";
        let latest_trigger_details = [];
        let has_moms_triggers = false;
        if (candidate_alerts.length == 0) {
            formatted_as_of = formatDateTime(leo_data.releases[0].data_ts);
            console.log("candidate_alerts", candidate_alerts);
        } else {
            formatted_as_of = formatDateTime(candidate_alerts[0].release_details.data_ts);
            let trigger_list_arr = candidate_alerts[0].trigger_list_arr;
            general_status = candidate_alerts[0].general_status
            if (candidate_alerts[0].public_alert_symbol == "A0") {
                release_schedule = candidate_alerts[0].release_details.data_ts;
            } else {
                release_schedule = candidate_alerts[0].release_schedule;
            }

            //////////////////////////////
            //                          //
            //  CANDIDATE ALERTS AREA   //
            //                          //
            //////////////////////////////
            let update_ts = moment(release_schedule).add(30, "minutes").format("YYYY-MM-DD HH:mm:SS");
            release_schedule = formatDateTime(update_ts);
            console.log("candidate_alerts", candidate_alerts);
            if (trigger_list_arr.length != 0) {
                has_trigger = true;
                $.each(trigger_list_arr, function (key, value) {
                    let trigger_type = value.trigger_type;
                    let tech_info = value.tech_info;
                    let invalid = value.invalid;
                    if (trigger_list_trigger_id == 0 && trigger_type == "rainfall") {
                        trigger_list_trigger_id = value.trigger_id
                    }
                    let instance_id = 0
                    let moms_list = value.moms_list;
                    $.each(moms_list, function (key, value) {
                        instance_id = value.moms_instance.instance_id;
                    });
                    console.log("candidate_alerts", candidate_alerts);
                    console.log("value", value);
                    if (candidate_alerts[0].release_details.data_ts == value.ts_updated) {
                        if (trigger_type == "rainfall") {
                            if (invalid != true) {
                                latest_data_information += "<b>Rainfall: </b> " + tech_info + "<br>";
                            }
                        } else if (trigger_type == "moms") {
                            console.log("value", value);
                            // latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + "<br>";

                            let moms_trigger = "<b>Manifestations of movement: </b> " + tech_info + "<br>";
                            let moms_detail = "<ul style='list-style-type: none;'>";
                    
                            value.moms_list.forEach(moms => {
                                const {
                                    moms_instance: {
                                        feature_name: f_name, 
                                        feature: { feature_type: f_type }
                                    },
                                    op_trigger, observance_ts
                                } = moms;
                                const status = identifyOPTriggerDisplay(op_trigger, "html");
                                const summary = `(${f_type}) ${f_name} ${status}`;
                                moms_detail = `${moms_detail} <li>${summary}</li>`;
                            })
                            moms_detail = `${moms_detail} </ul>`;

                            console.log("latest_data_information", latest_data_information);

                            latest_data_information += `${moms_trigger}${moms_detail}`;
                        } else if (trigger_type == "earthquake") {
                            latest_data_information += "<b>Earthquake Alert: </b> " + tech_info + "<br>";
                        }
                        latest_trigger_details.push({
                            "ts_updated": value.ts_updated,
                            "tech_info": tech_info,
                            "trigger_type": trigger_type,
                            "alert": value.alert,
                            "instance_id": instance_id,
                            "invalid": invalid
                        });
                    } else {
                        if (trigger_type == "moms") {
                            has_moms_triggers = true;
                            let moms_trigger = "<b>Manifestations of movement: </b> " + tech_info + "<br>";
                            let moms_detail = "<ul style='list-style-type: none;'>";
                    
                            value.moms_list.forEach(moms => {
                                const {
                                    moms_instance: {
                                        feature_name: f_name, 
                                        feature: { feature_type: f_type }
                                    },
                                    op_trigger, observance_ts
                                } = moms;
                                const status = identifyOPTriggerDisplay(op_trigger, "html");
                                const summary = `(${f_type}) ${f_name} ${status}`;
                                moms_detail = `${moms_detail} <li>${summary}</li>`;
                            })
                            moms_detail = `${moms_detail} </ul>`;

                            console.log("latest_data_information", latest_data_information);

                            latest_data_information += `${moms_trigger}${moms_detail}`;
                        } else {
                            if (has_moms_triggers == false) {
                                latest_data_information += "No new retriggers<br>"
                            }
                        }
                        latest_trigger_details.push({
                            "ts_updated": value.ts_updated,
                            "tech_info": tech_info,
                            "trigger_type": trigger_type,
                            "alert": value.alert,
                            "instance_id": instance_id,
                            "invalid": invalid
                        });
                    }
                });
            } else {
                has_trigger = false;
                let latest_ts = formatDateTime(candidate_alerts[0].release_details.data_ts);
                latest_data_information += "<hr><br>As of <b>" + latest_ts["text_format_timestamp"] + "</b><br>No new retriggers<br>"
            }
            //////////////////////////
            //  END of Candidate    //
            //////////////////////////

        }
        $("#recommended_response").empty();
        let as_of_datetime = formatted_as_of["text_format_timestamp"] + "</b>";
        let latest_release_text = "none";
        let info = ""
        let release_ts = "";
        let all_triggers = []
        let has_latest_rainfall_trigger = false;
        let moms_instance_ids = []
        // let critical_instance_ids = []

        $.each(leo_data.releases, function (key, value) {
            if (latest_release_text == "none") {
                let formatted_release_time = moment(value.release_time, 'HH:mm').format('h:mm A');
                release_ts = formatDateTime(value.data_ts);

                if (release_ts["text_format_timestamp"] == event_start["text_format_timestamp"]) {
                    release_ts = formatDateTime(value.data_ts);
                } else {
                    let update_ts = moment(value.data_ts).add(30, "minutes").format("YYYY-MM-DD HH:mm:SS");
                    release_ts = formatDateTime(update_ts);
                }
                latest_release_text = release_ts["date_only_format"] + " " + formatted_release_time;
            }


            let release_triggers = value.triggers;
            console.log("value", value);
            console.log("release_triggers", release_triggers);
            $.each(release_triggers, function (key, value) {
                let internal_symbol = value.internal_sym.alert_symbol;
                let ts = formatDateTime(value.ts)
                if (internal_symbol == "E") {
                    let magnitude = value.trigger_misc.eq.magnitude;
                    let longitude = value.trigger_misc.eq.longitude;
                    let latitude = value.trigger_misc.eq.latitude;
                    let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
                    all_triggers.push({ "trigger_type": "earthquake", "tech_info": earth_quake_info, "ts": ts["text_format_timestamp"], "internal_sym": internal_symbol })
                } else if (internal_symbol == "R") {
                    if (has_latest_rainfall_trigger == false) {
                        has_latest_rainfall_trigger = true;
                        let info = value.info;
                        all_triggers.push({ "trigger_type": "rainfall", "tech_info": info, "ts": ts["text_format_timestamp"], "internal_sym": internal_symbol })
                    }
                } else if (internal_symbol == "m" || internal_symbol == "M") {
                    let instance_id = value.trigger_misc.moms_releases[0].moms_details.moms_instance.instance_id;
                    let moms_instance_id_checker = moms_instance_ids.includes(instance_id);
                    if (moms_instance_id_checker == false) {
                        moms_instance_ids.push(instance_id);
                        let info = value.info;
                        all_triggers.push({ "trigger_type": "moms", "tech_info": info, "ts": ts["text_format_timestamp"], "internal_sym": internal_symbol })
                    }

                    // let critical_instance_id_checker = critical_instance_ids.includes(instance_id);
                    // console.log("instance_id", instance_id);
                    // console.log("critical_instance_id_checker", critical_instance_id_checker);
                    // if (internal_symbol == "M") {
                    //     console.log("internal_symbol", internal_symbol);
                    //     if (critical_instance_id_checker == false) {
                    //         critical_instance_ids.push(instance_id);
                    //     }
                    // }
                    // console.log("critical_instance_ids", critical_instance_ids);
                }
            });
        });
        let latest_event_triggers = leo_data.latest_event_triggers;
        let is_moms = false;
        let has_rainfall = false;
        let latest_release_moms_instance = [];

        //////////////////////////
        //                      //
        //  Latest Retriggers   //
        //                      //
        //////////////////////////

        $("#recommended_response").append("<hr><br>");
        console.log("all_latest_triggers", all_latest_triggers);
        console.log("latest_event_triggers", latest_event_triggers);

        all_latest_triggers.forEach(value => {
        // latest_event_triggers.forEach(value => {
            let ts = value.ts;
            const {
                timestamp: latest_timestamp, internal_sym, trigger_type,
                tech_info, instance_id
            } = value;
            // if (trigger_type == "moms") {
            //     if (latest_release_moms_per_instance.length != 0) {
            //         is_moms = true;
            //         let has_latest = false;

            //         latest_release_moms_per_instance.forEach(value => {
            //             let latest_instance_id = value.instance_id;
            //             let ts_updated = formatDateTime(value.ts);
            //             let latest_ts = ts_updated.text_format_timestamp
            //             if (latest_instance_id == instance_id) {
            //                 if (value.trigger_type == "moms") {
            //                     has_latest = true
            //                     let ts_updated = formatDateTime(value.ts_updated);
            //                     let timestamp = ts_updated.text_format_timestamp
            //                     let moms_info = value.tech_info;
            //                     if (critical_instance_ids.length != 0) {

            //                         critical_instance_ids.forEach(value => {
            //                             let critical_instance_id = value;
            //                             if (latest_instance_id == critical_instance_id) {
            //                                 as_of = "<b>Last moms retrigger</b> at " + "<b>" + latest_ts + "</b> <b style='color:red'>(CRITICAL)</b><br>";
            //                             } else {
            //                                 as_of = "<b>Last moms retrigger</b> at " + "<b>" + latest_ts + "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
            //                             }
            //                             info += as_of + moms_info + "<br><br>";
            //                         });
            //                     } else {
            //                         if (value.op_trigger == 2) {
            //                             as_of = "<b>Last moms retrigger</b> at " + "<b>" + latest_ts + "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
            //                         } else {
            //                             as_of = "<b>Last moms retrigger</b> at " + "<b>" + latest_ts + "</b> <b style='color:red'>(CRITICAL)</b><br>";
            //                         }
            //                         info += as_of + moms_info + "<br><br>";
            //                     }


            //                     if (latest_timestamp != value.ts) {
            //                         latest_release_moms_instance.push(value)
            //                     }
            //                 }
            //             }
            //         });
            //         if (has_latest == false) {
            //             if (internal_sym == "m") {
            //                 as_of = "<b>Last moms retrigger</b> at " + "<b>" + ts + "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
            //             } else {
            //                 as_of = "<b>Last moms retrigger</b> at " + "<b>" + ts + "</b> <b style='color:red'>(CRITICAL)</b><br>";
            //             }
            //             info += as_of + tech_info + "<br><br>";
            //         }
            //     } else {
            //         is_moms = true;
            //         if (internal_sym == "m") {
            //             as_of = "<b>Last moms retrigger</b> at " + "<b>" + ts + "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
            //         } else {
            //             as_of = "<b>Last moms retrigger</b> at " + "<b>" + ts + "</b> <b style='color:red'>(CRITICAL)</b><br>";
            //         }
            //         info += as_of + tech_info + "<br><br>";
            //     }

            // } else if (trigger_type == "rainfall") {
            if (trigger_type == "rainfall") {
                if (has_rainfall == false) {
                    if (latest_trigger_details.length != 0) {
                        has_rainfall = true;
                        let has_latest = false;
                        $.each(latest_trigger_details, function (key, value) {
                            if (value.trigger_type == "rainfall") {
                                if (value.invalid != true) {
                                    has_latest = true
                                    let ts_updated = formatDateTime(value.ts_updated);
                                    let timestamp = ts_updated["text_format_timestamp"];
                                    let rain_info = value.tech_info;
                                    as_of = "<b>Last rainfall retrigger</b> at " + "<b>" + timestamp + "</b><br>";
                                    info += as_of + rain_info + "<br><br>";
                                }
                            }
                        });
                        if (has_latest == false) {
                            as_of = "<b>Last rainfall retrigger</b> at " + "<b>" + ts + "</b><br>";
                            info += as_of + tech_info + "<br><br>";
                        }
                    } else {
                        as_of = "<b>Last rainfall retrigger</b> at " + "<b>" + ts + "</b><br>";
                        info += as_of + tech_info + "<br><br>";
                    }
                }

            } else if (trigger_type == "earthquake") {
                let as_of = "<b>Last earthquake retrigger</b> at " + "<b>" + ts + "</b><br>";
                info += as_of + tech_info + "<br><br>";
            }


        });

        if (has_rainfall == false) {
            if (latest_trigger_details.length != 0) {
                has_rainfall = true;
                let has_latest = false;
                $.each(latest_trigger_details, function (key, value) {
                    if (value.trigger_type == "rainfall") {
                        if (value.invalid != true) {
                            has_latest = true
                            let ts_updated = formatDateTime(value.ts_updated);
                            let timestamp = ts_updated["text_format_timestamp"];
                            let moms_info = value.tech_info;
                            as_of = "<b>Last rainfall retrigger</b> at " + "<b>" + timestamp + "</b><br>";
                            info += as_of + moms_info + "<br><br>";
                        }
                    }
                });
            } else {
                has_rainfall = false
            }
        }
        // LOUIE: Is moms shit
        console.log("latest_event_moms", latest_event_moms)
        console.log("latest_release_moms_per_instance", latest_release_moms_per_instance)
        if (is_moms == false) {
            if (latest_release_moms_per_instance.length != 0) {
                has_moms_triggers = true
                is_moms = true
                $.each(latest_release_moms_per_instance, function (key, value) {
                    if (value.trigger_type == "moms") {
                        let ts_updated = formatDateTime(value.ts);
                        let timestamp = ts_updated.text_format_timestamp
                        console.log("value", value);
                        let moms_info = value.tech_info;
                        if (value.op_trigger == 2) {
                            as_of = "<b>Last moms retrigger</b> at " + "<b>" + timestamp + "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
                        } else {
                            as_of = "<b>Last moms retrigger</b> at " + "<b>" + timestamp + "</b> <b style='color:red'>(CRITICAL)</b><br>";
                        }
                        info += as_of + moms_info + "<br><br>";
                    }
                });
            } else {
                is_moms = false
            }
        }

        //////////////////////////////////
        //  END of Latest Retriggers    //
        //////////////////////////////////

        // if (has_moms_triggers == true) {
        //     if (latest_release_moms_instance.length != 0) {
        //         $.each(latest_release_moms_instance, function (key, value) {
        //             let ts_updated = formatDateTime(value.ts);
        //             let latest_ts = ts_updated.text_format_timestamp
        //             if (value.trigger_type == "moms") {
        //                 let ts_updated = formatDateTime(value.ts_updated);
        //                 let timestamp = ts_updated.text_format_timestamp
        //                 let moms_info = value.tech_info;
        //                 if (value.op_trigger == 2) {
        //                     latest_data_information += "<b>Manifestations of movement: </b> " + moms_info + " <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
        //                 } else {
        //                     latest_data_information += "<b>Manifestations of movement: </b> " + moms_info + " <b style='color:red'>(CRITICAL)</b><br>";
        //                 }
        //             }
        //         });
        //     } else {
        //         $.each(latest_trigger_details, function (key, value) {
        //             let trigger_type = value.trigger_type;
        //             let tech_info = value.tech_info;
        //             let moms_type = value.alert;
        //             if (trigger_type == "moms") {
        //                 if (value.invalid != true) {
        //                     if (moms_type == "m2") {
        //                         latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + " <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
        //                     } else {
        //                         latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + " <b style='color:red'>(CRITICAL)</b><br>";
        //                     }
        //                 }
        //             }
        //         });
        //     }
        // } else {
        //     $.each(latest_release_moms_per_instance, function (key, value) {
        //         let latest_instance_id = value.instance_id;
        //         let ts_updated = formatDateTime(value.ts);
        //         let latest_ts = ts_updated.text_format_timestamp
        //         let tech_info = value.tech_info
        //         if (value.trigger_type == "moms") {
        //             has_latest = true
        //             let ts_updated = formatDateTime(value.ts_updated);
        //             let timestamp = ts_updated.text_format_timestamp
        //             let moms_info = value.tech_info;
        //             if (critical_instance_ids.length != 0) {
        //                 $.each(critical_instance_ids, function (key, value) {
        //                     let critical_instance_id = value;
        //                     if (latest_instance_id == critical_instance_id) {
        //                         latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + " <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
        //                     } else {
        //                         latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + " <b style='color:red'>(CRITICAL)</b><br>";
        //                     }
        //                 });
        //             } else {
        //                 if (value.op_trigger == 2) {
        //                     latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + " <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
        //                 } else {
        //                     latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + " <b style='color:red'>(CRITICAL)</b><br>";
        //                 }
        //             }
        //         }
        //     });
        // }


        if (alert_level == "Alert 3") {
            $("#ewi_alert_symbol").text(alert_level).css("color", "red");
        } else {
            $("#ewi_alert_symbol").text(alert_level);
        }
        $("#validity").empty().append("<b>Event started at </b>" + event_start["text_format_timestamp"]);
        $("#validity").append("<br><b>Valid until </b> " + validity["text_format_timestamp"]);
        $("#validity").append("<br><br><b>Latest release timestamp: </b> " + latest_release_text);
        $("#validity").append("<br><b>Recommended response:</b> " + recommended_response);

        if (has_trigger == true) {
            $("#recommended_response").append(info + "<hr><br>As of <b>" + as_of_datetime + "<br>" + latest_data_information);
        } else {
            $("#recommended_response").append(info + latest_data_information);
        }

        $("#triggers").empty();
        $("#triggers_column > h5").show();
        $("#triggers").append("As of <b>" + release_ts["text_format_timestamp"] + "</b><br><br>");

        /////////////////////////
        //                     //
        //  Release Triggers   //
        //                     //
        /////////////////////////

        all_latest_triggers.forEach(trigger => {
            let trigger_type = trigger.trigger_type
            let tech_info = trigger.tech_info;
            let release_ts = trigger.ts
            if (trigger_type == "earthquake") {
                let trigger_type_label = `Earthquake (${trigger.ts}): `;
                $("#triggers").append(`<b>${trigger_type_label}</b>${tech_info}<br>`);
            } else if (trigger_type == "rainfall") {
                let trigger_type_label = `Rainfall (${trigger.ts}): `;
                $("#triggers").append(`<b>${trigger_type_label}</b>${tech_info}<br>`);
            }
        });

        let moms_trigger = `<b>Manifestations of movement: </b><br />`;
        let moms_detail = "<ul style='list-style-type: none;'>";

        console.log("latest_release_moms_per_instance", latest_release_moms_per_instance);
        console.log("critical_instance_ids", critical_instance_ids);
        console.log("latest_event_moms", latest_event_moms);

        // all_latest_triggers

        latest_released_moms.forEach(moms => {
            const formatted = returnFormattedMomsDetails(moms, release_triggers, critical_instance_ids);
            const { summary } = formatted;
            moms_detail = `${moms_detail} <li>${summary}</li>`;
        })
        moms_detail = `${moms_detail} </ul>`;
        $("#triggers").append(`${moms_trigger}${moms_detail}`);
        /////////////////////////////////
        //  END of Release Triggers    //
        /////////////////////////////////

        if (validity["text_format_timestamp"] == release_schedule["text_format_timestamp"]) {
            $("#recommended_response").append("<br><b id='candidate_for_lowering'>Candidate for lowering.</b>");
            if (is_moms == false) {
                onClickRaiseMomsData();
            }
        }

        if (general_status == "lowering") {
            $("#recommended_response").append("<br>END OF VALIDITY");
            $("#raise_non_significant").hide();
            $("#candidate_for_lowering").hide();
        }
        onClickReleaseAlert(is_overdue);
    }

}

function getLatestMomsPerInstance(instance_ids) {
    let url = "http://192.168.1.10:5000/api/manifestations_of_movement/get_latest_site_moms_alerts"
    fetch(url, {
        method: 'POST',
        dataType: 'jsonp',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(instance_ids),
    }).then((responseJson) => {
    });
}

function onClickRaiseMomsData() {
    $("#recommended_response").append('<br><input class="btn btn-primary" type="button" id="raise_non_significant" value="Confirm non-significant ground movement" style="background-color: #28a745;">')
    $("#raise_non_significant").unbind();
    $("#raiseMomsModalLabel").text("Confirm non-significant ground movement");
    $("#raise_non_significant").click(function () {
        let data = {
            feature_name: "none",
            feature_type: "none"
        }
        $("#add_moms_form").hide();
        $("#clear_moms_form").hide();
        displayRaiseMomsModal(data)
    });
}


function sendEwiToEmail() {
    // $("#ewi_send_to_email").hide();
    $("#ewi_send_to_email").unbind();
    $("#ewi_send_to_email").click(function () {
        $("#sendEwiToEmailModal").modal({
            backdrop: 'static',
            keyboard: false
        })
    });

    $("#confirm_send_ewi").click(function () {
        $("#confirm_send_ewi_spinner").show();
        $("#close_send_ewi").hide();
        $("#confirm_send_ewi").hide();
        let email = $("#email_for_ewi").val();
        let html = $("#report_to_email").html();
        let url = "http://192.168.1.10:5000/api/ewi/send_ewi_via_email";
        let data = {
            email: email,
            html: html
        }
        $("#confirm_send_ewi").prop('disabled', true);

        $.post(url, data).done(function (response) {
            $("#confirm_send_ewi_spinner").hide();
            $("#close_send_ewi").show();
            $("#confirm_send_ewi").show();
            alert(response.message);
            if (response.status == true) {
                $("#email_for_ewi").val("");
                $("#sendEwiToEmailModal").modal("hide");
            }
            $("#confirm_send_ewi").prop('disabled', false);
        });
    });
}
