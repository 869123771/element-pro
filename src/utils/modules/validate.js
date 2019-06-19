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
export const isMobile =  (s) => {
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
export const isURL =  (s) => {
    return /^http[s]?:\/\/.*/.test(s)
}


export const pwdCheck = (rule, value, callback,form)=>{
    debugger;
    let {model:{confirmpassword}} = form
    if (confirmpassword) {
        this.$refs.ruleForm.validateField('checkPass');
    }
    callback();
}

export const confirmPwdCheck = (rule, value, callback,form) => {
    let {model:{password}} = form
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== password) {
        callback(new Error('两次输入密码不一致!'));
    } else {
        callback();
    }
};