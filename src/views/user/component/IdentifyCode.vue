<template>
    <div class="identify">
        <el-form-item prop="code">
            <el-input v-model="form.code" size="large" clearable placeholder="请输入右侧验证码">
                <i slot="prefix" class="el-input__icon el-icon-key"></i>
            </el-input>
            <div class="slot-code" @click="getCheckCode">{{checkCode.code}}</div>
        </el-form-item>
    </div>
</template>

<script>
    import {http, constant, apiList, sweetAlert} from "@/utils";

    export default {
        name: "IdentifyCode",
        props: {
            form: {
                type: Object
            }
        },
        data() {
            return {
                checkCode : {
                    code : 'wywd',
                    key : ''
                }
            }
        },
        methods: {
            async getCheckCode() {
                //this.randomStr = Math.random().toString(36).slice(2, 6)
                let {success,result:{code,key}} = await http.get(apiList.login_check_code)
                if(success){
                    this.checkCode = {
                        ...this.checkCode,
                        code,
                        key
                    }
                }
            },
            codeInput() {

            }
        },
        mounted() {
            this.getCheckCode()
        }
    }
</script>

<style scoped lang="less">
    .identify {
        .slot-code {
            position: absolute;
            right: 10px;
            top: 0px;
            height: 24px;
            line-height: 24px;
            margin: 8px 0px;
            padding-left: 12px;
            border-left: 1px solid #cbd5e0;
            width: 76px;
            cursor: pointer;
            font-size: 20px;
            font-weight: 700;
            font-family: sans-serif;
        }
        /deep/ .el-input .el-input__suffix {
            right: 90px;
        }
        /deep/ .el-input--suffix .el-input__inner {
            padding-right: 114px;
        }
    }
</style>
