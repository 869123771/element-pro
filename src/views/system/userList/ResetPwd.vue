<template>
    <div class="reset-pwd">
        <avue-form v-model="form.model" :option="form.option" ref="resetPwd">
            <template slot="commit" slot-scope="scope">
                <el-button type="primary" class="w-full" :loading="loading" @click="submit">确认</el-button>
            </template>
        </avue-form>
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
                    let {model} = this.form
                    this.form = {
                        ...this.form,
                        model: {
                            ...model,
                            username
                        }
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                loading: false,
                form: {
                    option: {
                        labelWidth: 0,
                        menuBtn: false,
                        column: [
                            {
                                prop: 'username',
                                placeholder: '请输入用户账号',
                                prefixIcon: 'el-icon-user',
                                readonly: true,
                                span: 24
                            },
                            {
                                prop: 'password',
                                placeholder: '请输入登陆密码',
                                type: 'password',
                                prefixIcon: 'el-icon-lock',
                                tip: '请输入登陆密码',
                                span: 24,
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入登陆密码",
                                        trigger: "change"
                                    },
                                    {
                                        validator: (rule, value, callback) => pwdCheck(rule, value, callback, this,'resetPwd')
                                    }
                                ],
                            },
                            {
                                prop: 'confirmpassword',
                                placeholder: '请确认登陆密码',
                                prefixIcon: 'el-icon-key',
                                tip: '请确认登陆密码',
                                type: 'password',
                                span: 24,
                                rules: [{
                                    trigger: "change",
                                    validator: (rule, value, callback) => confirmPwdCheck(rule, value, callback, this)
                                }],
                            },
                            {
                                prop: 'commit',
                                formslot: true,
                                span: 24
                            },
                        ]
                    },
                    model: {}
                }
            }
        },
        methods: {
            async changePwd() {
                let {model : {username,password,confirmpassword}} = this.form
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