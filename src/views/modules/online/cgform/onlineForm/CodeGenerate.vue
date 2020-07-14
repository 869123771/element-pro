<template>
    <div class="code">
        <el-row>
            <el-form ref="form" :model="form" label-width="120px" status-icon :rules="rules">
                <el-form-item label="代码生成目录" prop="projectPath">
                    <el-input placeholder="代码生成目录" v-model="form.projectPath">
                        <template slot="append">
                            <span @click="selectFold" class = "cursor-pointer">
                                <i class="fa fa-fw fa-folder-open-o"></i>
                                <span>浏览</span>
                            </span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="页面风格" prop="jspMode">
                    <el-select v-model="form.jspMode" clearable filterable class="w-full">
                        <template v-for="item in select.jspMode">
                            <el-option :value="item.code" :label="item.note"></el-option>
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
                <el-form-item label="代码分层样式" prop="packageStyle">
                    <el-select v-model="form.packageStyle" clearable filterable disabled class="w-full">
                        <template v-for="item in select.packageStyle">
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
        <slide-out :visible.sync="drawer.show"
                   :dock ="drawer.direction"
                   :title="drawer.title"
                   :size="drawer.width"
                   :close-on-mask-click = "false"
                   allow-resize
        >
            <component :ref="component.ref" :is="component.type" :data="component.data"></component>
            <div slot = "footer" v-if = "drawer.showFooter">
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
        </slide-out>
        <drag-dialog :drag-dialog="dialog">
            <template v-for = "item in dialog.content">
                <p>{{item}}</p>
            </template>
            <template slot = "footer">
                <div class = "modal-footer text-center">
                    <el-button plain @click="download">下载到本地</el-button>
                    <el-button plain @click="cancel">取消</el-button>
                    <el-button type="primary" @click="cancel">确认关闭</el-button>
                </div>
            </template>
        </drag-dialog>
    </div>
</template>

<script>
    import {http, apiList, sweetAlert} from '@/utils'
    import list from '@/utils/modules/mixins/list'
    import {isEmpty} from '30-seconds-of-code'
    import DragDrawer from '@/components/dragDrawer'
    import DragDialog from '@/components/dragDialog'
    import PopoverConfirm from '@/components/popoverConfirm'
    import SelectFold from "./codeGenerate/SelectFold";
    import CustomButtom from "./CustomButtom";
    import {downloadFile} from '@/utils/modules/tools'
    import {mapMutations} from "vuex";

    export default {
        name: "CodeGenerate",
        props: {
            data: {
                type: Object
            }
        },
        components: {
            DragDrawer,
            DragDialog,
            PopoverConfirm
        },
        mixins: [list],
        data() {
            return {
                form: {
                    projectPath: '',                                           //代码生成目录
                    jspMode: 'many',                                               //页面风格
                    ftlDescription: '',                                        //功能说明
                    tableName: '',                                             //表名
                    entityName: '',                                            //实体类名
                    entityPackage: '',                                         //包名(小写)
                    packageStyle : 'service',                                   //代码分层样式
                    codeTypes: ['controller', 'service', 'dao', 'mapper', 'entity', 'vue'],          //需要生成的代码
                },
                select: {
                    jspMode: [],
                    packageStyle : [
                        {itemText : '业务分层',itemValue : 'service'}
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
                    direction: 'right',
                    showFooter: true,
                    data: {}
                },
                component: {
                    type: SelectFold,
                    ref: 'selectFold',
                    data: {}
                },
                dialog: {
                    width: '800',
                    height: '400',
                    title: '代码生成 成功了！',
                    name: 'generateSuccess',
                    showFooter: false,
                    content : []
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
            ...mapMutations({
                dialogLoading : 'DIALOG_LOADING',
            }),
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
            async download(){
                let {content} = this.dialog
                let params = {
                    fileList : encodeURI(content)
                }
                let {data, filename} = await http.getFileDownload(apiList.online_form_code_download, params)
                downloadFile(data, filename)
                this.cancel()
            },
            cancel(){
                this.$modal.hide(this.dialog.name)
                this.$emit('closeModal')
            },
            async saveData(){
                this.dialogLoading(true)
                let {codeTypes} = this.form
                let params = {
                    ...this.form,
                    codeTypes : codeTypes.join(',')
                }
                let {success,result} = await http.post(apiList.online_form_code_generate,params)
                if(success){
                    this.dialogLoading(false)
                    this.$emit('hideModal')
                    this.$nextTick(()=>{
                        this.dialog = {
                            width: 1000,
                            height: 480,
                            title: '代码生成 成功了！',
                            name: 'generateSuccess',
                            showFooter: false,
                            content: result
                        }
                        let {name} = this.dialog
                        this.$modal.show(name)
                    })
                }else{
                    sweetAlert.errorWithTimer(message)
                }
            },
            async getRowInfo(row) {
                let {id:code, tableName, ...res} = row
                let {success, result} = await http.get(apiList.online_form_head_table_info, {code})
                if (success) {
                    let {main, projectPath,jspModeList} = result
                    this.form = {
                        ...this.form,
                        ...res,
                        code,
                        projectPath,
                        ftlDescription : tableName,
                        entityName : this.pascalCase(tableName),
                        tableName
                    }
                    this.select = {
                        ...this.select,
                        jspMode : jspModeList
                    }
                }
            }
        },
    }
</script>

<style scoped lang = "less">
    .modal-footer{
        position: absolute;
        bottom: 0px;
        background: #fff;
        z-index: inherit;
        width: 100%;
        border-top: 1px solid #e2e8f0;
        height: 60px;
        line-height: 60px;
        min-height: 60px;
        left: 0px;
    }
</style>
