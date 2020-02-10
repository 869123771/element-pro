<template>
    <div class = "sign text-center">
       <div class = "mt-5">
           <i class = "el-icon-circle-check text-size text-green-500"></i>
       </div>
        <div class = "text-2xl font-bold text-green-600 pt-5 mt-5">
            {{data.message}}
        </div>
        <div class = "mt-2 font-xl text-gray-600">
            {{current}}
        </div>
    </div>
</template>

<script>
    import dayjs from 'dayjs'
    import 'dayjs/locale/zh-cn'
    import LocalizedFormat from 'dayjs/plugin/localizedFormat'

    dayjs.extend(LocalizedFormat)

    export default {
        name: "SignImmediate",
        props : {
            data : {
                type : Object
            }
        },
        computed : {
            current(){
                return `${dayjs().locale('zh-cn').format('ll') + ' ' + dayjs().locale('zh-cn').format('dddd')}`
            }
        }
    }
</script>

<style scoped lang = "less">
    .sign{
        .text-size{
            font-size : 8rem;
        }
    }
</style>