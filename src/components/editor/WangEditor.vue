<template>
    <div class = "editor">
        <div ref="editor"></div>
    </div>
</template>

<script>
    import E from 'wangeditor'
    export default {
        name: 'WangEditor',
        props : {
            editorContent : {
                type : String
            }
        },
        data () {
            return {
                content : ''
            }
        },
        watch : {
            editorContent :  {
                handler(value){
                    this.$nextTick(()=>{
                        this.editor.txt.html(value)
                    })
                },
                immediate : true
            }
        },
        methods: {
            initEditor(){
                this.editor = new E(this.$refs.editor)
                this.editor.customConfig = {
                    ...this.editor.customConfig,
                    menus : [
                        'head',  // 标题
                        'bold',  // 粗体
                        'fontSize',  // 字号
                        'fontName',  // 字体
                        'italic',  // 斜体
                        'underline',  // 下划线
                        'strikeThrough',  // 删除线
                        'foreColor',  // 文字颜色
                        'backColor',  // 背景颜色
                        'link',  // 插入链接
                        'list',  // 列表
                        'justify',  // 对齐方式
                        'quote',  // 引用
                        'emoticon',  // 表情
                        'image',  // 插入图片
                        'table',  // 表格
                        'video',  // 插入视频
                        'code',  // 插入代码
                        'undo',  // 撤销
                        'redo'  // 重复
                    ],
                    zIndex : 100,
                    onchange : (html)=>{
                        this.content = html
                    }
                }
                /*this.editor.customConfig.onchange = (html) => {
                    this.content = html
                }*/
                this.editor.create()
            }
        },
        mounted() {
            this.initEditor()
        }
    }
</script>

<style scoped lang="less">

</style>