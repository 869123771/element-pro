<template>
    <div class = "modify">
        <el-row>
            <el-form ref = "form" :model = "form" label-width="100px" status-icon :rules = "rules">
                <el-col :span = "8">
                    <el-form-item label = "表名" prop = "tableName">
                        <el-input v-model = "form.tableName" placeholder = "表名" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span = "8">
                    <el-form-item label = "表描述" prop = "tableTxt">
                        <el-input v-model = "form.tableTxt" placeholder = "表描述" clearable maxlength = "50" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span = "8">
                    <el-form-item label="表类型" prop="tableType">
                        <el-select v-model="form.tableType" placeholder="表类型" clearable filterable class="w-full">
                            <template v-for="item in formTableType">
                                <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span = "8">
                    <el-form-item label = "表单分类" prop = "formCategory">
                        <el-input v-model = "form.formCategory" placeholder = "表单分类" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span = "8">
                    <el-form-item label="主键策略" prop="tableType">
                        <el-select v-model="form.idType" placeholder="主键策略" clearable filterable class="w-full">
                           <!-- <template v-for="item in formTableType">
                                <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                            </template>-->
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span = "8">
                    <el-form-item label="PC表单风格" prop="formTemplate">
                        <el-select v-model="form.formTemplate" placeholder="PC表单风格" clearable filterable class="w-full">
                            <!-- <template v-for="item in formTableType">
                                 <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                             </template>-->
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span = "8">
                    <el-form-item label="查询模式" prop="queryMode">
                        <el-select v-model="form.queryMode" placeholder="查询模式" clearable filterable class="w-full">
                            <!-- <template v-for="item in formTableType">
                                 <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                             </template>-->
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span = "8">
                    <el-form-item label="显示复选框" prop="isCheckbox">
                        <el-select v-model="form.isCheckbox" placeholder="显示复选框" clearable filterable class="w-full">
                             <template v-for="item in select.isCheckbox">
                                 <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                             </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span = "8">
                    <el-form-item label="是否分页" prop="isPage">
                        <el-select v-model="form.isPage" placeholder="是否分页" clearable filterable class="w-full">
                             <template v-for="item in select.isPage">
                                 <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                             </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span = "8">
                    <el-form-item label="是否树" prop="isTree">
                        <el-select v-model="form.isTree" placeholder="是否树" clearable filterable class="w-full">
                            <template v-for="item in select.isTree">
                                <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-row>
            <el-tabs v-model="tabs.current" @tab-click="handleClick">
                <el-tab-pane label="数据库属性" name="dbProps">
                    <dbprops :data = "tabs.data"></dbprops>
                </el-tab-pane>
                <el-tab-pane label="页面属性" name="pageProps">
                    <page-props :data = "tabs.data"></page-props>
                </el-tab-pane>
                <el-tab-pane label="校验字段" name="validFields">
                    <valid-fields :data = "tabs.data"></valid-fields>
                </el-tab-pane>
                <el-tab-pane label="外键" name="foreignKeys">
                    <foreign-keys :data = "tabs.data"></foreign-keys>
                </el-tab-pane>
                <el-tab-pane label="索引" name="index">
                    <index :data = "data.formInfo" ref = "index"></index>
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http,apiList,sweetAlert} from '@/utils'
    import Dbprops from './modify/DbProps'
    import PageProps from './modify/PageProps'
    import ValidFields from './modify/ValidFields'
    import ForeignKeys from './modify/ForeignKeys'
    import Index from './modify/Index'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "Modify",
        props : {
            data : {
                type : Object,
            }
        },
        components : {
            Dbprops,
            PageProps,
            ValidFields,
            ForeignKeys,
            Index
        },
        data(){
            return {
                form: {
                    isCheckbox : 'N',
                    isPage : 'Y',
                    isTree : 'N',
                },
                rules : {
                    tableName : [
                        {required : true, message : '必填',trigger : 'change'}
                    ],
                    tableTxt : [
                        {required : true, message : '必填',trigger : 'change'}
                    ]
                },
                select : {
                    isCheckbox : [
                        {itemText : '否',itemValue : 'N'},
                        {itemText : '是',itemValue : 'Y'},
                    ],
                    isPage : [
                        {itemText : '否',itemValue : 'N'},
                        {itemText : '是',itemValue : 'Y'},
                    ],
                    isTree : [
                        {itemText : '否',itemValue : 'N'},
                        {itemText : '是',itemValue : 'Y'},
                    ]
                },
                tabs : {
                    current :'dbProps',
                    data : {}
                }
            }
        },
        computed : {
            ...mapState({
                formTableType: ({dict}) => dict.formTableType
            })
        },
        watch : {
            data : {
                handler(props) {
                    if (!isEmpty(props)) {
                        let  {formInfo,formInfo:{tableType},tableInfo} = props
                        this.form = {
                            ...this.form,
                            ...formInfo,
                            tableType : tableType.toString()
                        }
                        this.tabs = {
                            ...this.tabs,
                            data : tableInfo
                        }
                    }
                },
                immediate : true
            },
        },
        methods : {
            handleClick(){

            },
            async saveData(){
                debugger;
                let {table:{data:indexs}} = this.$refs.index
                let {data:fields} = this.tabs
                let params = {
                    head : this.form,
                    fields,
                    indexs,
                    deleteFieldIds : [],
                    deleteIndexIds : [],
                }
                let {success,message} = await http.put(apiList.online_form_edit,params)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>