<template>
    <div class="p-3 m-3 bg-white">
        <el-row>
            <el-form :model="form" ref="form">
                <el-form-item label="请输入可访问的FileUrl地址" prop="fileUrl"
                              :rules="[{validator : urlCheck}]">
                    <el-input type="textarea" v-model="form.fileUrl"
                              :autosize="{ minRows: 4}"
                              placeholder="请输入内容，保证文档可访问，如http://www.file.cn/a.docx"
                              show-word-limit
                              :maxlength="1000"
                    ></el-input>
                </el-form-item>
                <el-button plain icon="el-icon-delete" @click="clean">清除</el-button>
                <el-button plain icon="el-icon-check" @click="view">查看</el-button>
                <el-dropdown trigger="click" @command="createFile">
                    <el-button type = "primary">
                        <i class="el-icon-plus"/><span>新建</span>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="word">
                            <i class = "icon iconfont icon-word"></i>
                            <span>文字文档</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="excel">
                            <i class = "icon iconfont icon-excel"></i>
                            <span>表格文档</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="ppt">
                            <i class = "icon iconfont icon-ppt"></i>
                            <span>演示文档</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-form-item>

                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>

<script>
    import {localSave} from "@/utils/modules/tools";

    export default {
        name: "webFile",
        data() {
            return {
                form: {
                    fileUrl: ''
                }
            }
        },
        methods: {
            urlCheck(rule, value, callback) {
                if (value) {
                    let testResult = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(value);
                    if (testResult) {
                        callback();
                    } else {
                        callback(new Error('请输入正确的file url'));
                    }
                } else {
                    callback(new Error('file url 不能位空'));
                }
            },
            clean() {
                this.$refs.form.resetFields()
            },
            view() {

            },
            createFile(template){
                localSave('CREATE_TEMPLATE_TYPE',template)
                window.open(`/#/modules/eoa/wps/createFile`,'_blank');
            },
        }
    }
</script>

<style scoped>

</style>
