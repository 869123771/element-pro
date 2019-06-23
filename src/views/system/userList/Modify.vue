<template>
    <div class="modify">
        <avue-form :option="form.option" v-model="form.model" ref="modify">
            <template slot="avatar" slot-scope="scope">
                <el-upload
                        :action="upload.action"
                        :headers="upload.headers"
                        list-type="picture-card"
                        :show-file-list="false"
                        :data="{isup: 1}"
                        :file-list="upload.fileList"
                        :on-change="handleChange"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </template>
        </avue-form>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <dept-search ref="deptSearch" :dept-checked-ids="deptCheckedIds"></dept-search>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant} from '@/utils'
    import {getToken} from '@/utils/modules/tools'
    import {uniqueUserCheck, pwdCheck, confirmPwdCheck} from '@/utils/modules/validate'
    import dragDialog from '@/components/dragDialog'
    import DeptSearch from './DeptSearch'

    let customParams = {}
    const uploadAction = () => {
        let {config: {baseUrl: {domianURL}}} = constant
        return `${domianURL}/${apiList.sys_common_upload}`
    }
    export default {
        name: "Modify",
        components: {
            dragDialog,
            DeptSearch
        },
        data() {
            return {
                form: {
                    option: {
                        labelWidth: 100,
                        column: [
                            {
                                label: '用户账号',
                                prop: 'username',
                                span: 24,
                                rules: [
                                    {
                                        required: true,
                                        message: "必填",
                                        trigger: "change"
                                    },
                                    {validator: uniqueUserCheck}
                                ],
                            },
                            {
                                label: '登陆密码',
                                prop: 'password',
                                type: 'password',
                                span: 24,
                                rules: [
                                    {
                                        required: true,
                                        message: "必填",
                                        trigger: "change"
                                    },
                                    {
                                        validator: (rule, value, callback) => pwdCheck(rule, value, callback, this, 'modify')
                                    }
                                ],
                            },
                            {
                                label: '确认密码',
                                prop: 'confirmpassword',
                                type: 'password',
                                span: 24,
                                rules: [
                                    {
                                        required: true,
                                        message: "必填",
                                        trigger: "change"
                                    },
                                    {
                                        validator: (rule, value, callback) => confirmPwdCheck(rule, value, callback, this)
                                    }
                                ],
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
                                type: 'select',
                                filterable: true,
                                multiple: true,
                                props: {
                                    label: 'roleName',
                                    value: 'id'
                                },
                                span: 24
                            },
                            {
                                label: '部门分配',
                                prop: 'id',
                                span: 24,
                                suffixIcon: 'el-icon-more',
                                clearable: false,
                                readonly: true,
                                click: () => {
                                    let {checkedNodeId} = customParams;
                                    debugger;
                                    if (checkedNodeId) {
                                        this.deptCheckedIds = checkedNodeId.split(',')
                                    }
                                    this.$modal.show('deptSearch')
                                }
                            },
                            {
                                label: '头像',
                                prop: 'avatar',
                                type: 'upload',
                                formslot: true,
                                /*listType: 'picture-card',
                                tip: '只能上传jpg/png文件，且不超过500kb',
                                data: {
                                    isup: 1
                                },
                                propsHttp: {
                                    res: 'data.0'
                                },
                                action: this.uploadAction,
                                span: 24,*/
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
                    model: {}
                },
                deptCheckedIds: [],
                upload: {
                    action: uploadAction(),
                    headers: {
                        'X-Access-Token': getToken(),
                    },
                    fileList: []
                },
                dialog: {
                    width: '22',
                    height: '500',
                    showFooter: true,
                    title: '部门搜索',
                    name: 'deptSearch'
                },
            }
        },
        computed: {
            ...mapState({
                roles: ({system}) => system.roles,
                activitiSync: ({dict}) => dict.activitiSync,
                depts: ({system}) => system.depts,
            }),
        },
        methods: {
            setRoles() {
                this.$refs.modify.updateDic('selectedroles', this.roles)
            },
            confirm() {
                debugger;
                let {model} = this.form
                let checkedNode = this.$refs.deptSearch.$refs.tree.getCheckedNodes()
                customParams = {
                    ...customParams,
                    checkedNodeId: checkedNode.map(({id}) => id).join(',')
                }

                this.form = {
                    ...this.form,
                    model: {
                        ...model,
                        id: checkedNode.map(({departName}) => departName).join(',')
                    }
                }
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
                this.$modal.hide('deptSearch')
            },
            handleChange(file, fileList) {
                debugger;
                let {response, response: {success, message} = {}} = file
                if (response && success) {
                    let [fileItem] = fileList
                    let {config: {baseUrl: {imgDomainURL}}} = constant
                    this.upload = {
                        ...this.upload,
                        fileList: [
                            {
                                ...fileItem,
                                url: `${imgDomainURL}/${message}`
                            }
                        ]
                    }
                }
            }
        },
        mounted() {
            this.setRoles()
        }
    }
</script>

<style scoped>

</style>