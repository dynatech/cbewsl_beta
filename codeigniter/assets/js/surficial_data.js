$(document).ready(function () {
    initializeSurficialData();
});

function initializeSurficialData() {
    $('#surficial-data-tab').on('click',function () {
        console.log("Loaded");
        $(".surficial-measuremnt-container h5").text("Change");
        fetch('http://192.168.150.10:5000/api/surficial_data/get_surficial_data').then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            let surficial_summary = responseJson;
            let formatted_date = formatDateTime(surficial_summary[0].surficial_data[0].ts[surficial_summary[0].surficial_data[0].ts.length - 1]);
            let last_data = "Last surficial data received is on "+ formatted_date.text_format_timestamp;
            $(".surficial-measuremnt-container h5").text(last_data);
            $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Type of Feature: "+surficial_summary[0].moms_data[0].type_of_feature+"</p>");
            $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Description: "+surficial_summary[0].moms_data[0].description+"</p>");
            $(".moms-container").append("<p style='padding-left: 10px; color: #717171'>Name of Feature: "+surficial_summary[0].moms_data[0].name_of_feature+"</p>");
            
            $(".surficial-graph-container").highcharts({
                series: data,
                chart: {
                    type: "line",
                    zoomType: "x",
                    panning: true,
                    panKey: "shift",
                    height: 400,
                    resetZoomButton: {
                        position: {
                            x: 0,
                            y: -30
                        }
                    }
                },
                title: {
                    text: `<b>Surficial Data History Chart of ${title_var}</b>`,
                    y: 22
                },
                subtitle: {
                    text: `${subtext}As of: <b>${moment(end_date).format("D MMM YYYY, HH:mm")}</b>`,
                    style: { fontSize: "13px" }
                },
                yAxis: {
                    title: {
                        text: "<b>Displacement (cm)</b>"
                    }
                },
                xAxis: {
                    min: Date.parse(start_date),
                    max: Date.parse(end_date),
                    type: "datetime",
                    dateTimeLabelFormats: {
                        month: "%e. %b %Y",
                        year: "%b"
                    },
                    title: {
                        text: "<b>Date</b>"
                    }
                },
                tooltip: {
                    shared: true,
                    crosshairs: true
                },
                plotOptions: {
                    line: {
                        marker: {
                            enabled: true
                        },
                        dashStyle: "ShortDash"
                    },
                    series: {
                        marker: {
                            radius: 3
                        },
                        cursor: "pointer"
                    }
                },
                credits: {
                    enabled: false
                }
            });
        })
        .catch((error) => {
            console.log(error)
        });
    });
};

function formatDateTime(date = null) {
    let timestamp = date;
    let current_timestamp = ""
    let text_format_timestamp = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
      date = moment(new Date()).format("MMMM D, YYYY")
      time = moment(new Date()).format("h:mm A")
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm A")
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS")
      date = moment(date).format("MMMM D, YYYY")
      time = moment(date).format("h:mm A")
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm A")
    }

    return {
      current_timestamp: current_timestamp,
      date: date,
      time: time,
      text_format_timestamp: text_format_timestamp
    }
  }
