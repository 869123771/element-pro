<template>
    <div>
        <avue-form v-model="form.model" :option="form.option" ref="form"></avue-form>
        <drag-dialog :drag-dialog="dialog" @confirm="confirm">
            <component
                    :is="component.is"
                    :ref="component.ref"
                    :data="component.data"
                    @closeDialog="closeDialog"></component>
        </drag-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {http, apiList, sweetAlert} from '@/utils'
    import DragDialog from '@/components/dragDialog'
    import SelectUserByDept from './proxyManConfig/SelectUserByDept'

    export default {
        name: "ProxyManConfig",
        props: {
            proxyMan: {
                type: Object,
            }
        },
        components: {
            DragDialog,
            SelectUserByDept
        },
        data() {
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth: 110,
                        column: [
                            {
                                label: '用户名',
                                prop: 'userName',
                                readonly: true,
                                span: 24
                            },
                            {
                                label: '代理人用户名',
                                prop: 'agentUserName',
                                readonly: true,
                                suffixIcon: 'el-icon-more',
                                clearable: false,
                                span: 24,
                                rules: [
                                    {required: true, message: '必填', trigger: 'change'}
                                ],
                                click: () => {
                                    let {name} = this.dialog
                                    this.$nextTick(() => {
                                        this.$modal.show(name)
                                    })
                                }
                            },
                            {
                                label: "代理开始时间",
                                prop: "startTime",
                                type: "datetime",
                                format: "yyyy-MM-dd hh:mm:ss",
                                valueFormat: "yyyy-MM-dd hh:mm:ss",
                                span: 24,
                                rules: [
                                    {required: true, message: '必填', trigger: 'change'}
                                ]
                            },
                            {
                                label: '代理结束时间',
                                prop: "endTime",
                                type: "datetime",
                                format: "yyyy-MM-dd hh:mm:ss",
                                valueFormat: "yyyy-MM-dd hh:mm:ss",
                                span: 24,
                                rules: [
                                    {required: true, message: '必填', trigger: 'change'}
                                ]
                            },
                            {
                                label: '状态',
                                prop: 'status',
                                type: 'radio',
                                props : {
                                    label : 'itemText',
                                    value : 'itemValue'
                                },
                                span: 24,
                            },
                        ]
                    },
                    model: {}
                },
                dialog: {
                    width: 80,
                    height: 90,
                    title: '根据部门选择用户',
                    name : 'selectUser',
                    showFooter: true,
                },
                component: {
                    is: SelectUserByDept,
                    ref: 'selectUser',
                    data: {}
                },
            }
        },
        computed: {
            ...mapState({
                validStatus: ({dict}) => dict.validStatus
            })
        },
        methods: {
            ...mapActions({
                getValidStatus: 'GET_VALID_STATUS',
            }),
            setValidStatus() {
                this.$refs.form.updateDic('status', this.validStatus)
            },
            closeDialog() {
                let {name} = this.dialog
                this.$modal.hide(name)
            },
            confirm(){
                let {ref} = this.component
                let {table:{selection}} = this.$refs[ref]
                let {name} = this.dialog
                let {model} = this.form
                let agentUserName = selection.map(item=>item.username).join(',')
                this.form = {
                    ...this.form,
                    model : {
                        ...model,
                        agentUserName
                    }
                }
                this.$modal.hide(name)
            },
            async saveData(){
                debugger;
                let {model} = this.form
                let params = {
                    ...model,
                }
                let {success,message} = await http.put(apiList.sys_user_agent_edit,params)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.$emit('successClose')
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            async getProxyUserInfo() {
                let {username: userName} = this.proxyMan
                let {success, result} = await http.get(apiList.sys_user_agent_user_info_query, {userName})
                if (success) {
                    let {model} = this.form
                    this.form = {
                        ...this.form,
                        model: {
                            ...model,
                            ...result,
                        }
                    }
                }
            }
        },
        mounted() {
            this.getProxyUserInfo()
            this.getValidStatus()
            this.setValidStatus()
        }
    }
</script>

<style scoped>

</style>