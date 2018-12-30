import constant from "./constant";

let {
    errorTip: {
        userNameTip,
        passwordTip,
        confirmPasswordTip,
        phoneNumberTip
    },
    regPattern: {
        userNamePattern,
        passwordPattern,
        phoneNumberPattern
    }
} = constant

export const userName = (rule, value, callback) => {
    if (!userNamePattern.test(value)) {
        return callback(new Error(userNameTip));
    } else {
        callback();
    }
};
export const password = (rule, value, callback) => {
    if (!passwordPattern.test(value)) {
        return callback(new Error(passwordTip));
    } else {
        callback();
    }
};

export const confirmPassword = (_this, args) => {
    _this.$refs.form.validateField('password');
    let [rule,value,callback] = args
    let {password} = _this.formItem;
    if (value !== password) {
        callback(new Error(confirmPasswordTip));
    } else {
        callback()
    }
};
export const phoneNumber = (rule, value, callback) => {
    if (!phoneNumberPattern.test(value)) {
        return callback(new Error(phoneNumberTip));
    } else {
        callback();
    }
}

