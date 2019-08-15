<template>
    <div class="add">
        <el-form ref = "form" :model = "form" label-width="80px" :status-icon="true" :rules = "rules">
            <el-form-item label = "机构名称" prop = "departName">
                <el-input v-model = "form.departName" placeholder = "机构名称" clearable></el-input>
            </el-form-item>
            <template v-if = "data.flag">
                <el-form-item label = "上级部门" prop = "parentId">
                    <el-input v-model = "form.parentId" placeholder = "上级部门" readonly></el-input>
                </el-form-item>
                <el-form-item label = "机构编码" prop = "orgCode">
                    <el-input v-model = "form.orgCode" placeholder = "机构编码" disabled></el-input>
                </el-form-item>
            </template>
            <el-form-item label = "手机号" prop = "mobile">
                <el-input v-model = "form.mobile" placeholder = "手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label = "传真" prop = "fax">
                <el-input v-model = "form.fax" placeholder = "传真" clearable></el-input>
            </el-form-item>
            <el-form-item label = "地址" prop = "address">
                <el-input v-model = "form.address" placeholder = "地址" clearable></el-input>
            </el-form-item>
            <el-form-item label = "排序" prop = "departOrder">
                <el-input-number :min = "0" v-model = "form.departOrder" placeholder = "排序" clearable class="w-full"></el-input-number>
            </el-form-item>
            <el-form-item label = "备注" prop = "memo">
                <el-input type = "textarea" v-model = "form.memo" placeholder = "备注" clearable maxlength="100"
                          show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {phoneCheck} from '@/utils/modules/validate'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {isEmpty} from '30-seconds-of-code'

    let customParams = {}

    export default {
        name: "Modify",
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                form: {},
                rules : {
                    departName : [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    mobile : [
                        {validator: phoneCheck, trigger: 'change'}
                    ],
                },
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
                    if (!isEmpty(props)) {
                        let {id,departName,flag,parentId} = props
                        if(flag){
                            let {parentIdName} =  props
                            this.form = {
                                ...this.form,
                                ...props,
                                parentId : parentIdName
                            }
                            customParams = {
                                ...customParams,
                                parentId
                            }
                        }else{
                            this.form = {
                                ...this.form,
                                ...model,
                                ...props,
                                departName : '',
                                address : '',
                                memo : '',
                                parentId : departName
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
                let {departName,mobile,fax,address,departOrder,memo} = this.form
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
                let params = {
                    ...this.form,
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