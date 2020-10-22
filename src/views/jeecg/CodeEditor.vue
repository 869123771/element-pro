<template>
    <div class = "p-3 m-3 bg-white">
        <el-row class = "my-3">
            <prism-editor
                    v-model="preSm.code"
                    class="my-editor"
                    :highlight="highlighter"
                    :line-numbers="preSm.lineNumbers"
            ></prism-editor>
        </el-row>
        <el-row class = "my-4">
            <TinymceEditor v-model="content"></TinymceEditor>
        </el-row>
        <!--<el-row class = "my-4">
            <editor v-model="editor.content"
                    @init="editorInit"
                    :ref = "editor.ref"
                    :lang="editor.lang"
                    :theme="editor.theme"
                    :options = "editor.options"
                    :height="editor.height"></editor>
        </el-row>-->
        <el-row class = "my-4">
            <vxe-table
                    keep-source
                    :data="table.data"
                    :tooltip-config="{enabled: true}"
                    :sort-config="{iconAsc: 'fa fa-chevron-up', iconDesc: 'fa fa-chevron-down'}"
                    :keyboard-config="{isArrow: true}"
                    :checkbox-config="{trigger: 'row', highlight: false, range: false}"
                    :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
                    :edit-rules="validRules"
            >
                <vxe-table-column v-for="(config, index) in table.column" :key="index" v-bind="config"></vxe-table-column>
            </vxe-table>
        </el-row>
        <el-row class = "my-4">
            <vue-live
                    class = "live-editor"
                    :delay="2000"
                    :code="liveEditor.code"
                    :editorProps = "liveEditor"
            />
        </el-row>
    </div>
</template>

<script>

    import TinymceEditor from '@/components/editor/Tinymce'

    import {PrismEditor} from "vue-prism-editor";
    import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

    // import highlighting library (you can use any library you want just return html string)
    import {highlight, languages} from "prismjs/components/prism-core";
    //import loadLanguages from "prismjs/components"
    import "prismjs/components/prism-clike";
    import "prismjs/components/prism-splunk-spl";
    import "prismjs/components/prism-javascript";
    import "prismjs/components/prism-sql";
    import "prismjs/themes/prism-dark.css"; // import syntax highlighting styles

    import { VueLive, VueLiveEditor, VueLivePreview } from "@/components/editor/liveEditor";

    export default {
        name: "CodeEditor",
        components: {
            PrismEditor,
            TinymceEditor,
            editor: require('vue2-ace-editor'),
            VueLive
        },
        data() {
            return {
                preSm: {
                    code: ' source="Sampledata.zip:./apache*" action=purchase [search sourcetype=access_* action=purchase|top limit=1 clientip|table clientip] | stats count, values(product_id) as product_id by clientip |rename count AS "购买数量",product_id AS "购买产品内容" clientip AS "vip用户"',
                    lineNumbers: true
                },
                content: '我是富文本编辑器',
                editor : {
                    content : '',
                    theme : 'chrome',
                    lang : 'sql',
                    ref : 'editor',
                    options : {
                        fontSize : 20,
                        showLineNumbers : true,
                        showGutter : true,                     //显示行号区域
                        displayIndentGuides : false,            //显示参考线
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: true,
                        enableEmmet : true,
                        minLines : 6,
                        maxLines : Infinity,
                    }
                },
                liveEditor : {
                    code : `<input type='button' value='I am Groot' />`,
                    theme : 'twilight',
                    lang : 'html',
                    ref : 'editor',
                    height : 500,
                    options : {
                        fontSize : 18,
                        showLineNumbers : true,
                        showGutter : true,                     //显示行号区域
                        displayIndentGuides : false,            //显示参考线
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: true,
                        enableEmmet : true,
                        //minLines : 6,
                        //maxLines : Infinity,
                    }
                }
            },
            validRules: {
                    name: [
                        { required: true, message: '必填' },
                    ],
                },
                table : {
                    column : [
                        { type: 'seq',title : '#', width: 60, fixed: null },
                        { type: 'checkbox', width: 50, fixed: null },
                        {
                            field: 'name',
                            title: 'Name',
                            width: 200,
                            editRender : {
                                name : 'ElInput',
                                props : {
                                    clearable : true
                                }
                            }
                        },
                        { field: 'nickname', title: 'Nickname'},
                        { field: 'sex', title: 'Sex', width: 200,sortable : true },
                        { field: 'role', title: 'Role', width: 200 },
                        { field: 'address', title: 'Address', width: 300, showOverflow: true }
                    ],
                     data : [
                         { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'vxe-table 从入门到放弃aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
                         { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
                         { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
                         { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women ', age: 23, address: 'vxe-table 从入门到放弃' },
                         { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women ', age: 30, address: 'Shanghai' },
                         { id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: 'Women ', age: 21, address: 'vxe-table 从入门到放弃' },
                         { id: 10007, name: 'Test7', nickname: 'T7', role: 'Test', sex: 'Man ', age: 29, address: 'vxe-table 从入门到放弃' },
                         { id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: 'Man ', age: 35, address: 'vxe-table 从入门到放弃' }
                     ]
                }
            }
        },
        methods: {
            highlighter(code) {
                return highlight(code, languages['splunk-spl'],'splunk-spl');   //returns html
            },
            editorInit(){
                require('brace/ext/textarea')
                require('brace/ext/emmet')
                require('brace/ext/language_tools') //language extension prerequsite...
                require('brace/mode/sql')
                require('brace/mode/javascript')    //language
                require('brace/mode/less')
                require('brace/theme/chrome')
                require('brace/snippets/javascript')
                require('brace/snippets/sql')
            }
        }
    }
</script>

<style scoped>
    .my-editor{
        /*we dont use `language-` classes anymore so thats why we need to add background and text color manually */
       /* background: #2d2d2d;
        color: #ccc;
         !*you must provide font-family font-size line-height. Example*!
        font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
        font-size: 14px;
        line-height: 1.5;
        padding: 5px;*/
    }
</style>
