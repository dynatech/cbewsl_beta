import SendSMS from 'react-native-sms';

const EwiTemplate = {
    EWI_SMS: async function () {
        // GET TEMPLATE FROM DB
        let template = "<TEST_TEMPLATE_EWI>"
        this.OPEN_SMSAPP(template)
    },
    ROUTINE_SMS: async function () {
        // GET TEMPLATE FROM DB
        let template = "<TEST_TEMPLATE_ROUTINE>"
        this.OPEN_SMSAPP(template)
    },
    EXTENDED_SMS: async function () {
        // GET TEMPLATE FROM DB
        let template = "<TEST_TEMPLATE_EXTENDED>"
        this.OPEN_SMSAPP(template)
    },
    OPEN_SMSAPP: async function (template) {
        // GET NUMBER FROM DB
        SendSMS.send({
            body: template,
            recipients: ['0000000000000'],
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
          }, (completed, cancelled, error) => {
            // console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error); 
          });
    }
};

export default EwiTemplate;
