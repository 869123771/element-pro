<template>
    <div class="modify">
        <avue-form v-model="form.model" :option="form.option" ref="form">
            <template slot="msgContent" slot-scope="{value}">
                <wang-editor ref="wangEditor" :editorContent="value"></wang-editor>
            </template>
            <template slot="userIds" slot-scope="{value}">
                <el-select
                        placeholder="请输入关键词"
                        v-model="form.model.userIds"
                        multiple
                        filterable
                        remote
                        :remote-method="findUser"
                        :loading="select.loading"
                        value-key="username"
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
            </template>
        </avue-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import WangEditor from '@/components/editor/WangEditor'

    export default {
        name: "Modify",
        components: {
            WangEditor,
        },
        props: {
            data: {
                type: Object
            }
        },
        data() {
            let {id} = this.data
            let column = [
                {
                    label: '标题',
                    prop: 'titile',
                    span: 24,
                    rules: [
                        {required: true, message: '必填', trigger: 'change'}
                    ]
                },
                {
                    label: '消息类型',
                    prop: 'msgCategory',
                    type: 'select',
                    span: 24,
                    dictData: [],
                    rules: [
                        {required: true, message: '必填', trigger: 'change',},
                    ]
                },
                {
                    label: '优先级',
                    prop: 'priority',
                    type: 'select',
                    span: 24
                },
                {
                    label: '通告对象类型',
                    prop: 'msgType',
                    type: 'select',
                    span: 24,
                    rules: [
                        {required: true, message: '必填', trigger: 'change',},
                    ],
                    change: ({value}) => {
                        this.$nextTick(() => {
                            let index = this.$refs.form.findColumnIndex('userIds');
                            let column = this.form.option.column[index];
                            if (value === 'USER') {
                                column.display = true
                            } else {
                                column.display = false
                            }
                        })
                    }
                },
                {
                    label: '指定用户',
                    prop: 'userIds',
                    formslot: true,
                    span: 24,
                    display: false
                },
                {
                    label: '开始时间',
                    prop: 'startTime',
                    type: 'datetime',
                    valueFormat: 'yyyy-MM-dd hh:mm:ss',
                    span: 24
                },
                {
                    label: '结束时间',
                    prop: 'endTime',
                    type: 'datetime',
                    valueFormat: 'yyyy-MM-dd hh:mm:ss',
                    span: 24
                },
                {
                    label: '内容',
                    prop: 'msgContent',
                    formslot: true,
                    span: 24
                },
            ]
            return {
                form: {
                    option: {
                        props: {
                            value: 'itemValue',
                            label: 'itemText'
                        },
                        prop: 'form',
                        labelWidth: '110',
                        menuBtn: false,
                        column
                    },
                    model: {}
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
                    if (!this.validatenull(props)) {
                        let {model} = this.form
                        let {userIds} = props
                        this.form = {
                            ...this.form,
                            model: {
                                ...model,
                                ...props,
                                userIds : userIds.split(',')
                            }
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
            setMsgCategory() {
                this.$refs.form.updateDic('msgCategory', this.msgCategory)
            },
            setMsgType() {
                this.$refs.form.updateDic('msgType', this.msgType)
            },
            setPriority() {
                this.$refs.form.updateDic('priority', this.priority)
            },
            async findUser(username) {
                console.log(username)
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
                let {model, model: {msgType,userIds}} = this.form
                let params = {
                    ...model,
                    msgContent: this.$refs.wangEditor.content,
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
            this.setMsgCategory()
            this.setMsgType()
            this.setPriority()
        }
    }
</script>

<style scoped>

</style>