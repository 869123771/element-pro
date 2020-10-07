<template>
    <div class="tinymce-editor">
        <editor v-model="myValue"
                :inline="inline"
                :init="init">
        </editor>
    </div>
</template>
<script>
    import tinymce from 'tinymce/tinymce'
    import Editor from '@tinymce/tinymce-vue'

    //样式
    import 'tinymce/skins/ui/oxide/skin.min.css'
    import 'tinymce/skins/ui/oxide/content.min.css'


    //主题
    import 'tinymce/themes/silver'

    // 编辑器插件plugins
    // 更多插件参考：https://www.tiny.cloud/docs/plugins/
    import 'tinymce/plugins/advlist'
    import 'tinymce/plugins/anchor'
    import 'tinymce/plugins/autolink'
    import 'tinymce/plugins/autoresize'
    import 'tinymce/plugins/autosave'   // 自动保存
    import 'tinymce/plugins/code' // 代码
    import 'tinymce/plugins/codesample'
    import 'tinymce/plugins/colorpicker'
    import 'tinymce/plugins/directionality'
    import 'tinymce/plugins/emoticons'
    import 'tinymce/plugins/fullscreen'
    import 'tinymce/plugins/hr'
    import 'tinymce/plugins/image'
    import 'tinymce/plugins/imagetools'
    import 'tinymce/plugins/insertdatetime'
    import 'tinymce/plugins/link' // 链接
    import 'tinymce/plugins/lists'
    import 'tinymce/plugins/media'
    import 'tinymce/plugins/nonbreaking'
    import 'tinymce/plugins/noneditable'
    import 'tinymce/plugins/pagebreak'
    import 'tinymce/plugins/paste' // 张贴
    import 'tinymce/plugins/preview'
    import 'tinymce/plugins/print'
    import 'tinymce/plugins/save'
    import 'tinymce/plugins/searchreplace'
    import 'tinymce/plugins/spellchecker'
    import 'tinymce/plugins/tabfocus'
    import 'tinymce/plugins/table'
    import 'tinymce/plugins/template'
    import 'tinymce/plugins/textpattern'
    import 'tinymce/plugins/visualblocks'
    import 'tinymce/plugins/visualchars'
    import 'tinymce/plugins/wordcount'

    import 'tinymce/plugins/contextmenu'

    import 'tinymce/plugins/imagetools' // 图片

    import 'tinymce/icons/default/icons'

    //本地化
    //import './utils/tinymce/langs/zh_CN.js'

    export default {
        components: {
            Editor
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            inline: {
                type: Boolean,
            },
            // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
            // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
            baseUrl: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            plugins: {
                type: [String, Array],
                default: 'advlist anchor autolink autosave code codesample,colorpicker directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textpattern visualblocks visualchars wordcount'
            },
            toolbar: {
                type: String,
                default: `code searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote removeformat subscript superscript codesample hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen`
            },
        },
        data() {
            return {
                init: {
                    language_url: `/tinymce/langs/zh_CN.js`,
                    language: 'zh_CN',
                    /*skin_url: `/tinymce/skins/ui/oxide`,
                    content_css: `/tinymce/skins/content/default/content.css`,*/
                    height: 300,
                    plugins: this.plugins,
                    toolbar: this.toolbar,
                    branding: false,
                    menubar: false,
                    fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 50px 56px 60px 64px',
                    // 自定义字间距
                    letterspacing_val: '1px 2px 3px 4px 5px',
                    paste_data_images: true,
                    setup: (editor) => {
                        // 自定义新的工具栏按钮
                        editor.ui.registry.addButton('customBtn', {
                            tooltip: '新的工具栏按钮',
                            text: '新的工具栏按钮',
                            onAction: () => {
                                window.alert('新的工具栏按钮')
                            }
                        })
                    },
                    // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
                    // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
//          images_upload_handler: (blobInfo, success, failure) => {
////            const img = 'data:image/jpeg;base64,' + blobInfo.base64()
////            success(img)
//          }
                },
                myValue: this.value,
                isShowFileDlg: false
            }
        },
        mounted() {
            //tinymce.init()
        },
        methods: {},
        watch: {
            value(newValue) {
                this.myValue = newValue
            },
            myValue(newValue) {
                this.$emit('input', newValue)
            }
        }
    }
</script>
<style scoped lang = "less">

</style>
