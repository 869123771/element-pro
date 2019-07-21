<template>
    <div class = "disk-monitor bg-white m-3">
        <el-row>
            <div class = "disk-monitor-title">磁盘监控</div>
        </el-row>
        <el-row classs = "p-3">
            <template v-for = "item in charData">
                <el-col :span = "8">
                    <gauge-disk :datas = "item"></gauge-disk>
                </el-col>
            </template>
        </el-row>

    </div>
</template>

<script>
    import {http,apiList,constant} from '@/utils'
    import GaugeDisk from './diskMonitoring/GaugeDisk'

    export default {
        name: "DiskMonitoring",
        components : {
            GaugeDisk
        },
        data(){
            return {
                charData : []
            }
        },
        methods : {
            async initChar(){
                let {success,result} = await http.get(apiList.monitor_performance_disk_info_query)
                if(success){
                    result.forEach(item=>{
                        let {restPPT} = item
                        item.value = restPPT
                    })
                    this.charData = result
                }
            }
        },
        created(){
            this.initChar()
        }
    }
</script>

<style scoped lang = "less">
    .disk-monitor{
        &-title{
            height : 50px;
            line-height: 50px;
            border-bottom: 1px solid #ebeef5;
            padding: 0 1rem;
            font-size: 20px;
            font-weight: 400;
        }
    }
</style>