
function getEWISms(alert, ts_release) {
    let template = ""
    let site = "Umingan, Alimodian, Iloilo"
    let greetings = "umaga"
    let nxt_ts_release = "<NEXT TS RELEASE>"
    switch (alert) {
        case "A1-R":
        case "ND-R":
        case "A1-R0":
        case "A1-Rx":
            template = "Magandang " + greetings + " po.\n\n" +
                "Alert 1 ang alert level sa " + site + " ngayong " + ts_release + ".\n" +
                "Maaaring magkaroon ng landslide dahil sa nakaraan o kasalukuyang ulan. Ang recommended response ay PREPARE TO ASSIST THE HOUSEHOLDS AT RISK IN RESPONDING TO A HIGHER ALERT. Inaasahan namin ang pagpapadala ng LEWC ng ground data mamaya bago mag-11:30 AM. Ang susunod na Early Warning Information ay " + nxt_ts_release + ".\n\n" +
                "Salamat."
            break;
        case "A2-m":
        case "A2-m0":
            template = "Magandang " + greetings + " po.\n\n" +
                "Alert 2 ang alert level sa " + site + " ngayong " + ts_release + ".\n" +
                "Maaaring magkaroon ng landslide dahil naka-detect ng bagong cracks sa site. Ang recommended response ay PREPARE TO EVACUATE THE HOUSEHOLDS AT RISK. Ang susunod na Early Warning Information ay " + nxt_ts_release + "\n\n" +
                "Salamat."
            break;
        case "A2-mR":
        case "A2-m0R0":
        case "A2-mR0":
        case "A2-m0R":
        case "A2-M0Rx":
            template = "Magandang " + greetings + " po.\n\n" +
                "Alert 2 ang alert level sa " + site + " ngayong " + ts_release + ".\n" +
                "Maaaring magkaroon ng landslide dahil naka-detect ng bagong cracks sa site at sa nakaraan o kasalukuyang pag-ulan. Ang recommended response ay PREPARE TO EVACUATE THE HOUSEHOLDS AT RISK. Ang susunod na Early Warning Information ay " + nxt_ts_release + "\n\n" +
                "Salamat."
            break;
        case "A3-M":
        case "A3-M0":
            template = "Magandang " + greetings + " po.\n\n" +
                "Alert 3 ang alert level sa " + site + " ngayong " + ts_release + ".\n" +
                "Nagkaroon ng landslide at maaaring magkaroon pa ng paggalaw. Ang recommended response ay EVACUATE THE HOUSEHOLDS AT RISK. Ang susunod na Early Warning Information ay " + nxt_ts_release + ".\n\n" +
                "Salamat."
            break;
        case "A3-MR":
        case "A3-M0R0":
        case "A3-MR0":
        case "A3-M0R":
        case "A3-M0Rx":
            template = "Magandang " + greetings + " po.\n\n" +
                "Alert 3 ang alert level sa " + site + " ngayong " + ts_release + ".\n" +
                "Maaaring magkaroon ng landslide dahil sa nakaraan o kasalukuyang ulan at naka-detect ng critical na cracks sa site. Ang recommended response ay EVACUATE THE HOUSEHOLDS AT RISK. Ang susunod na Early Warning Information " + nxt_ts_release + ".\n\n" +
                "Salamat."
            break;
    }

    return template;
}

function getRoutineSms(alert, ts_release) {
    let template = "Magandang tanghali po.\n\n" +
        "Alert 0 ang alert level sa Umingan, Alimodian, Iloilo ngayong " + current_date + " 12:00 NN. Inaasahan namin ang pagpapadala ng LEWC ng ground data para sa susunod na routine monitoring.\n\n"
    "Salamat."

    return template;
}

function getExtendedSms(alert, ts_release) {
    let template = ""
    switch (day) {
        case "1":
            template = "Magandang tanghali po.\n\n" +
                "Alert 0 ang alert level sa Umingan, Alimodian, Iloilo ngayong " + current_date + " 12:00 NN. Inaasahan namin ang pagpapadala ng LEWC ng ground data bukas bago mag-11:30 AM para sa ikalawang araw ng 3-day extended monitoring.\n\n"
            "Salamat.";
            break
        case "2":
            template = "Magandang tanghali po.\n\n" +
                "Alert 0 ang alert level sa Umingan, Alimodian, Iloilo ngayong " + current_date + " 12:00 NN. Inaasahan namin ang pagpapadala ng LEWC ng ground data bukas bago mag-11:30 AM para sa ikatlong araw ng 3-day extended monitoring.\n\n"
            "Salamat.";
            break
        case "3":
            template = "Magandang tanghali po.\n\n" +
                "Alert 0 ang alert level sa Umingan, Alimodian, Iloilo ngayong " + current_date + " 12:00 NN. Inaasahan namin ang pagpapadala ng LEWC ng ground data para sa susunod na routine monitoring.\n\n"
            "Salamat.";
            break
    }

    return template
}