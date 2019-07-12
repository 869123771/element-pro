<template>
    <div class="modify">
        <avue-form v-model="form.model" :option="form.option" ref="form">
            <template slot="msgContent" slot-scope = "{value}">
                <wang-editor ref = "wangEditor" :editorContent = "value"></wang-editor>
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
        components : {
            WangEditor
        },
        props: {
            data: {
                type: Object
            }
        },
        data() {
            let {id} = this.data
            return {
                form: {
                    option: {
                        props: {
                            value: 'itemValue',
                            label: 'itemText'
                        },
                        labelWidth : '110',
                        menuBtn: false,
                        column: [
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
                                type : 'select',
                                span: 24,
                                dictData: [],
                                rules: [
                                    {required: true, message: '必填', trigger: 'change',},
                                ]
                            },
                            {
                                label: '内容',
                                prop: 'msgContent',
                                formslot : true,
                                span: 24
                            },
                            {
                                label: '开始时间',
                                prop: 'startTime',
                                type : 'datetime',
                                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                                span: 24
                            },
                            {
                                label: '结束时间',
                                prop: 'endTime',
                                type : 'datetime',
                                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                                span: 24
                            },
                            {
                                label: '优先级',
                                prop: 'priority',
                                type : 'select',
                                span: 24
                            },
                            {
                                label: '通告对象类型',
                                prop: 'msgType',
                                type : 'select',
                                span: 24,
                                rules: [
                                    {required: true, message: '必填', trigger: 'change',},
                                ]
                            },
                        ]
                    },
                    model: {}
                }
            }
        },
        watch: {
            data: {
                handler(props) {
                    if (!this.validatenull(props)) {
                        let {model} = this.form
                        this.form = {
                            ...this.form,
                            model: {
                                ...model,
                                ...props
                            }
                        }
                    }
                },
                immediate: true
            },
        },
        computed : {
            ...mapState({
                msgCategory : ({dict}) => dict.msgCategory,
                priority : ({dict}) => dict.priority,
                sendStatus : ({dict}) => dict.sendStatus,
                msgType : ({dict}) => dict.msgType,
            })
        },
        methods: {
            setMsgCategory(){
                this.$refs.form.updateDic('msgCategory', this.msgCategory)
            },
            setMsgType(){
                this.$refs.form.updateDic('msgType', this.msgType)
            },
            setPriority(){
                this.$refs.form.updateDic('priority', this.priority)
            },
            saveData() {
                let {id} = this.data
                let {model} = this.form
                let params = {
                    ...model,
                    msgContent : this.$refs.wangEditor.content
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
        mounted(){
            this.setMsgCategory()
            this.setMsgType()
            this.setPriority()
        }
    }
</script>

<style scoped>

</style>