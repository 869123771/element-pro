'use strict'
import axios from 'axios'
import qs from 'qs'
import {getToken} from '@/utils/modules/tools'
import {constant, sweetAlert} from "../index";

const ajax = axios.create({
    //baseURL: process.env.NODE_ENV === 'development' ? '/jeecg-boot' : '',
    timeout: 1000,
})

ajax.interceptors.request.use(config => {
    // loading
    const token = getToken()
    if (token) {
        config.headers['X-Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    if (config.method == 'get') {
        config.params = {
            _t: Date.parse(new Date()) / 1000,
            order: 'desc',
            //column: 'createTime',
            ...config.params
        }
    }
    return config
}, error => {
    return Promise.reject(error)
})

ajax.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.resolve(error.response)
})

const checkStatus = (response) => {
    let {status: httpStatus, data: {message, success, result}} = response
    let httpStatusList = [200, 304, 400]
    let httpMsg
    switch (httpStatus) {
        case 400:
            httpMsg = '错误请求'
            break;
        case 401:
            httpMsg = '未授权，请重新登录'
            break;
        case 403:
            httpMsg = '拒绝访问'
            break;
        case 404:
            httpMsg = '请求错误,未找到该资源'
            break;
        case 405:
            httpMsg = '请求方法未允许'
            break;
        case 408:
            httpMsg = '请求超时'
            break;
        case 500:
            httpMsg = message || '服务器端出错'
            break;
        case 501:
            httpMsg = '网络未实现'
            break;
        case 502:
            httpMsg = '网络错误'
            break;
        case 503:
            httpMsg = '服务不可用'
            break;
        case 504:
            httpMsg = '网络超时'
            break;
        case 505:
            httpMsg = 'http版本不支持该请求'
            break;
        default:
            httpMsg = `连接错误${httpStatus}`
    }
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response && httpStatusList.includes(httpStatus)) {
        return {httpStatus, message, success, result}
    }
    // 异常状态下，把错误信息返回去
    return {
        httpStatus,
        message: httpMsg
    }
}

const checkCode = (res) => {
    let {httpStatus, message, success, result} = res
    if (res && httpStatus !== constant.SUCCESS) {
        sweetAlert.error(message ? message : result)
    }
    return {message, success, result}
}

export default {
    delete(url, params) {
        return ajax({
            method: 'delete',
            url,
            params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },
    put(url, data) {
        return ajax({
            method: 'put',
            url,
            data: JSON.stringify(data),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },
    post(url, data) {
        return ajax({
            method: 'post',
            url,
            data: JSON.stringify(data),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },
    get(url, params) {
        return ajax({
            method: 'get',
            url,
            params, // get 请求时带的参数
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },
    getFileDownload(url, params) {
        return ajax({
            method: 'get',
            url,
            params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType : 'blob'
        }).then(response => {
            let desObj = {}
            let {data,headers} = response

            headers['content-disposition'].split(';').forEach(item=>{
                desObj = {
                    ...desObj,
                    ...qs.parse(item)
                }
            })
            return {
                filename : desObj.filename,
                data
            }
        })
    },
    ajax(method,url, params){
        return ajax({
            method,
            url,
            params,
        })
    }
}
