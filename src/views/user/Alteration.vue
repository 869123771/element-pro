<template>
    <div class="alteration animated slideInUp faster">
        <el-row type="flex" justify="center" class="px-3">
            <el-col :md="12" :xs="24" :sm="24" :lg = "8">
                <el-card>
                    <el-row>
                        <!--<el-steps :active = "steps.current" finish-status="success" simple>
                            <el-step title="用户账户"></el-step>
                            <el-step title="手机验证"></el-step>
                            <el-step title="密码"></el-step>
                            <el-step title="完成"></el-step>
                        </el-steps>-->
                        <steps :items="steps.items" :activeIndex='steps.current'/>
                    </el-row>
                    <el-row type = "flex" justify="center" class = "p-10">
                        <el-col :span = "14">
                            <el-form :model="form" :rules="rules" ref="form">
                                <div v-show = "steps.current === 1">
                                    <el-form-item prop="username">
                                        <el-input v-model="form.username" clearable placeholder="请输入帐户或手机号"
                                                  size="large">
                                            <i slot="prefix" class="el-input__icon el-icon-user"></i>
                                        </el-input>
                                    </el-form-item>
                                    <idenfiry-code :form="form" ref="identifyCode"></idenfiry-code>
                                </div>
                                <div v-show = "steps.current === 2">
                                    <el-form-item prop="username">
                                        <el-input v-model="form.username" clearable placeholder="请输入帐户或手机号" disabled
                                                  size="large">
                                            <i slot="prefix" class="el-input__icon el-icon-user"></i>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="mobile">
                                        <el-input v-model="form.mobile" clearable placeholder="手机号" size="large">
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
                                </div>
                                <el-form-item>
                                    <el-button type="primary" size="large" class="w-full" @click="next">下一步
                                    </el-button>
                                </el-form-item>
                                <el-form-item v-show = "steps.current !== 1">
                                    <el-button type="primary" size="large" class="w-full" @click="forward">上一步
                                    </el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button plain size="large" class="w-full" @click="$router.push('/user/login')">使用已有账户登录
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {http, constant, apiList, sweetAlert} from "@/utils";
    import IdenfiryCode from './component/IdentifyCode'
    import Steps from '@/components/steps'

    export default {
        name: "Alteration",
        components : {
            IdenfiryCode,
            Steps
        },
        data(){
            return {
                steps : {
                    current : 1,
                    items : [
                        {text : '用户账户',num : '<i class = "el-icon-user"></i>'},
                        {text : '手机验证',num : '<i class = "el-icon-phone"></i>'},
                        {text : '密码',num : '<i class = "el-icon-lock"></i>'},
                        {text : '完成',num : '<i class = "el-icon-check"></i>'},
                    ]
                },
                form : {
                    username : '',
                    captcha: '',
                    checkKey: Date.now(),
                    mobile : '',
                    smsmode : '',
                },
                code : {
                    time : 60,
                    show : false
                },
                rules : {
                    username : [
                        {required: true, message: '账号不能为空', trigger: 'change'},
                        {validator : this.userCheck}
                    ],
                    captcha: [
                        {required: true, message: '验证码不能为空', trigger: 'change'}
                    ],
                    mobile : [
                        {required: true, message: '手机号不能为空', trigger: 'change'},
                    ],
                    smsmode : [
                        {required: true, message: '验证码不能为空', trigger: 'change'}
                    ]
                },
            }
        },
        methods : {
            forward(){
                let {current} = this.steps
                this.steps = {
                    ...this.steps,
                    current : current - 1
                }
            },
            addStep(current){
                this.steps = {
                    ...this.steps,
                    current : current + 1
                }
            },
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
            async next(){
                let {current} = this.steps
                debugger;
                switch (current){
                    case 1 : if(await this.stepUserValid()) this.addStep(current) ;break;
                    case 2 : if(await this.stepPhoneValid()) this.addStep(current) ;break;
                }
            },
            async stepUserValid(){
                let errorMsgList = []
                this.$refs.form.validateField(['username','captcha'],errorMessage => {
                    errorMsgList.push(errorMessage)
                })
                let status = await this.validCodeCheck()
                if(!errorMsgList.filter(Boolean).length && status){
                   return true
                }
                return false
            },
            async stepPhoneValid(){
                let errorMsgList = []
                this.$refs.form.validateField(['mobile','smsmode'],errorMessage => {
                    errorMsgList.push(errorMessage)
                })
                let status = await this.validPhoneCheck()
                if(!errorMsgList.filter(Boolean).length && status){
                    return true
                }
                return false
            },
            async userCheck(rule, username, callback){
                if(username){
                    let {success,message} = await http.get(apiList.sys_user_unique_user_check,{username})
                    if(success){
                        callback(new Error('该用户不存在'));
                    }else{
                        callback();
                    }
                }
            },
            async validCodeCheck(){
                let flag = true
                let {captcha,checkKey} = this.form
                let {success,message} = await http.post(apiList.login_valid_code_check,{captcha,checkKey})
                if(!success){
                    sweetAlert.error(message)
                    flag = false
                }
                return  flag
            },
            async validPhoneCheck(){
                let flag = true
                let {phone,smscode} = this.form
                let {success,message} = await http.post(apiList.login_valid_phone_check,{phone,smscode})
                if(!success){
                    sweetAlert.error(message)
                    flag = false
                }
                return  flag
            },
        }
    }
</script>

<style scoped lang = "less">
    .alteration{
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
        .append-code{
            position: absolute;
            right: 10px;
            top: 0px;
            line-height: 40px;
            height : 40px;
        }
    }
</style>