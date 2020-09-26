<template>
    <div class="modify">
        <el-form ref="form" :model="form" label-width="110px" :status-icon="true" :rules="rules">
            <el-form-item label="标题" prop="titile">
                <el-input v-model="form.titile" placeholder="标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="消息类型" prop="msgCategory">
                <el-select v-model="form.msgCategory" placeholder="消息类型" clearable filterable class="w-full">
                    <template v-for="item in msgCategory">
                        <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
                <el-select v-model="form.priority" placeholder="优先级" clearable filterable class="w-full">
                    <template v-for="item in priority">
                        <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="通告对象类型" prop="msgType">
                <el-select v-model="form.msgType" placeholder="通告对象类型" clearable filterable class="w-full">
                    <template v-for="item in msgType">
                        <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="指定用户" prop="userIds" v-show="form.msgType === 'USER'">
                <el-select
                        v-model="form.userIds"
                        placeholder="指定用户"
                        multiple
                        filterable
                        remote
                        :remote-method="findUser"
                        :loading="select.loading"
                        value-key="username"
                        class="w-full"
                >
                    <el-option v-show="select.users.length" value="">
                        <div class="flex">
                            <div class="w-40">用户账号</div>
                            <div class="w-40">真实姓名</div>
                            <div class="w-20">性别</div>
                            <div class="w-40">手机号码</div>
                            <div class="w-40">邮箱</div>
                        </div>
                    </el-option>
                    <el-option
                            v-for="item in select.users"
                            :key="item.id"
                            :label="item.realname"
                            :value="item.id">
                        <div class="flex">
                            <div class="w-40">{{item.username}}</div>
                            <div class="w-40">{{item.realname}}</div>
                            <div class="w-20">{{item.sex_dictText}}</div>
                            <div class="w-40">{{item.phone}}</div>
                            <div class="w-40">{{item.email}}</div>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker type="datetime" v-model="form.startTime" value-format="yyyy-MM-dd hh:mm:ss"
                                placeholder="开始时间" class="w-full"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker type="datetime" v-model="form.endTime" value-format="yyyy-MM-dd hh:mm:ss"
                                placeholder="结束时间" class="w-full"></el-date-picker>
            </el-form-item>
            <el-form-item label="内容" prop="msgContent">
                <TinymceEditor v-model="form.msgContent"></TinymceEditor>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import TinymceEditor from '@/components/editor/Tinymce'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "Modify",
        components: {
            TinymceEditor,
        },
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                form: {},
                rules: {
                    titile: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    msgCategory: [
                        {required: true, message: '必填', trigger: 'change',},
                    ]
                },
                select: {
                    loading: false,
                    users: []
                },
                dialog: {
                    width: '90',
                    height: '90',
                    showFooter: true
                },
                appointUser: {
                    data: {}
                },
            }
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        let {userIds} = props
                        this.form = {
                            ...this.form,
                            ...props,
                            userIds: userIds ? userIds.split(',') : ''
                        }
                        this.findUser()
                    }
                },
                immediate: true
            },
        },
        computed: {
            ...mapState({
                msgCategory: ({dict}) => dict.msgCategory,
                priority: ({dict}) => dict.priority,
                sendStatus: ({dict}) => dict.sendStatus,
                msgType: ({dict}) => dict.msgType,
            })
        },
        methods: {
            async findUser(username) {
                this.select = {
                    ...this.select,
                    loading: true
                }
                let params = {
                    username
                }
                let {success, result: {total, records: data}} = await http.get(apiList.sys_user_query_list, params)
                if (success) {
                    this.select = {
                        ...this.select,
                        users: data,
                        loading: false
                    }
                }
            },

            saveData() {
                let {id} = this.data
                let {msgType, userIds} = this.form
                let params = {
                    ...this.form,
                    userIds: msgType === 'USER' ? userIds.join(',') : ''
                }
                if (id) {
                    this.update(params)
                } else {
                    this.add(params)
                }
            },
            async add(params) {
                let {success, message} = await http.post(apiList.sys_sys_announcement_add, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
            async update(params) {
                let {success, message} = await http.put(apiList.sys_sys_announcement_edit, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
