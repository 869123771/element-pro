import monitor from './monitor'
import system from './system'
import online from './online'
import login from './login'
import message from './message'

let prefix = '/jeecg-boot'
let serviceMap = {
    ...system,
    ...monitor,
    ...online,
    ...login,
    ...message,
}
let result = {}
Object.keys(serviceMap).forEach(key=>{
    result[key] = prefix + serviceMap[key]
})
export default result