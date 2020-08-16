<template>
    <div class ="create-file">
        <iframe :src="src"/>
    </div>
</template>

<script>
    import {apiList,http} from '@/utils'
    import {localRead} from "@/utils/modules/tools";
    export default {
        name: "createFile",
        data(){
            return {
                src : ''
            }
        },
        methods : {
            async getCreateFilePath(){
                let params = {
                    template : localRead('CREATE_TEMPLATE_TYPE')
                }
                let {success,message} = await http.get(apiList.wps_web_file_get_template,params)
                if(success){
                    this.src = message
                }
            },
        },
        created(){
            this.getCreateFilePath()
        },
    }
</script>

<style scoped lang = "less">
    .create-file{
        iframe{
            width: 100%;
            height :  100vh;
        }
    }
</style>
