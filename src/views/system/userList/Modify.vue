<template>
    <div class="modify">
        <avue-form :option="form.option" v-model="form.model" ref="modify" @submit="submit">
            <template slot="avatar" slot-scope="scope">
                <el-upload
                        class="avatar-uploader"
                        :action="upload.action"
                        :headers="upload.headers"
                        list-type="picture-card"
                        :show-file-list="false"
                        :data="{isup: 1}"
                        :on-change="handleChange"
                >
                    <img v-if="upload.imageUrl" :src="upload.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
    import {uniqueUserCheck, pwdCheck, confirmPwdCheck, emailCheck, phoneCheck} from '@/utils/modules/validate'
    import dragDialog from '@/components/dragDialog'
    import DeptSearch from './DeptSearch'
    import sweetAlert from "../../../utils/modules/sweetAlert";

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
                        props: {
                            value: 'itemValue',
                            label: 'itemText'
                        },
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
                                    let {checkedNodeIds} = customParams;
                                    debugger;
                                    if (checkedNodeIds) {
                                        this.deptCheckedIds = checkedNodeIds
                                    }
                                    this.$modal.show('deptSearch')
                                }
                            },
                            {
                                label: '头像',
                                prop: 'avatar',
                                type: 'upload',
                                formslot: true,
                            },
                            {
                                label: '生日',
                                prop: 'birthday',
                                type: 'date',
                                span: 24
                            },
                            {
                                label: '性别',
                                prop: 'sex_dictText',
                                type: 'select',
                                span: 24
                            },
                            {
                                label: '邮箱',
                                prop: 'email',
                                span: 24,
                                rules: [
                                    {validator: emailCheck, trigger: 'change'}
                                ]
                            },
                            {
                                label: '手机号码',
                                prop: 'phone',
                                span: 24,
                                rules: [
                                    {validator: phoneCheck, trigger: 'change'}
                                ]
                            },
                            {
                                label: '工作流引擎',
                                prop: 'activitiSync',
                                type: 'radio',
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
                    imageUrl: '',
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
                sex: ({dict}) => dict.sex,
                roles: ({system}) => system.roles,
                activitiSync: ({dict}) => dict.activitiSync,
                depts: ({system}) => system.depts,
            }),
        },
        methods: {
            setRoles() {
                this.$refs.modify.updateDic('selectedroles', this.roles)
            },
            setSex() {
                this.$refs.modify.updateDic('sex_dictText', this.sex)
            },
            setActivitiSync() {
                this.$refs.modify.updateDic('activitiSync', this.activitiSync)
            },
            async generateuserId() {
                let {success, result: userId} = await http.get(apiList.sys_user_generate_user_id)
                if (success) {
                    customParams = {
                        ...customParams,
                        userId
                    }
                }
                return {userId}
            },
            async addUserDeptIds(departIdList) {
                let {userId} = await this.generateuserId()
                let {success} = await http.post(apiList.sys_user_add_user_dept_ids, {departIdList, userId})
            },
            confirm() {
                debugger;
                let {model} = this.form
                let checkedNode = this.$refs.deptSearch.$refs.tree.getCheckedNodes()
                let checkedNodeIds = checkedNode.map(({id}) => id)
                customParams = {
                    ...customParams,
                    checkedNodeIds
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
                this.addUserDeptIds(checkedNodeIds)
            },
            submit() {
                this.$refs.modify.validate(validate => {
                    if (validate) {
                        this.commitData()
                    }
                })
            },
            async commitData() {
                let {selectedroles} = this.form.model
                let {userId: id, avatar} = customParams
                let params = {
                    ...this.form.model,
                    id,
                    avatar,
                    selectedroles: selectedroles.join(',')
                }
                let {success, message} = await http.post(apiList.sys_user_add, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('closeFlush')
                } else {
                    sweetAlert.error(message)
                }
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
                        ],
                        imageUrl: `${imgDomainURL}/${message}`
                    }
                    customParams = {
                        ...customParams,
                        avatar: message
                    }
                }
            }
        },
        mounted() {
            this.setRoles()
            this.setSex()
            this.setActivitiSync()
        }
    }
</script>

<style scoped lang="scss">
    .modify {
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 148px;
            height: 148px;
            line-height: 148px;
            text-align: center;
        }
        .avatar {
            width: 148px;
            height: 148px;
            display: block;
        }
    }
</style>