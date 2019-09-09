import SendSMS from 'react-native-sms';
import moment from "moment";

const EwiTemplate = {
    EWI_SMS: async function (alert, ts_release) {
        let template = ""
        let site = "Umingan, Alimodian, Iloilo"
        let nxt_ts_release = this.NEXT_RELEASE_TS(ts_release)
        let gndmeas_ts = this.GNDMEASE_TS(ts_release)
        let greetings = this.GREATINGS(ts_release)

        switch (alert) {
            case "A1-R":
            case "ND-R":
            case "A1-R0":
            case "A1-Rx":
                template = "Magandang " + greetings + " po.\n\n" +
                    "Alert 1 ang alert level sa " + site + " ngayong " +moment(ts_release, 'YYYY-MM-DD H:mm:ss', true).format('LLL')+ ".\n" +
                    "Maaaring magkaroon ng landslide dahil sa nakaraan o kasalukuyang ulan. Ang recommended response ay PREPARE TO ASSIST THE HOUSEHOLDS AT RISK IN RESPONDING TO A HIGHER ALERT. Inaasahan namin ang pagpapadala ng LEWC ng ground data "+gndmeas_ts+". Ang susunod na Early Warning Information ay " + nxt_ts_release + ".\n\n" +
                    "Salamat."
                break;
            case "A2-m":
            case "A2-m0":
                template = "Magandang " + greetings + " po.\n\n" +
                    "Alert 2 ang alert level sa " + site + " ngayong " +moment(ts_release, 'YYYY-MM-DD H:mm:ss', true).format('LLL')+ ".\n" +
                    "Maaaring magkaroon ng landslide dahil naka-detect ng bagong cracks sa site. Ang recommended response ay PREPARE TO EVACUATE THE HOUSEHOLDS AT RISK. Inaasahan namin ang pagpapadala ng LEWC ng ground data "+gndmeas_ts+". Ang susunod na Early Warning Information ay " + nxt_ts_release + "\n\n" +
                    "Salamat."
                break;
            case "A2-mR":
            case "A2-m0R0":
            case "A2-mR0":
            case "A2-m0R":
            case "A2-M0Rx":
                template = "Magandang " + greetings + " po.\n\n" +
                    "Alert 2 ang alert level sa " + site + " ngayong " +moment(ts_release, 'YYYY-MM-DD H:mm:ss', true).format('LLL')+ ".\n" +
                    "Maaaring magkaroon ng landslide dahil naka-detect ng bagong cracks sa site at sa nakaraan o kasalukuyang pag-ulan. Ang recommended response ay PREPARE TO EVACUATE THE HOUSEHOLDS AT RISK. Inaasahan namin ang pagpapadala ng LEWC ng ground data "+gndmeas_ts+". Ang susunod na Early Warning Information ay " + nxt_ts_release + "\n\n" +
                    "Salamat."
                break;
            case "A3-M":
            case "A3-M0":
                template = "Magandang " + greetings + " po.\n\n" +
                    "Alert 3 ang alert level sa " + site + " ngayong " +moment(ts_release, 'YYYY-MM-DD H:mm:ss', true).format('LLL')+ ".\n" +
                    "Nagkaroon ng landslide at maaaring magkaroon pa ng paggalaw. Ang recommended response ay EVACUATE THE HOUSEHOLDS AT RISK. Ang susunod na Early Warning Information ay " + nxt_ts_release + ".\n\n" +
                    "Salamat."
                break;
            case "A3-MR":
            case "A3-M0R0":
            case "A3-MR0":
            case "A3-M0R":
            case "A3-M0Rx":
                template = "Magandang " + greetings + " po.\n\n" +
                    "Alert 3 ang alert level sa " + site + " ngayong " +moment(ts_release, 'YYYY-MM-DD H:mm:ss', true).format('LLL')+ ".\n" +
                    "Maaaring magkaroon ng landslide dahil sa nakaraan o kasalukuyang ulan at naka-detect ng critical na cracks sa site. Ang recommended response ay EVACUATE THE HOUSEHOLDS AT RISK. Ang susunod na Early Warning Information " + nxt_ts_release + ".\n\n" +
                    "Salamat."
                break;
        }
        this.OPEN_SMSAPP(template)
    },
    ROUTINE_SMS: async function (current_date) {
        let template = "Magandang tanghali po.\n\n" +
            "Alert 0 ang alert level sa Umingan, Alimodian, Iloilo ngayong "+moment(ts_release, 'YYYY-MM-DD H:mm:ss', true).format('LLL')+" 12:00 NN. Inaasahan namin ang pagpapadala ng LEWC ng ground data para sa susunod na routine monitoring.\n\n"
        "Salamat."
        this.OPEN_SMSAPP(template)
    },
    EXTENDED_SMS: async function (day) {
        let template = ""
        switch (day) {
            case "1":
                template = "Magandang tanghali po.\n\n"+
                    "Alert 0 ang alert level sa Umingan, Alimodian, Iloilo ngayong "+moment(ts_release, 'YYYY-MM-DD H:mm:ss', true).format('LLL')+" 12:00 NN. Inaasahan namin ang pagpapadala ng LEWC ng ground data bukas bago mag-11:30 AM para sa ikalawang araw ng 3-day extended monitoring.\n\n"
                    "Salamat.";
                break
            case "2":
                template = "Magandang tanghali po.\n\n"+
                    "Alert 0 ang alert level sa Umingan, Alimodian, Iloilo ngayong "+moment(ts_release, 'YYYY-MM-DD H:mm:ss', true).format('LLL')+" 12:00 NN. Inaasahan namin ang pagpapadala ng LEWC ng ground data bukas bago mag-11:30 AM para sa ikatlong araw ng 3-day extended monitoring.\n\n"
                    "Salamat.";
                break
            case "3":
                template = "Magandang tanghali po.\n\n"+
                    "Alert 0 ang alert level sa Umingan, Alimodian, Iloilo ngayong "+moment(ts_release, 'YYYY-MM-DD H:mm:ss', true).format('LLL')+" 12:00 NN. Inaasahan namin ang pagpapadala ng LEWC ng ground data para sa susunod na routine monitoring.\n\n"
                    "Salamat.";
                break
        }
        this.OPEN_SMSAPP(template)
    },
    OPEN_SMSAPP: async function (template) {
        // GET NUMBER FROM DB
        SendSMS.send({
            body: template,
            recipients: [],
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
        }, (completed, cancelled, error) => {
            // console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error); 
        });
    },
    NEXT_RELEASE_TS: function (release_ts) {
        let release_hour = parseInt(release_ts.substring(11,13));
        let next_release = ""
        if (release_hour > 0 && release_hour <= 4) {
           next_release = "Mamayang 04:00 AM"
        } else if (release_hour > 4 && release_hour <= 8) {
           next_release = "Mamayang 08:00 AM"
        } else if (release_hour > 8 && release_hour <= 12) {
           next_release = "Mamayang 12:00 PM"
        } else if (release_hour > 12 && release_hour <= 16) {
           next_release = "Mamayang 04:00 PM"
        } else if (release_hour > 16 && release_hour <= 20) {
           next_release = "Mamayang 08:00 PM"
        } else if (release_hour > 20 && release_hour <= 23) {
           next_release = "Bukas ng 12:00 AM"
        }

        return next_release;
    },
    GNDMEASE_TS: function (release_ts) {
        let release_hour = parseInt(release_ts.substring(11,13));
        let gndmeas_ts = ""
        if (release_hour > 0 && release_hour <= 7) {
           gndmeas_ts = "Mamaya bago mag 07:30 AM"
        } else if (release_hour > 8 && release_hour <= 11) {
           gndmeas_ts = "Mamaya bago mag 11:30 AM"
        } else if (release_hour > 12 && release_hour <= 15) {
           gndmeas_ts = "Mamaya bago mag 03:30 PM"
        } else if (release_hour > 16 && release_hour <= 23) {
           gndmeas_ts = "Bukas bago mag 07:30 AM"
        }

        return gndmeas_ts;
    },
    GREATINGS: function (release_ts) {
        let release_hour = parseInt(release_ts.substring(11,13));
        let greetings = ""
        if (release_hour >= 0 && release_hour <= 11) {
            greetings = "Umaga"
        } else if (release_hour == 12) {
            greetings = "Tanghali"
        } else if (release_hour > 12 && release_hour <= 17) {
            greetings = "Hapon"
        } else {
            greetings = "Gabi"
        }
        return greetings;
    }
};

export default EwiTemplate;
