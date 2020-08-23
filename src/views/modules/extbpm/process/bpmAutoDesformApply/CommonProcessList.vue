<template>
    <div>
        <el-row class = "mt-3">
            <el-card>
                <div slot = "header">
                    <span>测试流程</span>
                </div>
                <div class = "grid grid-cols-5">
                    <template v-for = "item in data.filter(item=>item.procType === 'test')">
                        <el-checkbox-group v-model = "checked.testProcess" @change = "checked.oaOffice = []">
                            <el-checkbox :label = "item.id">{{item.desformName}}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </div>
            </el-card>
        </el-row>
        <el-row class = "mt-3">
            <el-card>
                <div slot = "header">
                    <span>OA办公</span>
                </div>
                <div class = "grid grid-cols-5">
                    <template v-for = "item in data.filter(item=>item.procType === 'oa')">
                        <el-checkbox-group v-model = "checked.oaOffice" @change = "checked.testProcess = []">
                            <el-checkbox :label = "item.id">{{item.desformName}}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </div>
            </el-card>
        </el-row>
    </div>
</template>

<script>
    import {http, apiList, constant, sweetAlert} from '@/utils'
    export default {
        name: "CommonProcessList",
        props : {
            data : {
                type : Array
            }
        },
        data(){
            return {
                checked : {
                    testProcess : [],
                    oaOffice : []
                }
            }
        },
        watch : {
            data : {
                handler(pros){
                    if(pros){
                        this.commonProcessQuery()
                    }
                },
                immediate : true
            },
        },
        methods : {
            selectAll(){
                this.checked = {
                    ...this.checked,
                    testProcess : this.data.filter(item=>item.procType === 'test').map(item=>item.id),
                    oaOffice : this.data.filter(item=>item.procType === 'oa').map(item=>item.id),
                }
            },
            cancelAll(){
                this.checked = {
                    ...this.checked,
                    testProcess : [],
                    oaOffice : [],
                }
            },
            async commonProcessQuery(){
                let {success, result} = await http.get(apiList.oa_office_work_order_apply_common_process_checked_query)
                if (success) {
                    let testProcess = result.filter(item=>item.procType === 'test').map(item=>item.id)
                    let oaOffice = result.filter(item=>item.procType === 'oa').map(item=>item.id)
                    this.checked = {
                        ...this.checked,
                        testProcess,
                        oaOffice
                    }
                }
            },
        },
    }
</script>

<style scoped>

</style>
