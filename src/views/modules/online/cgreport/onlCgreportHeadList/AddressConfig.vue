<template>
    <div class = "pt-4">
        <span>{{content}}</span>
    </div>
</template>

<script>
    import {copyToClipboard} from '30-seconds-of-code'
    import {http,apiList,sweetAlert} from '@/utils'
    import qs from 'qs'
    export default {
        name: "AddressConfig",
        props : {
            data : {
                type : Object
            }
        },
        data(){
            return {
                content : ''
            }
        },
        watch : {
            data : {
                handler(props){
                    if(props){
                        this.getParamsInfoById(props.id)
                    }
                },
                immediate : true
            },
        },
        methods : {
            async getParamsInfoById(id){

                let {success,result} = await http.get(apiList.online_report_params_info_by_id + id)
                if(success){
                    let params = {}
                    result.map(({paramName})=>paramName).forEach(v=>{
                        params[v] = '${' + v + '}'
                    })
                    this.content = `/online/cgreport/${id}?${qs.stringify(params,{encode:false})}`
                }
            },
            saveData(){
                copyToClipboard(this.content)
                sweetAlert.successWithTimer('复制成功')
                this.$emit('modifySuccess')
            }
        }
    }
</script>

<style scoped>

</style>