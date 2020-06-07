import monitor from './monitor'
import system from './system'
import online from './online'
import login from './login'
import message from './message'
import workCheck from './workCheck'

let prefix = '/jeecg-boot'
let serviceMap = {
    ...system,
    ...monitor,
    ...online,
    ...login,
    ...message,
    ...workCheck
}
let result = {}
Object.keys(serviceMap).forEach(key=>{
    result[key] = prefix + serviceMap[key]
})
export default result
