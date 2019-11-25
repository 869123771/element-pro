<template>
    <div class="reset-pwd">
        <el-form ref = "resetPwd" :model = "form" label-width = "0px" :status-icon = "true" :rules = "rules">
            <el-form-item prop = "username">
                <el-input
                        v-model = "form.username"
                        :placeholder = "$t('sys_user_account')"
                        prefix-icon="el-icon-user"
                        readonly
                ></el-input>
            </el-form-item>
            <el-form-item prop = "password">
                <el-input
                        v-model = "form.password"
                        type = "password"
                        :placeholder = "$t('sys_user_pwd')"
                        prefix-icon="el-icon-lock"
                ></el-input>
            </el-form-item>
            <el-form-item prop = "confirmpassword">
                <el-input
                        v-model = "form.confirmpassword"
                        type = "password"
                        :placeholder = "$t('sys_user_confirm_pwd')"
                        prefix-icon="el-icon-lock"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="w-full" :loading="loading" @click="submit">{{$t('common_confirm')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {http, apiList, constant,sweetAlert} from '@/utils'
    import {pwdCheck, confirmPwdCheck} from '@/utils/modules/validate'

    export default {
        name: "ResetPwd",
        props: {
            resetPwd: {
                type: Object
            }
        },
        watch: {
            resetPwd: {
                handler(props) {
                    let {username} = props
                    this.form = {
                        ...this.form,
                        username
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                loading: false,
                form: {

                },
                rules : {
                    password : [
                        {
                            required: true,
                            message: "请输入登陆密码",
                            trigger: "change"
                        },
                        {
                            validator: (rule, value, callback) => pwdCheck(rule, value, callback, this,'resetPwd')
                        }
                    ],
                    confirmpassword : [
                        {
                            trigger: "change",
                            validator: (rule, value, callback) => confirmPwdCheck(rule, value, callback, this)
                        }
                    ]
                }
            }
        },
        methods: {
            async changePwd() {
                let {username,password,confirmpassword} = this.form
                let params = {
                    username,password,confirmpassword
                }
                let {success,message,result} = await http.put(apiList.sys_user_change_pwd, params)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.$emit('change-pwd-ok',result)
                }
            },
            submit() {
                this.$refs.resetPwd.validate(validate => {
                    if (validate) {
                        this.changePwd()
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>