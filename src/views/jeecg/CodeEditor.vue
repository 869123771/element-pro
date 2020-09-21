<template>
    <div class = "p-3 m-3 bg-white">
        <prism-editor
                v-model="presm.code"
                class="my-editor"
                :highlight="highlighter"
                :line-numbers="presm.lineNumbers"
        ></prism-editor>
    </div>
</template>

<script>
    import {PrismEditor} from "vue-prism-editor";
    import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

    // import highlighting library (you can use any library you want just return html string)
    import {highlight, languages} from "prismjs/components/prism-core";
    import loadLanguages from "prismjs/components"
    import "prismjs/components/prism-clike";
    import "prismjs/components/prism-splunk-spl";
    import "prismjs/components/prism-javascript";
    import "prismjs/themes/prism-dark.css"; // import syntax highlighting styles
    export default {
        name: "CodeEditor",
        components: {
            PrismEditor,
        },
        data() {
            return {
                presm: {
                    code: ' source="Sampledata.zip:./apache*" action=purchase [search sourcetype=access_* action=purchase|top limit=1 clientip|table clientip] | stats count, values(product_id) as product_id by clientip |rename count AS "购买数量",product_id AS "购买产品内容" clientip AS "vip用户"',
                    lineNumbers: true
                },
                code: 'const a = b'
            }
        },
        methods: {
            highlighter(code) {
                return highlight(code, languages.splunk-spl,'splunk-spl');   //returns html
            }
        }
    }
</script>

<style scoped>
    .my-editor{
       /* !* we dont use `language-` classes anymore so thats why we need to add background and text color manually *!
        background: #2d2d2d;
        color: #ccc;

        !* you must provide font-family font-size line-height. Example: *!
        font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
        font-size: 14px;
        line-height: 1.5;
        padding: 5px;*/
    }
</style>
