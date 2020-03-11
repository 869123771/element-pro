<template>
    <div class="login animated slideInUp faster" @keydown.enter="handleSubmit">
        <el-row type="flex" justify="center" class="px-3">
            <el-col :md="12" :xs="24" :sm="12" class="max-w-sm">
                <el-card>
                    <el-row>
                        <div class="login-logo">
                            <i class="el-icon-eleme"></i>
                        </div>
                    </el-row>
                    <el-row>
                        <el-form :model="form" :rules="rules" ref="form">
                            <el-tabs v-model = "tabs.active">
                                <el-tab-pane name="account" label="帐号密码登录">
                                    <el-form-item prop="username">
                                        <el-input v-model="form.username" clearable placeholder="请输入帐户名 / jeecg"
                                                  size="large">
                                            <i slot="prefix" class="el-input__icon el-icon-user"></i>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input type="password" v-model="form.password" show-password clearable
                                                  placeholder="密码 / 123456" size="large">
                                            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                                        </el-input>
                                    </el-form-item>
                                    <idenfiry-code :form="form" ref="identifyCode"></idenfiry-code>
                                    <el-form-item prop="remember_me">
                                        <div class = "flex justify-between">
                                            <el-checkbox v-model="form.remember_me" size="large">
                                                记住密码
                                            </el-checkbox>
                                            <el-link type = "primary" :underline="false" @click = "$router.push('/user/alteration')">忘记密码</el-link>
                                        </div>
                                    </el-form-item>
                                </el-tab-pane>
                                <el-tab-pane name="phone" label="手机号登录">
                                    <el-form-item prop="mobile">
                                        <el-input v-model="form.mobile" clearable
                                                  placeholder="手机号" size="large">
                                            <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
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
                                </el-tab-pane>
                            </el-tabs>
                            <el-form-item>
                                <el-button type="primary" size="large" class="w-full" @click="handleSubmit"
                                           :loading="loading" :disabled="loading">登录
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import IdenfiryCode from './component/IdentifyCode'
    import {http, constant, apiList, sweetAlert} from "@/utils";
    import {aesEncrypt} from '@/utils/encryption/aesEncrypt'
    import {} from '30-seconds-of-code'
    export default {
        name: "login",
        components: {
            IdenfiryCode
        },
        data() {
            let checkCode = (rule, value, callback) => {
                //let {checkCode:{code}} =  this.$refs.identifyCode
                if (!value) {
                    callback(new Error('验证码不能为空'));
                }
                /*else if (value.toUpperCase() !== code.toUpperCase()) {
                    callback(new Error('请输入正确的验证码'));
                } */
                else {
                    callback()
                }
            }
            return {
                tabs: {
                    active: 'account',
                },
                form: {
                    username: 'jeecg',
                    password: '123456',
                    captcha: '',
                    remember_me : false,
                    checkKey: Date.now(),
                    mobile : '',
                    smsmode : '',
                },
                code : {
                    time : 60,
                    show : false
                },
                loading: false,
                rules: {
                    username: [
                        {required: true, message: '账号不能为空', trigger: 'change'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'change'}
                    ],
                    captcha: [
                        {required: true, message: '验证码不能为空', trigger: 'change'}
                    ],
                    mobile : [
                        {required: true, message: '手机号不能为空', trigger: 'change'},
                        {validator: this.validatePhone,},
                    ]
                }
            }

        },
        methods: {
            ...mapActions({
                handleLogin: 'HANDLE_LOGIN'
            }),
            getCode(){
                let {mobile} = this.form
                let {time,show} = this.code
                let interval
                if(!show && mobile){
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
                this.$refs.form.validateField('mobile')
            },
            handleSubmit() {
                let {active} = this.tabs
                let {username,password,captcha,checkKey,mobile,smsmode} = this.form
                let errorMsgList = []
                if(active === 'account'){
                    this.$refs.form.validateField(['username','password','captcha'],errorMessage => {
                        errorMsgList.push(errorMessage)
                    })
                    if(!errorMsgList.filter(Boolean).length){
                        this.login(apiList.login,{username,password,captcha,checkKey})
                    }
                }else if(active === 'phone'){
                    this.$refs.form.validateField(['mobile','smsmode'],errorMessage => {
                        errorMsgList.push(errorMessage)
                    })
                    if(!errorMsgList.filter(Boolean).length){
                        this.login(apiList.login_by_phone,{mobile,smsmode})
                    }
                }
            },
            async validatePhone(rule, value, callback){
                let {mobile,smsmode} = this.form
                let {show} = this.code
                let params = {
                    mobile,
                    smsmode : smsmode || '0'
                }
                if(show && mobile){
                    let {success,message} = await http.post(apiList.login_sms,params)
                    if(!success){
                        callback(new Error(message));
                    }else{
                        callback();
                    }
                }else{
                    callback()
                }
            },
            async login(api,params) {
                this.loading = true
                let {success, message, result} = await http.post(api, params)
                if (success) {
                    this.handleLogin(result)
                    this.$router.push({name: "dashboard"})
                } else {
                    this.loading = false
                    sweetAlert.error(message)
                }
            }
        },
        mounted() {

        }
    }
</script>

<style scoped lang="less">
    .login {
        &-logo {
            font-size: 4rem;
        }

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

        /deep/ .el-tabs {
            &__nav-wrap{
                &:after {
                    height: 0px;
                }
            }
            &__nav-scroll {
                padding: 0 3rem;
            }
            .append-code{
                position: absolute;
                right: 10px;
                top: 0px;
                line-height: 40px;
                height : 40px;
            }
        }
    }
</style>
