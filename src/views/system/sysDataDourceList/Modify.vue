<template>
    <div>
        <el-row>
            <el-form ref="form" :model="form" label-width="100px" :rules="rules" status-icon>
                <el-form-item label="数据源名称" prop="name">
                    <el-input v-model="form.name" placeholder="数据源名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据源编码" prop="code" :rules="[
                 {required : true, message : '必填',trigger : 'change'},
                 data.id ? {} : {validator : uniqueCheck}
            ]">
                    <el-input v-model="form.code" placeholder="数据源编码" clearable :disabled="Boolean(data.id)"></el-input>
                </el-form-item>
                <el-form-item label="数据库类型" prop="dbType">
                    <el-select v-model="form.dbType" clearable filterable class="w-full" @change = "dbTypeChange">
                        <template v-for="{itemValue,itemText} in databaseType">
                            <el-option :value="itemValue" :label="itemText"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="驱动类" prop="dbDriver">
                    <el-input v-model="form.dbDriver" placeholder="驱动类" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据源地址" prop="dbUrl">
                    <el-input v-model="form.dbUrl" placeholder="数据源地址" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据库名称" prop="dbName">
                    <el-input v-model="form.dbName" placeholder="数据库名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="dbUsername">
                    <el-input v-model="form.dbUsername" placeholder="用户名" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="dbPassword">
                    <div class = "flex">
                        <el-input type="password" v-model="form.dbPassword" show-password clearable placeholder="密码">
                        </el-input>
                        <div class = "pl-3">
                            <el-button type = "primary" @click = "test">测试</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="form.remark" placeholder="备注" rows = "4" maxlength = "100" show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "Modify",
        props: {
            data: {
                type: Object
            }
        },
        components: {

        },
        data() {
            return {
                form: {
                    name: '',
                    code: '',
                    dbType: '',
                    dbDriver: '',
                    dbUrl: '',
                    dbName: '',
                    dbUsername: '',
                    dbPassword: '',
                    remark: ''
                },
                rules: {
                    name: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    code: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    dbType: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    dbDriver: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    dbUrl: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    dbName: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    dbUsername: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    dbPassword: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                }
            }
        },
        computed: {
            ...mapState({
                databaseType: ({dict}) => dict.databaseType
            })
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        this.form = {
                            ...this.form,
                            ...props
                        }
                    }
                },
                immediate: true
            },
        },
        methods: {
            dbTypeChange(dbType){
                let dbTypeMapDbUrl = {
                    1 : 'com.mysql.jdbc.Driver',
                    2 : 'oracle.jdbc.OracleDriver',
                    3 : 'com.microsoft.sqlserver.jdbc.SQLServerDriver'
                }
                if(dbType){
                    this.form = {
                        ...this.form,
                        dbDriver : dbTypeMapDbUrl[dbType]
                    }
                }else{
                    this.form = {
                        ...this.form,
                        dbDriver : ''
                    }
                }
            },
            async test(){
                let {
                    dbType,dbDriver,dbName,dbUrl,dbUsername,dbPassword
                } = this.form
                let params = {
                    dbType,dbDriver,dbName,dbUrl,dbUsername,dbPassword
                }
                let {success,message} = await http.post(apiList.sys_data_source_test_connection,params)
                if(success){
                    sweetAlert.successWithTimer(message)
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            async uniqueCheck(rule, fieldVal, callback) {
                let params = {
                    tableName: 'sys_data_source',
                    fieldName: 'code',
                    fieldVal,
                }
                let {success, message} = await http.get(apiList.sys_dict_unique_check, params)
                if (!success) {
                    callback(new Error(message));
                } else {
                    callback();
                }
            },
            async saveData() {
                let {id} = this.data
                let params = {
                    ...this.form,
                }
                let res = {}
                if (id) {
                    res = await http.put(apiList.sys_data_source_edit, params)
                } else {
                    res = await http.post(apiList.sys_data_source_add, params)
                }
                let {success, message} = res
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifyResult', true)
                } else {
                    sweetAlert.error(message)
                    this.$emit('modifyResult', false)
                }
            },
        }
    }
</script>

<style scoped>

</style>