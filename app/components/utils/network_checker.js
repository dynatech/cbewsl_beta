import Ping from 'react-native-ping';

const Network = {
    getPing: async function (keys) {
        let ret_val = {}
        try {
            const ms = await Ping.start('192.168.8.101', { timeout: 1000 });
            ret_val = {
                status: 'Active',
                latency: ms + "ms",
                msg: 'Signal Strength: Good'
            }
        } catch (error) {
            ms = error.code
            ret_val = {
                status: 'In-active',
                latency: '',
                msg: ''
            }
            console.log(error)
            switch (ms) {
                case "0":
                    ret_val.latency = 'N/A'
                    ret_val.msg = "Request timeout.\nMake sure you are within the vicinity of the CBEWS-L network."
                    break;
                case "1":
                    ret_val.latency = 'N/A'
                    ret_val.msg = "Request flooding.\nPlease wait for the last request to finish."
                    break;
                case "2":
                case "3":
                    ret_val.latency = 'N/A'
                    ret_val.msg = "Request Unknown.\nYou are not connected to the CBEWS-L network."
                    break;
            }
        } finally {
            return ret_val
        }

    }
};

export default Network;
