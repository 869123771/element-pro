<template>
    <monaco-editor
            :language="editor.language"
            :codes="editor.code"
    >

    </monaco-editor>
</template>

<script>
    import MonacoEditor from '@/components/editor/MonacoEditor'

    export default {
        components: {
            MonacoEditor
        },

        data() {
            return {
                editor: {
                    code: 'const noop = () => {}',
                    language: 'javascript',
                }
            }
        },
        methods: {}
    }
</script>

<style>

</style>