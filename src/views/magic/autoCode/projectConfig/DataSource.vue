<template>
    <div>
        <el-row>
            <el-alert
                    title="使用数据库表生成代码时候，需要进行配置，目前仅支持MySQL数据库，其它数据库后期进行支持,如果有需要请联系。 暂不支持高版本MySQL"
                    type="info"
                    :closable="false"
                    show-icon
            >
            </el-alert>
        </el-row>
        <el-row class="mt-3">
            <avue-form v-model="form.model" :option="form.option" ref="form">
                <template slot="btn">
                    <div>
                        <el-button type="primary" icon = "el-icon-check" @click = "save">Save</el-button>
                        <el-button type="info" icon = "fa fa-fw fa-bug" @click = "test">Test Connection</el-button>
                    </div>
                </template>
            </avue-form>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, sweetAlert} from '@/utils'

    export default {
        name: "DataSource",
        props : {
            dataSourceProps : {
                type : Object
            }
        },
        data() {
            return {
                form: {
                    option: {
                        menuBtn: false,
                        labelWidth: 120,
                        column: [
                            {
                                label: '数据库名称',
                                prop: 'databaseName',
                                type : 'select',
                                dicData : [
                                    {label : 'Mysql',value : 'mysql'},
                                    {label : 'Oracle',value : 'oracle'},
                                ],
                                span: 24
                            },
                            {
                                label: '驱动名称',
                                prop: 'driverClass',
                                span: 24,
                                rules: [
                                    {required: true, message: '必填', trigger: 'change'}
                                ]
                            },
                            {
                                label: '链接地址',
                                prop: 'url',
                                span: 24,
                                rules: [
                                    {required: true, message: '必填', trigger: 'change'}
                                ]
                            },
                            {
                                label: '用户名',
                                prop: 'username',
                                span: 24,
                                rules: [
                                    {required: true, message: '必填', trigger: 'change'}
                                ]
                            },
                            {
                                label: '密码',
                                prop: 'password',
                                type: 'password',
                                span: 24,
                                rules: [
                                    {required: true, message: '必填', trigger: 'change'}
                                ]
                            },
                            {
                                label: '',
                                prop: 'btn',
                                formslot: true
                            }

                        ]
                    },
                    model: {
                        databaseName : 'mysql',
                        driverClass : 'com.mysql.jdbc.Driver',
                        url : 'jdbc:mysql://127.0.0.1:3306/jeecg-boot?characterEncoding=UTF-8&useUnicode=true&useSSL=false',
                        username : 'root',
                        password : 'root',
                    }
                },
            }
        },
        methods : {
            handlerDataSourceParams(){
                let {model} = this.form
                let configValue = {
                    ...model
                }
                let params = {
                    projectKey : this.dataSourceProps.extValue,
                    configKey : 'databaseConfig',
                    configValue : JSON.stringify(configValue),
                    type : 2,
                    scope : 1,
                    token  :'wangyang'
                }
                return params
            },
            async save(){
                let {data:{success,message,value}} = await http.ajax('post',apiList.project_config_save_data_source,this.handlerDataSourceParams())
                if(success){
                    sweetAlert.successWithTimer('保存数据库配置成功')
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            async test(){
                let {data:{success,message,value}} = await http.ajax('post',apiList.project_config_test_data_source,this.handlerDataSourceParams())
                if(success){
                    sweetAlert.successWithTimer('连接数据库成功')
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .avue-form__row {
        padding: 0px !important;
    }
</style>