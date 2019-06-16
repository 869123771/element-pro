<template>
    <div class = "modify">
        <el-scrollbar>
            <avue-form :option="form.option" v-model="form.model"></avue-form>
        </el-scrollbar>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "Modify",
        data(){
            return {
                form : {
                    option : {
                        labelWidth : 100,
                        column: [
                            {
                                label: '用户账号',
                                prop: 'username',
                                span: 24,
                                rules: [{
                                    required: true,
                                    message: "必填",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: '登陆密码',
                                prop: 'password',
                                type : 'password',
                                span: 24,
                                rules: [{
                                    required: true,
                                    message: "必填",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: '确认密码',
                                prop: 'confirmpassword',
                                type : 'password',
                                span: 24,
                                rules: [{
                                    required: true,
                                    message: "必填",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: '用户名字',
                                prop: 'realname',
                                span: 24,
                                rules: [{
                                    required: true,
                                    message: "必填",
                                    trigger: "change"
                                }],
                            },
                            {
                                label: '角色分配',
                                prop: 'selectedroles',
                                type : 'select',
                                dicData: this.roles,
                                multiple : true,
                                props : {
                                    label : 'roleName',
                                    value : 'id'
                                },
                                span: 24
                            },
                            {
                                label: '部门分配',
                                prop: 'id',
                                span: 24
                            },
                            {
                                label: '头像',
                                prop: 'avatar',
                                type: 'upload',
                                listType: 'picture-card',
                                tip: '只能上传jpg/png文件，且不超过500kb',
                                propsHttp: {
                                    res: 'data.0'
                                },
                                action: 'https://avueupload.91eic.com/upload/list',
                                span: 24,
                            },
                            {
                                label: '生日',
                                prop: 'birthday',
                                span: 24
                            },
                            {
                                label: '性别',
                                prop: 'sex_dictText',
                                span: 24
                            },
                            {
                                label: '邮箱',
                                prop: 'email',
                                span: 24
                            },
                            {
                                label: '手机号码',
                                prop: 'phone',
                                span: 24
                            },
                            {
                                label: '工作流引擎',
                                prop: 'activitiSync',
                                span: 24
                            },
                        ]
                    },
                    model : {}
                }
            }
        },
        computed : {
            ...mapState({
                roles: ({system}) => system.roles,
                activitiSync : ({dict}) => dict.activitiSync,
                depts: ({system}) => system.depts,
            })
        },
    }
</script>

<style scoped>

</style>