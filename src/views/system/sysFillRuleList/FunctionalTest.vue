<template>
    <div class = "pt-8 flex">
        <div>
            <i class = "el-icon-info text-blue-500 text-3xl"></i>
        </div>
        <div class = "pl-3">
            <div class = "text-lg">填值规则功能测试</div>
            <div class = "mt-3 text-gray-700">生成结果:<span class = "pl-3">{{code}}</span></div>
        </div>
    </div>
</template>

<script>
    import {http,apiList,sweetAlert} from '@/utils'
    export default {
        name: "FunctionalTest",
        props : {
            data : {
                type : Object
            }
        },
        data(){
          return {
              code : ''
          }
        },
        watch : {
            data : {
                handler(props){
                    if(props){
                        let {ruleCode} = props
                        this.getRuleCode(ruleCode)
                    }
                },
                immediate : true
            }
        },
        methods : {
            async getRuleCode(ruleCode){
                let {success,message,result} = await http.get(apiList.sys_fill_rule_generate_code,{ruleCode})
                if(success){
                    this.code = Array.isArray(result) ? result.join(',') : result
                }else{
                    sweetAlert.error(message)
                }
            }
        }
    }
</script>

<style scoped>

</style>