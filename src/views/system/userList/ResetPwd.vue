<template>
    <div class="reset-pwd">
        <avue-form v-model="form.model" :option="form.option"></avue-form>
    </div>
</template>

<script>
    export default {
        name: "ResetPwd",
        data() {
            return {
                form: {
                    option: {
                        labelWidth: 100,
                        column: [
                            {
                                label: '用户账号',
                                prop: 'username',
                                span: 24
                            },
                            {
                                label: '登陆密码',
                                prop: 'realname',
                                type: 'password',
                                span: 24
                            },
                            {
                                label: '确认密码',
                                prop: 'confirmpassword',
                                type: 'password',
                                span: 24
                            },
                        ]
                    },
                    model: {}
                }
            }
        }
    }
</script>

<style scoped>

</style>