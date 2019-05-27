import { AsyncStorage } from 'react-native';
import Storage from './storage'

const Sync = {
    serverToClient: async function (keys) {

    },
    clientToServer: async function (key, value) {

    },
    overrideServer: async function (keys) {

    },
    overrideClient: async function (keys) {

    },
    updateStorage: async function (key) {
        let stored_data = Storage.getItem(key)
        let updated_data = []
        stored_data.then(response => {
            response.forEach(value => {
                value.sync_status = 3
                updated_data.push(value)
            });
            Storage.setItem(key, updated_data)
        })
    }
};

export default Sync;
