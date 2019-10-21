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
        url: "http://192.168.150.7:5000/api/monitoring/get_candidate_and_current_alerts",
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function (data) {
        let json_data = JSON.parse(data);
        let has_alert_data = false;
        let candidate_alerts = JSON.parse(json_data.candidate_alert);
        let releases = json_data.releases;

        console.log(json_data);
        console.log(candidate_alerts);
        console.log(releases);
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
            displayLatestAlert(json_data.leo.latest, candidate_alerts, true, releases);
        }

        if (json_data.leo.overdue.length != 0) {
            displayOverdueAlert(json_data.leo.overdue, candidate_alerts, true, releases);
        }

        if (candidate_alerts.length != 0) {
            $("#no_candidate_alert").hide();
            displayCandidateAlert(candidate_alerts);
        } else {
            $("#no_candidate_alert").show();
        }



    });
}

function displayLatestAlert(latest_data, candidate_alerts, has_alert_data, releases) {
    let latest = latest_data[0];
    formatEwiDetails(candidate_alerts, latest, has_alert_data, false, releases);
    
}

function displayOverdueAlert(overdue_data, candidate_alerts, has_alert_data, releases) {
    let overdue = overdue_data[0];
    formatEwiDetails(candidate_alerts, overdue, has_alert_data, true, releases);   
}

