export default {
    SUCCESS: '0',
    tablePageInfo : {
      datas : [],
      totalRows : 0,
      pageNum : 1,
      pageSize : 10,
      opts : [10,20,30,40],
      loading : true
    },
    errorTip: {
        userNameTip: '3到16位非特殊字符',
        passwordTip: '最少6位,至少1个大写字母,1个小写字母,1个数字,1个特殊字符',
        confirmPasswordTip: '2次密码不一致',
        phoneNumberTip : '输入合法的手机号'
    },
    regPattern: {
        userNamePattern: /^[a-zA-Z_-]{3,16}$/,
        passwordPattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
        phoneNumberPattern : /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
    }
}

