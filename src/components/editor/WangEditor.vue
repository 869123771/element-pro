<template>
    <div>
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
                    debugger;
                    this.$nextTick(()=>{
                      debugger;
                        this.editor.txt.html(value)
                    })
                },
                immediate : true
            }
        },
        methods: {
            initEditor(){
                this.editor = new E(this.$refs.editor)
                this.editor.customConfig.onchange = (html) => {
                    this.content = html
                }
                this.editor.create()
            }
        },
        mounted() {
            this.initEditor()
        }
    }
</script>

<style scoped>
</style>