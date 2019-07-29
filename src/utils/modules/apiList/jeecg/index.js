import monitor from './monitor'
import system from './system'
import login from './login'

let prefix = '/jeecg-boot'
let serviceMap = {
    ...system,
    ...monitor,
    ...login,
}
let result = {}
Object.keys(serviceMap).forEach(key=>{
    result[key] = prefix + serviceMap[key]
})
export default result