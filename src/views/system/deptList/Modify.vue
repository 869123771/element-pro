<template>
    <div class="add">
        <avue-form :option="form.option" v-model="form.model" ref="form">

        </avue-form>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {phoneCheck} from '@/utils/modules/validate'
    import {http, apiList, constant, sweetAlert} from '@/utils'

    let customParams = {}

    export default {
        name: "Modify",
        props: {
            data: {
                type: Object
            }
        },
        data() {
            let {flag} = this.data
            let handleData = flag ?
                [{
                    label: '上级部门',
                    prop: 'parentId',
                    readonly: true,
                    span: 24
                },
                {
                    label: '机构编码',
                    prop: 'orgCode',
                    disabled: true,
                    span: 24
                }] :
                [{
                    label: '上级部门',
                    prop: 'parentId',
                    disabled: true,
                    span: 24
                }]

            return {
                form: {
                    option: {
                        menuBtn: false,
                        column: [
                            {
                                label: '机构名称',
                                prop: 'departName',
                                span: 24,
                                rules: [
                                    {required: true, message: '必填', trigger: 'change'}
                                ]
                            },
                            ...handleData,
                            {
                                label: '手机号',
                                prop: 'mobile',
                                span: 24,
                                rules: [
                                    {validator: phoneCheck, trigger: 'change'}
                                ]
                            },
                            {
                                label: '传真',
                                prop: 'fax',
                                span: 24
                            },
                            {
                                label: '地址',
                                prop: 'address',
                                span: 24
                            },
                            {
                                label: '排序',
                                prop: 'departOrder',
                                type: 'number',
                                span: 24
                            },
                            {
                                label: '备注',
                                prop: 'memo',
                                type: 'textarea',
                                span: 24
                            },
                        ]
                    },
                    model: {}
                }
            }
        },
        computed: {
            ...mapState({
                depts: ({system}) => system.depts,
            })
        },
        watch: {
            data: {
                handler(props) {
                    if (!this.validatenull(props)) {
                        debugger;
                        let {model} = this.form
                        let {id,departName,flag,parentId} = props
                        if(flag){
                            let {parentIdName} =  props
                            this.form = {
                                ...this.form,
                                model: {
                                    ...props,
                                    parentId : parentIdName
                                }
                            }
                            customParams = {
                                ...customParams,
                                parentId
                            }
                        }else{
                            this.form = {
                                ...this.form,
                                model: {
                                    ...model,
                                    ...props,
                                    departName : '',
                                    address : '',
                                    memo : '',
                                    parentId : departName
                                }
                            }
                            customParams = {
                                ...customParams,
                                parentId : id
                            }
                        }
                    }else{
                        customParams = {
                            ...customParams,
                            parentId : undefined
                        }
                    }
                },
                immediate: true
            },
        },
        methods: {
            ...mapActions({
                getAllDepts: 'GET_ALL_DEPTS'
            }),

            saveData() {
                let {flag} = this.data
                if(flag){
                    this.saveEdit()
                }else{
                    this.saveAdd()
                }
            },
            async saveAdd(){
                let {model:{departName,mobile,fax,address,departOrder,memo}} = this.form
                let {parentId} = customParams
                let params = {
                    departName,mobile,fax,address,departOrder,memo,
                    parentId
                }
                let {success, message} = await http.post(apiList.sys_dept_add, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('closeDialog')
                } else {
                    sweetAlert.error(message)
                }
            },
            async saveEdit(){
                let {model} = this.form
                let params = {
                    ...model,
                    parentId: customParams.parentId
                }
                let {success, message} = await http.put(apiList.sys_dept_edit, params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('closeDialog')
                } else {
                    sweetAlert.error(message)
                }
            }
        }
    }
</script>

<style scoped>

</style>