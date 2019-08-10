<template>
    <div class="modify">
        <!--<avue-form :option="form.option" v-model="form.model" ref="modify" @submit="submit">
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
        </avue-form>-->
        <el-form :model = "form" label-width = "100px" :status-icon="true">
            <el-form-item label = "用户账号" prop = "username">
                <el-input v-model = "form.username" placeholder = "用户账号" clearable></el-input>
            </el-form-item>
            <el-form-item label = "登陆密码" prop = "password">
                <el-input type = "password" v-model = "form.password" placeholder = "登陆密码" clearable></el-input>
            </el-form-item>
            <el-form-item label = "确认密码" prop = "confirmpassword">
                <el-input type = "password" v-model = "form.confirmpassword" placeholder = "登陆密码" clearable></el-input>
            </el-form-item>
            <el-form-item label = "用户名字" prop = "realname">
                <el-input v-model = "form.realname" placeholder = "用户名字" clearable></el-input>
            </el-form-item>
            <el-form-item label = "角色分配" prop = "selectedroles">
                <el-select v-model = "form.selectedroles" placeholder = "角色分配" clearable filterable class = "w-full">
                    <template v-for = "item in roles">
                        <el-option :value = "item.itemValue" :label = "item.itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label = "部门分配" prop = "deptName">
                <el-input v-model = "form.deptName" placeholder = "部门分配" clearable suffix-icon="el-icon-more"></el-input>
            </el-form-item>
            <el-form-item label = "头像" prop = "">

            </el-form-item>
            <el-form-item label = "生日" prop = "birthday">
                <el-date-picker type = "datetime" v-model = "form.birthday" value-format="yyyy-MM-dd hh:mm:ss" class = "full"></el-date-picker>
            </el-form-item>
            <el-form-item label = "性别" prop = "sex">
                <el-select v-model = "form.sex" placeholder = "性别" clearable filterable class = "w-full">
                    <template v-for = "item in sex">
                        <el-option :value = "item.itemValue" :label = "item.itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label = "邮箱" prop = "email">
                <el-input v-model = "form.email" placeholder = "邮箱" clearable></el-input>
            </el-form-item>
            <el-form-item label = "手机号码" prop = "phone">
                <el-input v-model = "form.phone" placeholder = "手机号码" clearable></el-input>
            </el-form-item>
            <el-form-item label = "工作流引擎" prop = "activitiSync">
                <el-radio-group v-model = "form.activitiSync">
                    <template v-for = "item in activitiSync">
                        <el-radio :label = "item.itemValue">{{item.itemText}}</el-radio>
                    </template>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <dept-search ref="deptSearch" :dept-checked-ids="deptCheckedIds"></dept-search>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {getToken} from '@/utils/modules/tools'
    import {uniqueUserCheck, pwdCheck, confirmPwdCheck, emailCheck, phoneCheck} from '@/utils/modules/validate'
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
        props: {
            data: {
                type: Object
            }
        },
        data() {
            let {id, deptId} = this.data
            let ps = id ? [] : [
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
            ]
            let dept = deptId ? [] : [
                {
                    label: '部门分配',
                    prop: 'deptName',
                    span: 24,
                    suffixIcon: 'el-icon-more',
                    clearable: false,
                    readonly: true,
                    click: () => {
                        let {checkedNodeIds} = customParams;
                        if (checkedNodeIds) {
                            this.deptCheckedIds = checkedNodeIds
                        }
                        this.$modal.show('deptSearch')
                    }
                },
            ]
            let isUserUniqueCheck = id ? {} : {validator: uniqueUserCheck}

            return {
                /*form: {

                    model: {
                        activitiSync: '1'
                    }
                },*/
                form : {
                    model : {},
                    option : {},

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
                    width: 22,
                    height: 80,
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
        watch: {
            data: {
                handler(props) {
                    if (!this.validatenull(props)) {
                        let {config: {baseUrl: {imgDomainURL}}} = constant
                        let {model} = this.form
                        let {id, sex, avatar} = props
                        this.form = {
                            ...this.form,
                            model: {
                                ...model,
                                ...props,
                                sex: sex ? sex.toString() : '',
                            }
                        }
                        this.upload = {
                            ...this.upload,
                            imageUrl: `${imgDomainURL}/${avatar}`
                        }
                        this.getUserRole(id)
                        this.getUserDept(id)
                    }
                },
                immediate: true
            },
        },
        methods: {
            async getUserRole(userid) {
                let {success, result} = await http.get(apiList.sys_role_query_user_role, {userid})
                if (success) {
                    let {model} = this.form
                    this.form = {
                        ...this.form,
                        model: {
                            ...model,
                            selectedroles: result
                        }
                    }
                }
            },
            async getUserDept(userId) {
                let {success, result} = await http.get(apiList.sys_dept_query_by_user, {userId})
                if (success) {
                    let checkedNodeIds = result.map(item => item.value)
                    let {model} = this.form
                    this.form = {
                        ...this.form,
                        model: {
                            ...model,
                            deptName: result.map(item => item.title).join(',')
                        }
                    }
                    customParams = {
                        ...customParams,
                        checkedNodeIds
                    }
                }
            },
            async generateUserId() {
                let {success, result: userId} = await http.get(apiList.sys_user_generate_user_id)
                if (success) {
                    customParams = {
                        ...customParams,
                        userId
                    }
                }
                return {userId}
            },
            confirm() {
                this.dialog = {
                    ...this.dialog,
                    loading: true
                }
                let {model, model: {id}} = this.form
                let checkedNode = this.$refs.deptSearch.$refs.tree.getCheckedNodes()
                let checkedNodeIds = checkedNode.map(({id}) => id).join(',')
                customParams = {
                    ...customParams,
                    checkedNodeIds
                }

                this.form = {
                    ...this.form,
                    model: {
                        ...model,
                        deptName: checkedNode.map(({departName}) => departName).join(',')
                    }
                }
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
                this.$modal.hide('deptSearch')
                if (!id) {
                    this.generateUserId(checkedNodeIds)
                }
            },
            submit() {
                this.$refs.modify.validate(validate => {
                    if (validate) {
                        this.commitData()
                    }
                })
            },
            async commitData() {
                let {model, model: {selectedroles}} = this.form
                let {userId, avatar, checkedNodeIds} = customParams
                let {id, deptId} = this.data || {}           //部门管理用户录入
                let params = {
                    ...model,
                    avatar,
                    id: id ? id : deptId ? deptId : userId,                 //新增取userId,如果有deptId,取这个, 编辑去带过来的id
                    selectedroles: selectedroles.join(','),
                    selecteddeparts: deptId ? deptId : Array.isArray(checkedNodeIds) ? checkedNodeIds.join(',') : checkedNodeIds
                }
                let res
                if (id) {
                    res = await http.put(apiList.sys_user_edit, params)
                } else {
                    res = await http.post(apiList.sys_user_add, params)
                }
                let {success, message} = res
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('closeFlush')
                } else {
                    sweetAlert.error(message)
                }
            },
            handleChange(file, fileList) {
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