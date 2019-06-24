function formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    let date_format = ""
    let date_only_format = ""
    let time_format = ""
    if (timestamp == null) {
        current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS");
        date_format = moment(new Date()).format("YYYY-MM-DD");
        date_only_format = moment(new Date()).format("MMMM D, YYYY");
        time_format = moment(new Date()).format("hh:MM a");
        text_format_timestamp = moment(new Date()).format("MMMM D, YYYY hh:MM a");
    } else {
        current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS");
        date_format = moment(date).format("YYYY-MM-DD");
        date_only_format = moment(date).format("MMMM D, YYYY");
        time_format = moment(date).format("hh:MM a");
        text_format_timestamp = moment(date).format("MMMM D, YYYY hh:MM a");
    }

    return {
        current_timestamp: current_timestamp,
        date: date_format,
        time_format: time_format,
        date_only_format: date_only_format,
        text_format_timestamp: text_format_timestamp
    }
}