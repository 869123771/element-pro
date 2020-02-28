<template>
    <div>
        <el-form :model="form" :rules="rules">
            <el-form-item prop="value">
                <el-input v-model="form.value" placeholder="功能测试"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="inline-block text-center pr-2" v-for="(v,i) in codeValue" :key="i">
                    <div class="code-list">
                        <el-button plain>{{v}}</el-button>
                        <p>{{i+1}}</p>
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {http, apiList} from '@/utils'

    export default {
        name: "FunctionalTest",
        props: {
            data: {
                type: Object
            }
        },
        data() {
            let codeCheck = async (rule, value, callback) => {
                let {ruleCode} = this.data
                let params = {
                    ruleCode,
                    value,
                }
                let {success, message} = await http.get(apiList.sys_check_rule_check_by_code, params)
                if (!success) {
                    callback(new Error(message));
                } else {
                    callback();
                }
            }
            return {
                form: {
                    value: ''
                },
                rules: {
                    value: [
                        {validator: codeCheck}
                    ]
                }
            }
        },
        computed: {
            codeValue() {
                let codeValue = []
                let {value} = this.form
                if (value) {
                    codeValue = value.split('')
                }
                return codeValue
            }
        },
        methods: {}
    }
</script>

<style scoped lang="less">
    /deep/ .code-list {
        .el-button {
            height: 36px;
            width: 36px;
            line-height: 36px;
            padding: 0px;
        }
    }
</style>