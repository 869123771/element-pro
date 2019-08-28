<template>
    <div class = "ml-3">
        <el-radio-group v-model = "form.syncType">
            <template v-for = "item in radio.syncItem">
                <el-radio :label = "item.itemValue" class = "w-full py-2">{{item.itemText}}</el-radio>
            </template>
        </el-radio-group>
    </div>
</template>

<script>
    import {http, apiList, constant, mixin, sweetAlert} from '@/utils'

    export default {
        name: "SyncDb",
        props : {
            data : {
                type : Object
            }
        },
        data(){
            return {
                form : {
                    syncType : 'normal'
                },
                radio : {
                    syncItem : [
                        {itemValue : 'normal',itemText : '普通同步(保留表数据)'},
                        {itemValue : 'force',itemText : '强制同步(删除表,重新生成)'}
                    ]
                }
            }
        },
        methods : {
            async saveData(){
                let {id} = this.data
                let {syncType} = this.form

                let {success,message} = await http.post(`${apiList.online_form_db_sync}/${id}/${syncType}`)
                if (success) {
                    sweetAlert.successWithTimer(message)
                    this.$emit('modifySuccess')
                } else {
                    sweetAlert.error(message)
                }
            }
        }
    }
</script>

<style scoped>

</style>