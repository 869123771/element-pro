<template>
    <div class="identify">
        <el-form-item prop="captcha">
            <el-input v-model="form.captcha" size="large" clearable placeholder="请输入右侧验证码">
                <i slot="prefix" class="el-input__icon el-icon-key"></i>
            </el-input>
            <div class="slot-code" @click="getCheckCode">
                <img :src = "checkCodeSrc">
            </div>
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
                checkCodeSrc : ''
            }
        },
        methods: {
            async getCheckCode() {
                let {checkKey} = this.form
                let {success,result} = await http.get(apiList.login_check_code + checkKey)
                if(success){
                    this.checkCodeSrc = result
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
            img{
                height : 35px
            }
            display: flex;
            align-items: center;
            position: absolute;
            right: 10px;
            top: 0px;
            line-height: 40px;
            height : 40px;
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
