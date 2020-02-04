<template>
    <div class = "pt-4">
        <span>{{`/online/graphreport/chart/${data.id}`}}</span>
    </div>
</template>

<script>
    import {copyToClipboard} from '30-seconds-of-code'
    import {sweetAlert} from '@/utils'

    export default {
        name: "AddressConfig",
        props : {
            data : {
                type : Object
            }
        },
        methods : {
            saveData(){
                copyToClipboard(`/online/graphreport/chart/${this.data.id}`)
                sweetAlert.successWithTimer('复制成功')
                this.$emit('modifySuccess')
            }
        }
    }
</script>

<style scoped>

</style>