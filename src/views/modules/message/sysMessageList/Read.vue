<template>
    <div class="read my-4">
        <el-row class = "pl-3">
            <el-form :model="form" label-width="100px">
                <el-form-item label="消息标题">
                    <span>{{form.esTitle}}</span>
                </el-form-item>
                <el-form-item label="发送内容">
                    <span>{{form.esContent}}</span>
                </el-form-item>
                <el-form-item label="发送所需参数">
                    <span>{{form.esParam}}</span>
                </el-form-item>
                <el-form-item label="接收人">
                    <span>{{form.esReceiver}}</span>
                </el-form-item>
                <el-form-item label="发送方式">
                    <span>{{form.esType_dictText}}</span>
                </el-form-item>
                <el-form-item label="发送时间">
                    <span>{{form.esSendTime}}</span>
                </el-form-item>
                <el-form-item label="发送状态">
                    <span>{{form.esSendStatus_dictText}}</span>
                </el-form-item>
                <el-form-item label="发送次数">
                    <span>{{form.esSendNum}}</span>
                </el-form-item>
                <el-form-item label="发送失败原因">
                    <span>{{form.esResult}}</span>
                </el-form-item>
                <el-form-item label="备注">
                    <span>{{form.remark}}</span>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {http, apiList, constant} from '@/utils'

    export default {
        name: "Read",
        props: {
            data: {
                type: Object
            },
        },
        data() {
            return {
                form: {},
            }
        },
        computed: {

        },
        watch: {
            data: {
                handler(props) {
                    if (props) {
                        this.form = {
                            ...props
                        }
                    }
                },
                immediate: true
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>