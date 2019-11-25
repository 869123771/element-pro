<template>
    <div class="add">
        <el-form ref = "form" :model = "form" label-width="80px" :status-icon="true" :rules = "rules">
            <el-form-item label = "机构名称" prop = "departName">
                <el-input v-model = "form.departName" placeholder = "机构名称" clearable></el-input>
            </el-form-item>
            <el-form-item label = "机构类别" prop = "orgCategory">
                <el-radio-group v-model = "form.orgCategory" v-if = "!data.id">
                    <template v-for = "{itemValue,itemText} in orgCategoryFilter">
                        <el-radio :label = "itemValue">{{itemText}}</el-radio>
                    </template>
                </el-radio-group>
                <el-radio-group v-model = "form.orgCategory" v-else>
                    <template v-for = "{itemValue,itemText} in orgCategory">
                        <el-radio :label = "itemValue">{{itemText}}</el-radio>
                    </template>
                </el-radio-group>
            </el-form-item>
            <template v-if = "data.id">
                <el-form-item label = "上级部门" prop = "parentName">
                    <el-input v-model = "form.parentName" placeholder = "上级部门" readonly></el-input>
                </el-form-item>
                <el-form-item label = "机构编码" prop = "orgCode" v-if = "data.flag">
                    <el-input v-model = "form.orgCode" placeholder = "机构编码" disabled></el-input>
                </el-form-item>
            </template>
            <el-form-item label = "电话" prop = "mobile">
                <el-input v-model = "form.mobile" placeholder = "电话" clearable></el-input>
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
    import {telephoneCheck} from '@/utils/modules/validate'
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
                form: {
                    departName : '',                         //机构名称
                    orgCategory : '1',                       //机构类别
                    parentName : '',                         //上级部门
                    orgCode : '',                            //机构编码
                },
                rules : {
                    departName : [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    mobile : [
                        {validator: telephoneCheck, trigger: 'change'}
                    ],
                },
            }
        },
        computed: {
            ...mapState({
                dept: ({system}) => system.dept,
                orgCategory : ({dict}) => dict.orgCategory
            }),
            orgCategoryFilter(){
                return this.orgCategory.filter(item=>Number(item.itemValue) === 1)
            }
        },
        watch: {
            data: {
                handler(props) {
                    if(!isEmpty(props)){
                        let {id,departName,flag,parentName} = props
                        if(id){
                            if(flag){                                   //修改子部门
                                this.form = {
                                    ...this.form,
                                    ...props
                                }
                            }else{                                      //新增子部门
                                this.form = {
                                    ...this.form,
                                    ...props,
                                    departName : '',
                                    mobile : '',
                                    fax : '',
                                    address : '',
                                    departOrder : '',
                                    memo : ''
                                }
                            }
                        }else{                                          //新增一级部门
                            this.form = {}
                        }
                    }
                },
                immediate: true
            },
        },
        methods: {
            ...mapActions({
                getAllDept: 'GET_ALL_DEPT',
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
                let {departName,mobile,fax,address,departOrder,memo,parentId,id} = this.form
                let {flag} = this.data
                let params = {
                    departName,mobile,fax,address,departOrder,memo,
                    parentId : id ? flag ? parentId : id : ''
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
        },
    }
</script>

<style scoped>

</style>