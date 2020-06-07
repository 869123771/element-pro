import jeecg from './apiList/jeecg'
import molicode from './apiList/molicode'
import dataDashboard from "./apiList/dataDashboard";
export default {
    ...jeecg,
    ...molicode,
    ...dataDashboard
}