function displayExtendedAlert(extended_data) {
    console.log(extended_data)
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
        url: "http://192.168.150.7:5000/api/monitoring/get_candidate_and_current_alerts",
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
    }else{
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

        let url = "http://192.168.150.7:5000/api/monitoring/update_alert_status"
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
            let url = 'http://192.168.150.7:5000/api/monitoring/format_candidate_alerts_for_insert'
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
                    let url = 'http://192.168.150.7:5000/api/monitoring/format_candidate_alerts_for_insert'
                    fetch(url, {
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(candidate_alerts[0]),
                    }).then((response) => response.json()).then((responseJson) => {
                        console.log(responseJson)
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

function releaseAlert(release_data, is_moms=false) {
    let url = 'http://192.168.150.7:5000/api/monitoring/insert_ewi';
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
    let url = 'http://192.168.150.7:5000/api/monitoring/update_alert_gen/' + is_onset;
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
            

            if(candidate_alerts.length != 0){
                let is_release_time = candidate_alerts[0].is_release_time;
                let internal_alert_level = candidate_alerts[0].internal_alert_level;
                let check_moms = internal_alert_level.split("")
                $.each(check_moms, function (key, value) {
                    if(is_moms == false){
                        if(value == "m" || value == "M"){
                            is_moms = true
                        }
                    }
                });
                if(is_release_time == true){
                    is_for_release = true;
                }
                if(candidate_alerts[0].public_alert_symbol == "A0"){
                    is_for_release = true
                }
            }else{
                is_for_release = false;
            }
            
            if (is_for_release == true || is_overdue == true) {
                $("#confirm_release_ewi_modal_spinner").hide();
                $("#close_release_ewi_modal").show();
                $("#confirm_release_ewi_modal").show();
                candidate_alerts[0].is_overdue = is_overdue;
                if (leo.latest.length != 0 || leo.overdue.length != 0) {
                    let url = 'http://192.168.150.7:5000/api/monitoring/format_candidate_alerts_for_insert';
                    fetch(url, {
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(candidate_alerts[0]),
                    }).then((response) => response.json()).then((responseJson) => {
                        console.log(responseJson)
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

function getAllReleases(releases, event_start, validity){
    let all_triggers = []
    let moms_instance_ids = []
    let moms_int_sym = []
    let has_latest_rainfall_trigger = false;
    $.each(releases, function (key, value) {
        let release_triggers = value.triggers;
        $.each(release_triggers, function (key, value) {
            let internal_symbol = value.internal_sym.alert_symbol;
            let ts = formatDateTime(value.ts)
            let update_ts = moment(ts.current_timestamp).add(1, "minutes").format("YYYY-MM-DD HH:mm:SS");
            let check_date_range = moment(update_ts).isBetween(event_start, validity);
            console.log(value)
            if(check_date_range == true){
                if (internal_symbol == "E") {
                let magnitude = value.trigger_misc.eq.magnitude;
                let longitude = value.trigger_misc.eq.longitude;
                let latitude = value.trigger_misc.eq.latitude;
                let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
                all_triggers.push({"trigger_type": "earthquake", "tech_info": earth_quake_info, "ts": ts["text_format_timestamp"], "internal_sym": internal_symbol})
                } else if (internal_symbol == "R") {
                    if(has_latest_rainfall_trigger == false){
                        has_latest_rainfall_trigger = true;
                        let info = value.info;
                        all_triggers.push({"trigger_type": "rainfall", "tech_info": info, "ts": ts["text_format_timestamp"], "internal_sym": internal_symbol})
                    }
                } else if (internal_symbol == "m" || internal_symbol == "M") {
                    let instance_id = value.trigger_misc.moms_releases[0].moms_details.moms_instance.instance_id;
                    let internal_sym = value.internal_sym.alert_symbol;
                    let moms_instance_id_checker = moms_instance_ids.includes(instance_id);
                    let moms_int_sym_checker = moms_int_sym.includes(internal_sym);

                    if(moms_instance_id_checker == false || moms_int_sym_checker == false){
                        moms_instance_ids.push(instance_id);
                        moms_int_sym.push(internal_sym);
                        let info = value.info;
                        all_triggers.push({"trigger_type": "moms", "tech_info": info, "ts": ts["text_format_timestamp"], "internal_sym": internal_symbol})
                    }
                }
            }
            
        });
    });

    return all_triggers
}

function recommendedResponse(alert_level){
    let recommended_response = "Monitor routine monitoring data sent by the LEWC";//alert 0

    if(alert_level == "Alert 1"){
        recommended_response = "<br>&#9679;Alert validation<br>&#9679;Normal OpCen operations<br>&#9679;Once a day EWI";
    }else if(alert_level == "Alert 2"){
        recommended_response = "<br>&#9679;Shifting<br>&#9679;Mobilize additional staff<br>&#9679;Activate EOC<br>&#9679;6x a day EWI";
    }else if(alert_level == "Alert 3"){
        recommended_response = "<br>&#9679;Forced evacuate community members/stakeholders<br>&#9679;Pre-positioning of response rescue<br>&#9679;Convene MDRRMC<br>&#9679;6x a day EWI";
    }

    return recommended_response

}

function formatEwiDetails(candidate_alerts, leo_data, has_alert_data, is_overdue, releases){
    let alert_level = "Alert " + leo_data.public_alert_symbol.alert_level;
    if(alert_level == "Alert 0"){
        if (has_alert_data == true) {
            $("#ewi_no_current_alert").show();
        } else {
            $("#ewi_no_current_alert").hide();
        }
        $("#ewi_current_alert_container").hide();
    }else{
        $("#ewi_no_current_alert").hide();
        $("#ewi_current_alert_container").show();
        let recommended_response = recommendedResponse(alert_level);
        let event_start = formatDateTime(leo_data.event.event_start);
        let validity = formatDateTime(leo_data.event.validity);
        let trigger = leo_data.releases[0].triggers;
        let all_releases_triggers = getAllReleases(releases, event_start.current_timestamp, validity.current_timestamp);
        let formatted_as_of = "";
        let latest_data_information = "";
        let has_trigger = false;
        let trigger_list_trigger_id = 0;
        let release_schedule = "";
        let general_status = "";
        let latest_trigger_details = [];

        if(candidate_alerts.length == 0){
            formatted_as_of = formatDateTime(leo_data.releases[0].data_ts);
        }else{
            formatted_as_of = formatDateTime(candidate_alerts[0].release_details.data_ts);
            let trigger_list_arr = candidate_alerts[0].trigger_list_arr;
            general_status = candidate_alerts[0].general_status
            if(candidate_alerts[0].public_alert_symbol == "A0"){
                release_schedule = candidate_alerts[0].release_details.data_ts;
            }else{
                release_schedule = candidate_alerts[0].release_schedule;
            }

            let update_ts = moment(release_schedule).add(30, "minutes").format("YYYY-MM-DD HH:mm:SS");
            release_schedule = formatDateTime(update_ts);
            if(trigger_list_arr.length != 0){
                has_trigger = true;
                $.each(trigger_list_arr, function (key, value) {
                    let trigger_type = value.trigger_type;
                    let tech_info = value.tech_info;
                    if(trigger_list_trigger_id == 0 && trigger_type == "rainfall"){
                        trigger_list_trigger_id = value.trigger_id
                    }

                    if(candidate_alerts[0].release_details.data_ts == value.ts_updated){
                        if(trigger_type == "rainfall"){
                            latest_data_information += "<b>Rainfall: </b> " + tech_info + "<br>";
                        }else if(trigger_type == "moms"){
                            latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + "<br>";
                        }else if(trigger_type == "earthquake"){
                            latest_data_information += "<b>Earthquake Alert: </b> " + tech_info + "<br>";
                        }
                    }else{
                        let with_triggers = false;
                        if(trigger_type == "moms"){
                            with_triggers = true
                            latest_data_information += "<b>Manifestations of movement: </b> " + tech_info + "<br>";
                        }else{
                            if(with_triggers == false){
                                latest_data_information += "No new retriggers<br>"
                            }
                        }
                    }
                    
                    latest_trigger_details.push({
                        "ts_updated" : value.ts_updated,
                        "tech_info" : tech_info,
                        "trigger_type": trigger_type,
                        "alert" : value.alert
                    })
                });
            }else{
                has_trigger = false;
                let latest_ts = formatDateTime(candidate_alerts[0].release_details.data_ts);
                latest_data_information += "<hr><br>As of <b>"+latest_ts["text_format_timestamp"]+"</b><br>No new retriggers<br>"
            }
            
        }

        let as_of_datetime = formatted_as_of["text_format_timestamp"] + "</b>";
        let latest_release_text = "none";
        let info = ""
        let release_ts = "";
        let all_triggers = []
        $("#recommended_response").empty();
        let has_latest_rainfall_trigger = false;
        let moms_instance_ids = []
        $.each(leo_data.releases, function (key, value) {
            if(latest_release_text == "none"){
                let formatted_release_time = moment(value.release_time, 'HH:mm').format('h:mm A');
                release_ts = formatDateTime(value.data_ts);
                
                if(release_ts["text_format_timestamp"] == event_start["text_format_timestamp"]){
                    release_ts = formatDateTime(value.data_ts);
                }else{
                    let update_ts = moment(value.data_ts).add(30, "minutes").format("YYYY-MM-DD HH:mm:SS");
                    release_ts = formatDateTime(update_ts);
                }
                latest_release_text = release_ts["date_only_format"] + " " + formatted_release_time;
            }


            let release_triggers = value.triggers;
            $.each(release_triggers, function (key, value) {
                let internal_symbol = value.internal_sym.alert_symbol;
                let ts = formatDateTime(value.ts)
                if (internal_symbol == "E") {
                    let magnitude = value.trigger_misc.eq.magnitude;
                    let longitude = value.trigger_misc.eq.longitude;
                    let latitude = value.trigger_misc.eq.latitude;
                    let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
                    all_triggers.push({"trigger_type": "earthquake", "tech_info": earth_quake_info, "ts": ts["text_format_timestamp"], "internal_sym": internal_symbol})
                } else if (internal_symbol == "R") {
                    if(has_latest_rainfall_trigger == false){
                        has_latest_rainfall_trigger = true;
                        let info = value.info;
                        all_triggers.push({"trigger_type": "rainfall", "tech_info": info, "ts": ts["text_format_timestamp"], "internal_sym": internal_symbol})
                    }
                } else if (internal_symbol == "m" || internal_symbol == "M") {
                    let instance_id = value.trigger_misc.moms_releases[0].moms_details.moms_instance.instance_id;
                    let moms_instance_id_checker = moms_instance_ids.includes(instance_id);
                    if(moms_instance_id_checker == false){
                        moms_instance_ids.push(instance_id);
                        let info = value.info;
                        all_triggers.push({"trigger_type": "moms", "tech_info": info, "ts": ts["text_format_timestamp"], "internal_sym": internal_symbol})
                    }
                }
            });
        });
        
        let latest_event_triggers = leo_data.latest_event_triggers;
        let is_equal_trigger = true;
        let is_moms = false;
        let has_rainfall = false;
        console.log("all_triggers",all_triggers)
        console.log("latest_trigger_details",latest_trigger_details)
        console.log("latest_event_triggers",latest_event_triggers)
        console.log("all_release_trig",all_releases_triggers)
        if(latest_event_triggers.length != 0){
            $.each(latest_event_triggers, function (key, value) {
                let ts = formatDateTime(value.ts);
                is_equal_trigger = false;
                let internal_symbol = value.internal_sym.alert_symbol;

                if (internal_symbol == "E") {
                    let magnitude = value.trigger_misc.eq.magnitude;
                    let longitude = value.trigger_misc.eq.longitude;
                    let latitude = value.trigger_misc.eq.latitude;
                    let as_of = "<b>Last earthquake retrigger</b> at " + "<b>"+ts["text_format_timestamp"]+ "</b><br>";
                    let earth_quake_info = "Magnitude: " + magnitude + " Longitude: " + longitude + " Latitude:" + latitude;
                    info += as_of + earth_quake_info + "<br><br>";
                } else if (internal_symbol == "R") {
                    let timestamp = ts["text_format_timestamp"];
                    let rain_info = value.info
                    let as_of = ""
                    if(has_rainfall == false){
                        if(latest_trigger_details.length != 0){
                            $.each(latest_trigger_details, function (key, value) {
                                if(value.trigger_type == "rainfall"){
                                    has_rainfall = true;
                                    let ts_updated = formatDateTime(value.ts_updated);
                                    timestamp = ts_updated["text_format_timestamp"];
                                    rain_info = value.tech_info;
                                }
                                as_of = "<b>Last rainfall retrigger</b> at " + "<b>"+timestamp+ "</b><br>";
                            });
                            
                        }else{
                            as_of = "<b>Last rainfall retrigger</b> at " + "<b>"+timestamp+ "</b><br>";
                        }
                        info += as_of + rain_info + "<br><br>";
                    }
                } else if (internal_symbol == "m" || internal_symbol == "M") {
                    // alert()
                    let timestamp = ts["text_format_timestamp"];
                    let as_of = "";
                    let moms_info = value.info;
                    if(is_moms == false){
                        is_moms = true;
                        if(all_releases_triggers.length != 0 || latest_trigger_details.length != 0){
                            $.each(all_releases_triggers, function (key, value) {
                                if(value.trigger_type == "moms"){
                                    timestamp = value.ts;
                                    moms_info = value.tech_info;
                                    if(value.internal_sym == "m"){
                                        as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
                                    }else{
                                        as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:red'>(CRITICAL)</b><br>";
                                    }
                                    info += as_of + moms_info + "<br><br>";
                                }
                            });
                            $.each(latest_trigger_details, function (key, value) {
                                if(value.trigger_type == "moms"){
                                    console.log(value)
                                    let ts_updated = formatDateTime(value.ts_updated);
                                    let timestamp = ts_updated["text_format_timestamp"];
                                    let moms_info = value.tech_info;
                                    if(value.alert == "m2"){
                                        as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
                                    }else{
                                        as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:red'>(CRITICAL)</b><br>";
                                    }
                                    info += as_of + moms_info + "<br><br>";
                                }
                            });
                        }else{
                            if(internal_symbol == "m"){
                                as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
                            }else{
                                as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:red'>(CRITICAL)</b><br>";
                            }
                            info += as_of + moms_info + "<br><br>";
                            
                        }
                    }
                    
                }
                if(has_rainfall == false){
                    if(latest_trigger_details.length != 0){
                        $.each(latest_trigger_details, function (key, value) {
                            if(value.trigger_type == "rainfall"){
                                has_rainfall = true;
                                let ts_updated = formatDateTime(value.ts_updated);
                                let timestamp = ts_updated["text_format_timestamp"];
                                let rain_info = value.tech_info;
                                let as_of = "<b>Last rainfall retrigger</b> at " + "<b>"+timestamp+ "</b><br>";
                                info += as_of + rain_info + "<br><br>";
                            }
                        });
                    }else{
                        has_rainfall = false;
                    }
                }

                if(is_moms == false){
                    let as_of = "";
                    if(all_releases_triggers.length != 0 || latest_trigger_details.length != 0){
                        $.each(all_releases_triggers, function (key, value) {
                            if(value.trigger_type == "moms"){
                                is_moms = true;
                                let timestamp = value.ts;
                                let moms_info = value.tech_info;
                                if(value.internal_sym == "m"){
                                    as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
                                }else{
                                    as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:red'>(CRITICAL)</b><br>";
                                }
                                info += as_of + moms_info + "<br><br>";
                            }
                        });
                        $.each(latest_trigger_details, function (key, value) {
                            if(value.trigger_type == "moms"){
                                let ts_updated = formatDateTime(value.ts_updated);
                                let timestamp = ts_updated["text_format_timestamp"];
                                let moms_info = value.tech_info;
                                if(value.alert == "m2"){
                                    as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:#ee9d01;'>(SIGNIFICANT)</b><br>";
                                }else{
                                    as_of = "<b>Last moms retrigger</b> at " + "<b>"+timestamp+ "</b> <b style='color:red'>(CRITICAL)</b><br>";
                                }
                                info += as_of + moms_info + "<br><br>";
                            }
                        });
                    }else{
                        is_moms = false;
                    }
                }
            });
            
        }
        

        if(alert_level == "Alert 3"){
            $("#ewi_alert_symbol").text(alert_level).css("color", "red");
        }else{
            $("#ewi_alert_symbol").text(alert_level);
        }
        $("#validity").empty().append("<b>Event started at </b>" + event_start["text_format_timestamp"]);
        $("#validity").append("<br><b>Valid until </b> " + validity["text_format_timestamp"]);
        $("#validity").append("<br><br><b>Latest release timestamp: </b> " + latest_release_text);
        $("#validity").append("<br><b>Recommended response:</b> " + recommended_response);
        
        if(is_equal_trigger == false){
            $("#recommended_response").append("<hr><br>");
        }

        if(has_trigger == true){
            $("#recommended_response").append(info + "<hr><br>As of <b>" + as_of_datetime + "<br>" + latest_data_information);
        }else{
            $("#recommended_response").append(info + latest_data_information);
        }
        
        $("#triggers").empty();
        $("#triggers_column > h5").show();
        $("#triggers").append("As of <b>" + release_ts["text_format_timestamp"] + "</b><br><br>");
        
        $.each(all_releases_triggers, function (key, value) {
            console.log("111", value)
            let trigger_type = value.trigger_type
            let tech_info = value.tech_info;
            if (trigger_type == "earthquake") {
                let trigger_type_label = "Earthquake (" + value.ts + "): ";
                $("#triggers").append("<b>" + trigger_type_label + "</b>" + tech_info + "<br>");
            } else if (trigger_type == "rainfall") {
                let trigger_type_label = "Rainfall (" + value.ts + "): ";
                $("#triggers").append("<b>" + trigger_type_label + "</b>" + tech_info + "<br>");
            } else if (trigger_type == "moms" || trigger_type == "M") {
                let trigger_type_label = "Manifestations of movement (" + value.ts + "): ";
                $("#triggers").append("<b>" + trigger_type_label + "</b>" + tech_info + "<br>");
            }

        });
        console.log(is_moms)
        if(validity["text_format_timestamp"] == release_schedule["text_format_timestamp"]){
            $("#recommended_response").append("<br><b id='candidate_for_lowering'>Candidate for lowering.</b>");
            if(is_moms == false){
                onClickRaiseMomsData();
            }
        }

        if(general_status == "lowering"){
            $("#recommended_response").append("<br>END OF VALIDITY");
            $("#raise_non_significant").hide();
            $("#candidate_for_lowering").hide();
        }
        onClickReleaseAlert(is_overdue);
    }
    
}

function onClickRaiseMomsData(){
    $("#recommended_response").append('<br><input class="btn btn-primary" type="button" id="raise_non_significant" value="Confirm non-significant ground movement" style="background-color: #28a745;">')
    $("#raise_non_significant").unbind();
    $("#raiseMomsModalLabel").text("Confirm non-significant ground movement");
    $("#raise_non_significant").click(function () {
        let data = {
            feature_name: "none",
            feature_type: "none"
        }
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
        let url = "http://192.168.150.7:5000/api/ewi/send_ewi_via_email";
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
