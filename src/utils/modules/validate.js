import {http, apiList} from '@/utils'
import {email,tel,phone} from 'regular-xb'
/**
 * 邮箱
 * @param {*} s
 */
export const isEmail = (s) => {
    return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export const isMobile = (s) => {
    return /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(s)
}

/**
 * 国内座机号码
 * @param {*} s
 */
export const isPhone = (s) => {
    return /\d{3}-\d{8}|\d{4}-\d{7}/.test(s)
}

/**
 * 身份证号码
 * @param {*} s
 */
export const isID = (s) => {
    return /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/.test(s)
}

/**
 * 银行卡号
 * @param {*} s
 */
export const isPayCard = (s) => {
    return /^[1-9]\d{9,29}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export const isURL = (s) => {
    return /^http[s]?:\/\/.*/.test(s)
}


export const pwdCheck = (rule, value, callback, _this, ref) => {
    let {confirmpassword} = _this.form
    if (confirmpassword) {
        _this.$refs[ref].validateField('confirmpassword');
    }
    callback();
}

export const confirmPwdCheck = (rule, value, callback, _this) => {
    let {password} = _this.form
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== password) {
        callback(new Error('两次输入密码不一致!'));
    } else {
        callback();
    }
};

export const emailCheck = (rule, value, callback) => {
    if (value && !isEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'));
    } else {
        callback();
    }
}

export const phoneCheck = (rule, value, callback) => {
    if (value && !isMobile(value)) {
        callback(new Error('请输入正确的手机号码'));
    } else {
        callback();
    }
}

export const telephoneCheck = (rule, value, callback) => {
    if (value && !isPhone(value)) {
        callback(new Error('请输入正确的座机号码'));
    } else {
        callback();
    }
}

/*
    任何在1-6之间的一类字符的组合，弱；例如： win
    任何字符数的两类字符组合，中； 例如： win123
    12位字符数以下的三类或四类字符组合，强 例如 win123abcABC
    12位字符数以上的三类或四类字符组合，非常好。 例如：win123abcABC!

*/
export const pwdStrengthTest = (value)=>{
    debugger;
    let testResult = {
        text : '强度 : 低',
        textColor : 'danger',
        percentage : 25,
        statusColor : '#F56C6C'
    }
    let modes = 0;
    if (value && value.length < 1) return modes;
    if (/\d/.test(value)) modes++; //数字
    if (/[a-z]/.test(value)) modes++; //小写
    if (/[A-Z]/.test(value)) modes++; //大写
    if (/\W/.test(value)) modes++; //特殊字符

    //逻辑处理
    switch (modes) {
        case 1:
            testResult = {
                text : '强度 : 低',
                textColor : 'danger',
                percentage : 25,
                statusColor : '#F56C6C'
            }
            break;
        case 2:
            testResult = {
                text : '强度 : 中',
                textColor : 'warning',
                percentage : 50,
                statusColor : '#E6A23C'
            }
            break;
        case 3:
            testResult = {
                text : '强度 : 高',
                textColor : 'primary',
                percentage : 75,
                statusColor : '#409EFF'
            }
            break;
        case 4:
            testResult = {
                text : '强度 : 超高',
                textColor : 'success',
                percentage : 100,
                statusColor : '#67C23A'
            }
            break;
    }
    return testResult
}


