<template>
    <div class="modify">
        <el-form ref="modify" :model="form" label-width="100px" :status-icon="true" :rules="rules">
            <el-form-item label="用户账号" prop="username">
                <el-input v-model="form.username"
                          placeholder="用户账号"
                          clearable
                          :readonly="data.id?true:false"
                ></el-input>
            </el-form-item>
            <template v-if="!data.id">
                <el-form-item label="登陆密码" prop="password">
                    <el-input type="password" v-model="form.password" placeholder="登陆密码" clearable></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmpassword">
                    <el-input type="password" v-model="form.confirmpassword" placeholder="登陆密码" clearable></el-input>
                </el-form-item>
            </template>
            <el-form-item label="用户名字" prop="realname">
                <el-input v-model="form.realname" placeholder="用户名字" clearable></el-input>
            </el-form-item>
            <el-form-item label="角色分配" prop="selectedroles">
                <el-select v-model="form.selectedroles"
                           placeholder="角色分配"
                           clearable
                           filterable
                           multiple
                           class="w-full">
                    <template v-for="item in roles">
                        <el-option :value="item.id" :label="item.roleName"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <template v-if="!data.deptId">
                <el-form-item label="部门分配" prop="deptName">
                    <el-input v-model="form.deptName"
                              placeholder="部门分配"
                              suffix-icon="el-icon-more"
                              readonly
                              @click.native="selectDept"
                    ></el-input>
                </el-form-item>
            </template>
            <el-form-item label="头像" prop="upload">
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
            </el-form-item>
            <el-form-item label="生日" prop="birthday">
                <el-date-picker type="date"
                                v-model="form.birthday"
                                value-format="yyyy-MM-dd"
                                class="w-full"></el-date-picker>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="性别" clearable filterable class="w-full">
                    <template v-for="item in sex">
                        <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="邮箱" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="form.phone" placeholder="手机号码" clearable></el-input>
            </el-form-item>
            <el-form-item label="工作流引擎" prop="activitiSync">
                <el-radio-group v-model="form.activitiSync">
                    <template v-for="item in activitiSync">
                        <el-radio :label="item.itemValue">{{item.itemText}}</el-radio>
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
    import {isEmpty} from '30-seconds-of-code'

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
            return {
                form: {
                    username: '',                      //用户账号
                    password: '',                      //用户密码
                    confirmpassword: '',               //确认密码
                    realname: '',                      //用户名字
                    selectedroles: [],                 //角色分配
                    deptName: '',                      //部门分配
                    birthday: '',
                    sex: '',
                    email: '',
                    phone: '',
                    activitiSync: '1'
                },
                rules: {
                    username: [
                        {required: true, message: '必填', trigger: 'change'},
                    ],
                    realname: [
                        {required: true, message: '必填', trigger: 'change'},
                    ],
                    password: [
                        {required: true, message: '必填', trigger: 'change'},
                        {
                            validator: (rule, value, callback) => pwdCheck(rule, value, callback, this, 'modify')
                        }
                    ],
                    confirmpassword: [
                        {required: true, message: '必填', trigger: 'change'},
                        {
                            validator: (rule, value, callback) => confirmPwdCheck(rule, value, callback, this)
                        }
                    ],
                    email: [
                        {validator: emailCheck}
                    ],
                    phone: [
                        {validator: phoneCheck}
                    ]
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
                    this.resetForm()
                    this.userUniqueCheck(props)
                    if (!isEmpty(props)) {
                        let {config: {baseUrl: {imgDomainURL}}} = constant
                        let {id, deptId, sex, avatar} = props
                        if (id || id && deptId) {
                            this.form = {
                                ...props,
                                sex: sex ? sex.toString() : '',
                            }
                            this.upload = {
                                ...this.upload,
                                imageUrl: `${imgDomainURL}/${avatar}`
                            }
                            this.getUserRole(id)
                            this.getUserDept(id)
                        } else {
                            this.$nextTick(() => {
                                this.resetForm()
                                this.$refs.modify.resetFields()
                            })
                        }
                    } else {
                        this.$nextTick(() => {
                            this.resetForm()
                            this.$refs.modify.resetFields()
                        })
                    }
                },
                immediate: true
            },
        },
        methods: {
            resetForm() {
                this.form = {
                    username: '',                      //用户账号
                    password: '',                      //用户密码
                    confirmpassword: '',               //确认密码
                    realname: '',                      //用户名字
                    selectedroles: [],                 //角色分配
                    deptName: '',                      //部门分配
                    birthday: '',
                    sex: '',
                    email: '',
                    phone: '',
                    activitiSync: '1'
                }
                this.upload = {
                    ...this.upload,
                    imageUrl: ''
                }
            },
            userUniqueCheck(props) {
                if (!isEmpty(props)) {
                    let {id, deptId} = props
                    if (id || id && deptId) {
                        this.rules = {
                            ...this.rules,
                            username: [
                                {required: true, message: '必填'},
                            ]
                        }
                    } else {
                        this.rules = {
                            ...this.rules,
                            username: [
                                {required: true, message: '必填'},
                                {validator: uniqueUserCheck}
                            ]
                        }
                    }
                } else {
                    this.rules = {
                        ...this.rules,
                        username: [
                            {required: true, message: '必填'},
                            {validator: uniqueUserCheck}
                        ]
                    }
                }
            },
            selectDept() {
                let {name} = this.dialog
                let {deptName} = this.form
                if (deptName) {
                    this.deptCheckedIds = customParams.checkedNodeIds
                } else {
                    this.deptCheckedIds = []
                }
                this.$modal.show(name)
            },
            async getUserRole(userid) {
                let {success, result} = await http.get(apiList.sys_role_query_user_role, {userid})
                if (success) {
                    this.form = {
                        ...this.form,
                        selectedroles: result
                    }
                }
            },
            async getUserDept(userId) {
                let {success, result} = await http.get(apiList.sys_dept_query_by_user, {userId})
                if (success) {
                    let checkedNodeIds = result.map(item => item.value)
                    this.form = {
                        ...this.form,
                        deptName: result.map(item => item.title).join(',')
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
                let {name} = this.dialog
                let {id} = this.form
                let checkedNode = this.$refs.deptSearch.$refs.tree.getCheckedNodes()
                let checkedNodeIds = checkedNode.map(item => item.id)
                customParams = {
                    ...customParams,
                    checkedNodeIds
                }

                this.form = {
                    ...this.form,
                    deptName: checkedNode.map(({departName}) => departName).join(',')
                }
                this.dialog = {
                    ...this.dialog,
                    loading: false
                }
                this.$modal.hide(name)
                if (!id) {
                    this.generateUserId(checkedNodeIds)
                }
            },
            async commitData() {
                let {selectedroles} = this.form
                let {userId, avatar, checkedNodeIds} = customParams
                let {id, deptId} = this.data || {}                   //部门管理用户录入
                let params = {
                    ...this.form,
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