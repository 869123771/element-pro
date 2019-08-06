import monitor from './monitor'
import system from './system'
import online from './online'
import login from './login'

let prefix = '/jeecg-boot'
let serviceMap = {
    ...system,
    ...monitor,
    ...online,
    ...login,
}
let result = {}
Object.keys(serviceMap).forEach(key=>{
    result[key] = prefix + serviceMap[key]
})
export default result