<template>
    <div class="modify">
        <el-row>
            <el-form ref="form" :model="form" label-width="100px" status-icon :rules="rules">
                <el-col  :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="表名" prop="tableName">
                        <el-input v-model="form.tableName" placeholder="表名" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="表描述" prop="tableTxt">
                        <el-input v-model="form.tableTxt" placeholder="表描述" clearable maxlength="50"
                                  show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="表类型" prop="tableType">
                        <el-select v-model="form.tableType" placeholder="表类型" clearable filterable class="w-full">
                            <template v-for="{itemValue,itemText} in formTableType">
                                <el-option :value="itemValue" :label="itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="表单分类" prop="formCategory">
                        <el-select v-model="form.formCategory" placeholder="表单分类" clearable filterable class="w-full">
                            <template v-for="{itemValue,itemText} in formCategory">
                                <el-option :value="itemValue" :label="itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="主键策略" prop="tableType">
                        <el-select v-model="form.idType" placeholder="主键策略" clearable filterable class="w-full">
                            <el-option value="UUID" label="UUID(36位唯一编码)"></el-option>
                            <el-option value="NATIVE" label="NATIVE(自增长方式)"></el-option>
                            <el-option value="SEQUENCE" label="SEQUENCE(序列方式)"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="查询模式" prop="queryMode">
                        <el-select v-model="form.queryMode" placeholder="查询模式" clearable filterable class="w-full">
                            <template v-for="{itemValue,itemText} in queryMode">
                                <el-option :value="itemValue" :label="itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="主题模版" prop="themeTemplate">
                        <el-select v-model="form.themeTemplate" placeholder="主题模版" clearable filterable class="w-full">
                            <el-option value="normal" label="默认主题"></el-option>
                            <el-option value="erp" label="ERP主题(一对多)"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="表单风格" prop="formTemplate">
                        <el-select v-model="form.formTemplate" placeholder="表单风格" clearable filterable class="w-full">
                            <template v-for="{itemValue,itemText} in formTemplate">
                                <el-option :value="itemValue" :label="itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="滚动条" prop="scroll">
                        <el-select v-model="form.scroll" placeholder="滚动条" clearable filterable class="w-full">
                            <el-option :value="0" label="无"></el-option>
                            <el-option :value="1" label="有"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="显示复选框" prop="isCheckbox">
                        <el-select v-model="form.isCheckbox" placeholder="显示复选框" clearable filterable class="w-full">
                            <template v-for="item in select.isCheckbox">
                                <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
                    <el-form-item label="是否分页" prop="isPage">
                        <el-select v-model="form.isPage" placeholder="是否分页" clearable filterable class="w-full">
                            <template v-for="item in select.isPage">
                                <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs = "24" :sm = "12" :md="12" :lg = "12" :xl = "8">
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
                    <dbprops :data="tabs.data" @getData = "getData"></dbprops>
                </el-tab-pane>
                <el-tab-pane label="页面属性" name="pageProps">
                    <page-props :data="tabs.data" @getData = "getData"></page-props>
                </el-tab-pane>
                <el-tab-pane label="校验字段" name="validFields">
                    <valid-fields :data="tabs.data" @getData = "getData"></valid-fields>
                </el-tab-pane>
                <el-tab-pane label="外键" name="foreignKeys">
                    <foreign-keys :data="tabs.data" @getData = "getData"></foreign-keys>
                </el-tab-pane>
                <el-tab-pane label="索引" name="index">
                    <index :data="data.formInfo" ref="index"></index>
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, sweetAlert} from '@/utils'
    import Dbprops from './modify/DbProps'
    import PageProps from './modify/PageProps'
    import ValidFields from './modify/ValidFields'
    import ForeignKeys from './modify/ForeignKeys'
    import Index from './modify/Index'
    import {isEmpty} from '30-seconds-of-code'

    export default {
        name: "Modify",
        props: {
            data: {
                type: Object,
            }
        },
        components: {
            Dbprops,
            PageProps,
            ValidFields,
            ForeignKeys,
            Index
        },
        data() {
            return {
                form: {
                    tableName : '',                                     //表名
                    tableTxt : '',                                  //表描述
                    tableType : 'single',                           //表类型
                    formCategory : 'bdfl_include',                     //表单分类
                    isCheckbox: 'N',
                    isPage: 'Y',
                    isTree: 'N',
                    themeTemplate : 'normal',
                    scroll : 0
                },
                rules: {
                    tableName: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    tableTxt: [
                        {required: true, message: '必填', trigger: 'change'}
                    ]
                },
                select: {
                    isCheckbox: [
                        {itemText: '否', itemValue: 'N'},
                        {itemText: '是', itemValue: 'Y'},
                    ],
                    isPage: [
                        {itemText: '否', itemValue: 'N'},
                        {itemText: '是', itemValue: 'Y'},
                    ],
                    isTree: [
                        {itemText: '否', itemValue: 'N'},
                        {itemText: '是', itemValue: 'Y'},
                    ]
                },
                tabs: {
                    current: 'dbProps',
                    data: {}
                }
            }
        },
        computed: {
            ...mapState({
                formTableType: ({dict}) => dict.formTableType,
                formCategory : ({dict}) => dict.formCategory,
                formTemplate : ({dict}) => dict.formTemplate,
                queryMode: ({dict}) => dict.queryMode,
            })
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        let {formInfo, formInfo: {id, tableType}, tableInfo} = props
                        this.form = {
                            ...this.form,
                            ...formInfo,
                            tableType: tableType.toString()
                        }
                        this.tabs = {
                            ...this.tabs,
                            data: tableInfo
                        }
                        this.checkUniqueTable(id)
                    }
                },
                immediate: true
            },
        },
        methods: {
            getData(data){
                this.tabs = {
                    ...this.tabs,
                    data
                }
            },
            handleClick() {

            },
            async tableNameCheck(rule, tableName, callback){
                let {id} = this.form
                let params = {
                    tbname: tableName,
                    id : id ? id : ''
                }
                if (tableName) {
                    let {success, message} = await http.get(apiList.online_form_table_name_check, params)
                    if (success) {
                        callback();
                    } else {
                        callback(new Error(message));
                    }
                }
            },
            checkUniqueTable(id) {
                if (id) {
                    this.rules = {
                        ...this.rules,
                        tableName: [
                            {required: true, message: '必填',trigger: "change"},
                        ]
                    }
                } else {
                    this.rules = {
                        ...this.rules,
                        tableName: [
                            {required: true, message: '必填',trigger: "change"},
                            {validator: this.tableNameCheck}
                        ]
                    }
                }
            },
            async saveData() {
                let {table: {data: indexs}} = this.$refs.index
                let {data: fields} = this.tabs
                let {id} = this.form
                let params = {
                    head: this.form,
                    fields,
                    indexs,
                    deleteFieldIds: [],
                    deleteIndexIds: [],
                }
                let res
                if (id) {
                    res = await http.put(apiList.online_form_edit, params)
                } else {
                    res = await http.post(apiList.online_form_add, params)
                }
                let {success, message} = res
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            },
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>