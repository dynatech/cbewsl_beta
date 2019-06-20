import moment from 'moment';
import Storage from './storage';

const SurficialComputation = {
    displacement: async function () {
        data_container = Storage.getItem("SurficialDataSummary")
        data_container.then(response => {
            
            current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM")
            response.forEach(element => {
                element.ts.forEach(ts_element => {
                    let time_difference = moment.utc(moment(current_timestamp).diff(moment(ts_element))).format("HH")
                    console.log("Current:"+current_timestamp)
                    console.log("Compare:"+ts_element)
                    console.log("Difference:"+time_difference)
                })
            });
        })
    }
};

export default SurficialComputation;
