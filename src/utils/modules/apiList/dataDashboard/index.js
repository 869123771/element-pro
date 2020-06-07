import dataDashboard from './dataDashboard'

let prefix = ''
let serviceMap = {
    ...dataDashboard
}
let result = {}
Object.keys(serviceMap).forEach(key=>{
    result[key] = prefix + serviceMap[key]
})
export default result
