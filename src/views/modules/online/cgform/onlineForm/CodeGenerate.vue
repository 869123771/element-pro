<template>
    <div class="code">
        <el-row>
            <el-form ref="form" :model="form" label-width="120px" status-icon :rules="rules">
                <el-form-item label="代码生成目录" prop="projectPath">
                    <el-input placeholder="代码生成目录" v-model="form.projectPath">
                        <template slot="append">
                            <span @click="selectFold">
                                <i class="fa fa-fw fa-folder-open-o"></i>
                                <span>浏览</span>
                            </span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="代码分层样式" prop="jspMode">
                    <el-select v-model="form.jspMode" clearable filterable class="w-full">
                        <template v-for="item in select.jspMode">
                            <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="功能说明" prop="ftlDescription">
                    <el-input v-model="form.ftlDescription" placeholder="功能说明" clearable></el-input>
                </el-form-item>
                <el-form-item label="表名" prop="tableName">
                    <el-input v-model="form.tableName" placeholder="表名" clearable readonly></el-input>
                </el-form-item>
                <el-form-item label="实体类名" prop="entityName">
                    <el-input v-model="form.entityName" placeholder="实体类名" clearable></el-input>
                </el-form-item>
                <el-form-item label="包名(小写)" prop="entityPackage">
                    <el-input v-model="form.entityPackage" placeholder="包名(小写)" clearable></el-input>
                </el-form-item>
                <el-form-item label="页面风格" prop="jformType">
                    <el-select v-model="form.jformType" clearable filterable class="w-full">
                        <template v-for="item in select.jformType">
                            <el-option :value="item.itemValue" :label="item.itemText"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="需要生成的代码" prop="codeTypes">
                    <el-checkbox-group v-model="form.codeTypes">
                        <template v-for="item in select.codeTypes">
                            <el-checkbox :label="item.itemValue">{{item.itemText}}</el-checkbox>
                        </template>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </el-row>
        <drag-drawer v-model="drawer.show"
                     :draggable="drawer.draggable"
                     :title="drawer.title"
                     :width.sync="drawer.width"
                     :direction="drawer.direction"
                     :scrollable="true"
        >

            <component :ref="component.ref" :is="component.type" :data="component.data"></component>
            <div class="dialog-footer p-2 w-full" v-show="drawer.showFooter">
                <div class="flex justify-end">
                    <popover-confirm @confirm="popoverConfirm" class="mx-2">
                        <div slot="popover-title">确定要关闭吗</div>
                        <div slot="popover-content">
                            <el-button plain>取消</el-button>
                        </div>
                    </popover-confirm>
                    <el-button type="primary" @click="submit">提交</el-button>
                </div>
            </div>
        </drag-drawer>
    </div>
</template>

<script>
    import {http, apiList, sweetAlert, mixin} from '@/utils'
    import {isEmpty} from '30-seconds-of-code'
    import DragDrawer from '@/components/dragDrawer'
    import PopoverConfirm from '@/components/popoverConfirm'
    import SelectFold from "./codeGenerate/SelectFold";

    export default {
        name: "CodeGenerate",
        props: {
            data: {
                type: Object
            }
        },
        components: {
            DragDrawer,
            PopoverConfirm
        },
        mixins: [mixin],
        data() {
            return {
                form: {
                    projectPath: '',                                           //代码生成目录
                    jspMode: '1',                                               //代码分层样式
                    ftlDescription: '',                                        //功能说明
                    tableName: '',                                             //表名
                    entityName: '',                                            //实体类名
                    entityPackage: '',                                         //包名(小写)
                    jformType: '1',                                             //页面风格
                    codeTypes: ['controller', 'service', 'dao', 'mapper', 'entity', 'vue'],                                             //需要生成的代码
                },
                select: {
                    jspMode: [
                        {itemValue: '1', itemText: '业务分层'}
                    ],
                    jformType: [
                        {itemValue: '1', itemText: '弹窗风格表单'},
                        {itemValue: '2', itemText: '抽屉风格表单'},
                    ],
                    codeTypes: [
                        {itemValue: 'controller', itemText: 'controller'},
                        {itemValue: 'service', itemText: 'service'},
                        {itemValue: 'dao', itemText: 'dao'},
                        {itemValue: 'mapper', itemText: 'mapper'},
                        {itemValue: 'entity', itemText: 'entity'},
                        {itemValue: 'vue', itemText: 'vue'},
                    ]
                },
                rules: {
                    projectPath: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    tableName: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    entityName: [
                        {required: true, message: '必填', trigger: 'change'}
                    ],
                    entityPackage: [
                        {required: true, message: '必填', trigger: 'change'}
                    ]
                },
                drawer: {
                    show: false,
                    direction: 'rtl',
                    draggable: true,
                    showFooter: true,
                    data: {}
                },
                component: {
                    type: SelectFold,
                    ref: 'selectFold',
                    data: {}
                },
            }
        },
        watch: {
            data: {
                handler(props) {
                    if (!isEmpty(props)) {
                        this.getRowInfo(props)
                    }
                },
                immediate: true
            },
        },
        methods: {
            pascalCase(string) {
                const camelCase = this.camelCase(string)
                return camelCase.slice(0,1).toUpperCase() + camelCase.slice(1)
            },
            camelCase(string){
                return string.replace(/\_(\w)/g, (all, letter) => {
                    return letter.toUpperCase()
                });
            },
            selectFold() {
                this.drawer = {
                    ...this.drawer,
                    title: '选择文件目录',
                    width: '500px',
                    showFooter: true,
                    show: true
                }
                this.component = {
                    ...this.component,
                    type: SelectFold,
                    ref: 'selectFold',
                    data: {}
                }
            },
            submit() {
                let {ref} = this.component
                let {tree: {current}} = this.$refs[ref]
                if (current.isLeaf) {
                    sweetAlert.errorWithTimer('请选择目录')
                } else {
                    this.form = {
                        ...this.form,
                        projectPath: current.key
                    }
                }
                this.drawer = {
                    ...this.drawer,
                    show: false,
                }
            },
            async saveData(){
                let {codeTypes} = this.form
                let params = {
                    ...this.form,
                    codeTypes : codeTypes.join(',')
                }
                let {success,message} = await http.post(apiList.online_form_code_generate,params)
                if(success){
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            async getRowInfo(row) {
                let {id:code, tableName, ...res} = row
                let {success, result} = await http.get(apiList.online_form_head_table_info, {code})
                if (success) {
                    let {main, projectPath} = result
                    this.form = {
                        ...this.form,
                        ...res,
                        code,
                        projectPath,
                        ftlDescription : tableName,
                        entityName : this.pascalCase(tableName),
                        tableName
                    }
                }
            }
        },
    }
</script>

<style scoped>

</style>