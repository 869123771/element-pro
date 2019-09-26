import {http, apiList} from '@/utils'

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

export const uniqueUserCheck = async (rule, username, callback) => {
    if(username){
        let {success, message} = await http.get(apiList.sys_user_unique_user_check, {username})
        if (success) {
            callback();
        } else {
            callback(new Error(message));
        }
    }
};


