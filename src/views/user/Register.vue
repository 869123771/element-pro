<template>
    <div class="register animated slideInUp faster h-full">
        <el-row type="flex" justify="center" align = "middle" class="px-3 h-full">
            <el-col :md="12" :xs="24" :sm="12" class="max-w-sm">
                <el-card>
                    <el-form ref = "form" :model = "form" label-width="0px" :rules="rules">
                        <el-form-item prop="username">
                            <el-input v-model="form.username" clearable placeholder="请输入用户名" size="large">
                                <i slot="prefix" class="el-input__icon el-icon-user"></i>
                            </el-input>
                        </el-form-item>
                        <el-popover
                                width = "260"
                                trigger="click"
                                placement = "right"
                        >
                            <div>
                                <div><el-link class = "":underline = "false" :type = "pwdTestResult.textColor">{{pwdTestResult.text}}</el-link></div>
                                <div class = "my-3">
                                    <el-progress
                                            :percentage="pwdTestResult.percentage"
                                            :color="pwdTestResult.statusColor"
                                            :format="()=>''"
                                    ></el-progress>
                                </div>
                                <div>
                                   <span> 请至少输入 8 个字符。请不要使用容易被猜到的密码 </span>
                                </div>
                            </div>
                            <template slot = "reference">
                                <el-form-item prop="password">
                                    <el-input type="password" v-model="form.password" show-password clearable
                                              placeholder="至少输入8位密码区分大小写" size="large" @focus="pwdTest" @input = "pwdTest">
                                        <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                                    </el-input>
                                </el-form-item>
                            </template>
                        </el-popover>
                        <el-form-item prop="confirmpassword">
                            <el-input type="password" v-model="form.confirmpassword" show-password clearable
                                      placeholder="确认密码" size="large">
                                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="email">
                            <el-input v-model="form.email" clearable placeholder="邮箱" size="large">
                                <i slot="prefix" class="el-input__icon el-icon-news"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="phone">
                            <el-input v-model="form.phone" placeholder="11位手机号" clearable>
                                <el-select v-model="form.mode" slot="prepend" class = "w-20">
                                    <el-option label="+86" :value="+86"></el-option>
                                    <el-option label="+87" :value="+87"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="smsmode">
                            <el-input v-model="form.smsmode" clearable
                                      placeholder="请输入验证码" size="large">
                                <i slot="prefix" class="el-input__icon el-icon-finished"></i>
                            </el-input>
                            <div class = "append-code" @click = "getCode">
                                <span v-if = "code.show" class = "text-gray-600">{{`${code.time} s`}}</span>
                                <span class = "text-blue-500 cursor-pointer" v-else>获取验证码</span>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="large" class="w-full" @click="register"
                                       :loading="loading" :disabled="loading">注册
                            </el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button plain size="large" class="w-full" @click="$router.push('/user/login')">使用已有账户登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {emailCheck, phoneCheck,pwdStrengthTest} from '@/utils/modules/validate'
    export default {
        name: "Register",
        data(){
            const pwdCheck = (rule, value, callback) => {
                let {confirmpassword} = this.form
                if (confirmpassword) {
                    this.$refs['form'].validateField('confirmpassword');
                }
                callback();
            }
            const confirmPwdCheck = (rule, value, callback) => {
                let {password} = this.form
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                form : {
                    mode : '+86'
                },
                code : {
                    time : 60,
                    show : false
                },
                pwdTestResult : {},
                loading : false,
                rules : {
                    username: [
                        {required: true, message: '账号不能为空', trigger: 'change'},
                        {validator : this.userCheck}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'change'},
                        {
                            validator: pwdCheck
                        }
                    ],
                    confirmpassword : [
                        {required: true, message: '密码不能为空', trigger: 'change'},
                        {
                            validator: confirmPwdCheck
                        }
                    ],
                    email : [
                        {required: true, message: '邮箱不能为空', trigger: 'change'},
                        {validator: emailCheck}
                    ],
                    phone : [
                        {required: true, message: '手机号不能为空', trigger: 'change'},
                        {validator: phoneCheck}
                    ]
                }
            }
        },
        methods : {
            getCode(){
                let {phone} = this.form
                let {time,show} = this.code
                let interval
                if(!show && phone){
                    this.code = {
                        ...this.code,
                        show : true,
                    }
                    interval = setInterval(()=>{
                        if(time === 1){
                            this.code = {
                                ...this.code,
                                show : false,
                                time : 60
                            }
                            clearInterval(interval)
                        }else{
                            this.code = {
                                ...this.code,
                                show : true,
                                time : time--
                            }
                        }
                    },1000)
                }
                this.$refs.form.validateField('phone')
            },
            pwdTest(){
                let {password} = this.form
                this.pwdTestResult = pwdStrengthTest(password)
            },
            register(){
                this.$refs.form.validate(async valid =>{
                    if(valid){
                        let {success,message} = await http.post(apiList.login_register,this.form)
                        if(success){
                            sweetAlert.successWithTimer(message)
                            this.$router.push('/user/login')
                        }else{
                            sweetAlert.error(message)
                        }
                    }
                })
            },
            async userCheck(rule, username, callback){
                if(username){
                    let {success,message} = await http.get(apiList.sys_user_unique_user_check,{username})
                    if(success){
                        callback();
                    }else{
                        callback(new Error(message));
                    }
                }
            },
        }
    }
</script>

<style scoped lang = "less">
    .register{
        /deep/ .el-input {
            &:hover {
                &::before {
                    width: 100%;
                    left: 0;
                }
            }

            &::before {
                display: block;
                position: absolute;
                content: "";
                /* -webkit-transition: width .3s ease-in-out;
                 -moz-transition: width .3s ease-in-out;
                 -ms-transition: width .3s ease-in-out;
                 -o-transition: width .3s ease-in-out;
                 transition: width .3s ease-in-out;*/
                background-color: #1890ff;
                -webkit-transition: width 0.3s, left 0.3s;
                transition: width 0.3s, left 0.3s;
                -webkit-transition-timing-function: ease-out;
                transition-timing-function: ease-out;
                left: 50%;
                bottom: -1px;
                width: 0;
                height: 1px;
            }
            &-group__prepend{
                background-color: #fff;
                border : none;
                border-bottom: 1px solid #DCDFE6;
            }
            &__prefix {
                left: 3px;
            }

            &__inner {
                border: none;
                border-bottom: 1px solid #DCDFE6;
                border-radius: 0;
            }

            i {
                font-size: 16px;
            }
        }
        .append-code{
            position: absolute;
            right: 10px;
            top: 0px;
            line-height: 40px;
            height : 40px;
        }
    }
    /deep/.el-progress{
        &-bar{
            padding-right: 0px;
        }
    }
</style>