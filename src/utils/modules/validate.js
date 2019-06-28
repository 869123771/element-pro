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
    return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export const isPhone = (s) => {
    return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export const isURL = (s) => {
    return /^http[s]?:\/\/.*/.test(s)
}


export const pwdCheck = (rule, value, callback, _this, ref) => {
    let {model: {confirmpassword}} = _this.form
    if (confirmpassword) {
        _this.$refs[ref].validateField('confirmpassword');
    }
    callback();
}

export const confirmPwdCheck = (rule, value, callback, _this) => {
    let {model: {password}} = _this.form
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
    let {success, message} = await http.get(apiList.sys_user_unique_user_check, {username})
    if (success) {
        callback();
    } else {
        callback(new Error(message));
    }
};


