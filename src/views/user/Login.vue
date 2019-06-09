<template>
    <div class = "login" @keydown.enter="handleSubmit">
        <el-row type="flex" justify="center">
            <el-col :span = "6">
                <el-card>
                    <div class = "login-logo">
                        <i class = "el-icon-eleme"></i>
                    </div>
                    <el-form :model="form" :rules="rules" ref = "form">
                        <el-form-item prop = "username">
                            <el-input v-model = "form.username" clearable placeholder="请输入帐户名 / jeecg" size="large">
                                <i slot="prefix" class="el-input__icon el-icon-user"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop = "password">
                            <el-input type = "password" v-model = "form.password" show-password clearable placeholder="密码 / 123456" size="large">
                                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                            </el-input>
                        </el-form-item>
                        <idenfiry-code :form = "form" ref = "identifyCode"></idenfiry-code>
                        <el-form-item>
                            <el-button type = "primary" size = "large" class = "w-full" @click = "handleSubmit">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import IdenfiryCode from './component/IdentifyCode'
    import {http,constant,apiList} from "@/utils";
    export default {
        name: "login",
        components : {
            IdenfiryCode
        },
        data() {
            let checkCode = (rule, value, callback)=>{
                let randomStr = this.$refs.identifyCode.randomStr.toLowerCase()
                if(!value){
                    callback(new Error('验证码不能为空'));
                }
                else if(value.toLowerCase() !==randomStr){
                    callback(new Error('请输入正确的验证码'));
                }else{
                    callback()
                }
            }
            return {
                form: {
                    username: 'admin',
                    password: '123456',
                    code : ''
                },
                rules: {
                    username: [
                        {required: true, message: '账号不能为空', trigger: 'change'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'change'}
                    ],
                    code : [
                        {validator: checkCode,},
                    ],
                }
            }

        },
        methods: {
            ...mapActions({
                handleLogin : 'HANDLE_LOGIN'
            }),
            handleSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.login()
                    }
                })
            },
            async login() {
                let params = {
                    ...this.form
                }
                let {code,result} = await http.post(apiList.login, params)
                if (code === constant.SUCCESS) {
                    this.handleLogin(result)
                    this.$router.push({ name: "dashboard" })
                }

            }
        },
        mounted() {

        }
    }
</script>

<style scoped lang = "less">
    .login{
        &-logo{
            font-size : 4rem;
        }
    }
</style>
