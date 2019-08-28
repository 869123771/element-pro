<template>
    <div
            class="container w-full"
            ref="container"
            :style="{height:editorHeight}"
    >

    </div>
</template>

<script>
    import * as monaco from 'monaco-editor';

    export default {
        name: 'MonacoEditor',
        props: {
            editorProps : {
                type : Object,
            },
            code: {
                type: String,
                default:  ()=> {
                    return ''
                }
            },
            language: {
                type: String,
                default:  ()=> {
                    return 'html'
                }
            },
            theme: {
                type: String,
                default:  ()=> {
                    return 'vs'
                }
            },
            editorHeight : {
                type: String ,
                default : ()=> {
                    return '500px'
                }
            },
            editorOptions: {
                type: Object,
                default:  ()=> {
                    return {
                        selectOnLineNumbers: true,
                        roundedSelection: false,
                        readOnly: false,        // 只读
                        cursorStyle: 'line',        //光标样式
                        automaticLayout: false, //自动布局
                        glyphMargin: true,  //字形边缘
                        useTabStops: false,
                        fontSize: 28,       //字体大小
                        autoIndent: true,//自动布局
                        quickSuggestionsDelay: 500,   //代码提示延时
                        acceptSuggestionOnEnter : 'smart'
                    }
                }
            }
        },

        data() {
            return {
                editor: {
                    code: '',
                    theme : 'vs',
                    language : 'javascript',
                },
            }
        },
        watch : {
            editorProps : {
                handler(props){
                    this.editor = {
                        ...this.editor,
                        ...props
                    }
                },
                immediate : true
            }
        },
        mounted() {
            this.initEditor();
        },
        methods: {
            initEditor() {
                let {code,theme,language} = this.editor
                this.monacoEditor = monaco.editor.create(this.$refs.container, {
                    value : code,
                    language,
                    theme,    //vs, hc-black, or vs-dark
                    editorOptions: this.editorOptions,
                });
                this.$emit('onMounted', this.monacoEditor);                      //编辑器创建完成回调
                this.monacoEditor.onDidChangeModelContent((event) => {            //编辑器内容changge事件
                    debugger;
                    console.log(this.monacoEditor)
                    debugger;
                    this.editor = {
                        ...this.editor,
                        code: this.monacoEditor.getValue()
                }

                    this.$emit('onCodeChange', this.monacoEditor.getValue(), event);
                });
                //编辑器随窗口自适应
                window.addEventListener('resize', () => {
                    this.initEditor();
                })
            },
        }
    }
</script>

<style>

</style>